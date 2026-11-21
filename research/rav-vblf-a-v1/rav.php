<?php
declare(strict_types=1);

final class KobaltRav {
    public static function utf8(string $s): string { return $s; }
    public static function hex(string $b): string { return bin2hex($b); }
    public static function unhex(string $h): string { $b=hex2bin($h); if($b===false) throw new RuntimeException('hex inválido'); return $b; }
    public static function sha256(string $b): string { return hash('sha256',$b,true); }
    public static function sha256hex(string $b): string { return hash('sha256',$b); }
    public static function u16(int $n): string { if($n<0||$n>65535) throw new RuntimeException('slot fuera de uint16'); return pack('n',$n); }
    public static function readU16(string $b): int { if(strlen($b)<2) throw new RuntimeException('body sin slot'); return unpack('n',substr($b,0,2))[1]; }
    public static function bitLength(int $n): int { if($n===0)return 1; $k=0; while($n>0){$n=intdiv($n,2);$k++;} return $k; }

    private static function writeUInt(array &$bits, int $value, int $width): void {
        if($width<0) throw new RuntimeException('width inválido');
        if($width<63 && ($value<0 || $value >= (1<<$width))) throw new RuntimeException('entero no cabe');
        for($i=$width-1;$i>=0;$i--) $bits[]=(($value >> $i)&1);
    }
    private static function writeBytes(array &$bits, string $bytes): void { for($i=0;$i<strlen($bytes);$i++) self::writeUInt($bits,ord($bytes[$i]),8); }
    private static function bitsToBytes(array $bits): string {
        $n=(int)ceil(count($bits)/8); $out='';
        for($j=0;$j<$n;$j++){ $v=0; for($k=0;$k<8;$k++){ $i=$j*8+$k; $v=($v<<1)|(($i<count($bits))?$bits[$i]:0); } $out.=chr($v); }
        return $out;
    }
    private static function readBit(string $bytes, int &$pos, int $limit): int {
        if($pos >= $limit) throw new RuntimeException('RAV truncado'); $p=$pos++; return (ord($bytes[intdiv($p,8)]) >> (7-($p%8))) & 1;
    }
    private static function readUInt(string $bytes, int &$pos, int $width, int $limit): int {
        $v=0; for($i=0;$i<$width;$i++) $v=($v<<1)|self::readBit($bytes,$pos,$limit); return $v;
    }
    private static function readBytesFromBits(string $bytes, int &$pos, int $bitCount, int $limit): string {
        if($bitCount%8!==0) throw new RuntimeException('payload del perfil v3 debe ser byte-aligned'); $bits=[];
        for($i=0;$i<$bitCount;$i++) $bits[]=self::readBit($bytes,$pos,$limit); return self::bitsToBytes($bits);
    }

    public static function encode(int $slot, string $payload): array {
        $body=self::u16($slot).$payload; $L=strlen($body)*8; $k=self::bitLength($L); if($k>256) throw new RuntimeException('L excede perfil VBLF-A v1'); $W=$k-1;
        $prefix=[]; self::writeUInt($prefix,$W,8); self::writeUInt($prefix,$L,$k); self::writeBytes($prefix,$body);
        $digest=self::sha256(self::bitsToBytes($prefix));
        $record=$prefix; self::writeBytes($record,$digest); $bytes=self::bitsToBytes($record);
        return ['bytes'=>$bytes,'rid'=>self::sha256hex($bytes),'slot'=>$slot,'payload'=>$payload,'bodyBits'=>$L,'k'=>$k,'W'=>$W,'hash'=>bin2hex($digest),'bitLength'=>count($record)];
    }

    public static function decode(string $bytes): array {
        if(strlen($bytes)<34) throw new RuntimeException('RAV demasiado corto'); $limit=strlen($bytes)*8; $pos=0;
        $W=self::readUInt($bytes,$pos,8,$limit); $k=$W+1; if($k<1||$k>256) throw new RuntimeException('k inválido');
        $L=self::readUInt($bytes,$pos,$k,$limit); if($k!==self::bitLength($L)) throw new RuntimeException('LEN no canónico'); if($L<16||$L%8!==0) throw new RuntimeException('body debe tener slot y ser byte-aligned');
        $expectedBits=8+$k+$L+256; $expectedBytes=(int)ceil($expectedBits/8); if(strlen($bytes)!==$expectedBytes) throw new RuntimeException('longitud física inválida');
        $body=self::readBytesFromBits($bytes,$pos,$L,$limit); $digest=self::readBytesFromBits($bytes,$pos,256,$limit);
        while($pos<$limit) if(self::readBit($bytes,$pos,$limit)!==0) throw new RuntimeException('padding final no canónico');
        $prefix=[]; self::writeUInt($prefix,$W,8); self::writeUInt($prefix,$L,$k); self::writeBytes($prefix,$body); $expected=self::sha256(self::bitsToBytes($prefix));
        if(!hash_equals($expected,$digest)) throw new RuntimeException('hash lógico inválido'); $slot=self::readU16($body);
        return ['bytes'=>$bytes,'rid'=>self::sha256hex($bytes),'slot'=>$slot,'payload'=>substr($body,2),'bodyBits'=>$L,'k'=>$k,'W'=>$W,'hash'=>bin2hex($digest),'bitLength'=>$expectedBits];
    }

    public static function decodeAt(string $stream, int $byteOffset=0): array {
        if($byteOffset<0||$byteOffset>=strlen($stream)) throw new RuntimeException('offset inválido'); $tail=substr($stream,$byteOffset); $pos=0; $limit=strlen($tail)*8;
        $W=self::readUInt($tail,$pos,8,$limit); $k=$W+1; $L=self::readUInt($tail,$pos,$k,$limit); $totalBytes=(int)ceil((8+$k+$L+256)/8); if($totalBytes>strlen($tail)) throw new RuntimeException('stream truncado');
        $d=self::decode(substr($tail,0,$totalBytes)); $d['consumedBytes']=$totalBytes; $d['nextByteOffset']=$byteOffset+$totalBytes; return $d;
    }

    public static function canonicalJson(mixed $v): string {
        $canon=function($x) use (&$canon){
            if(is_array($x)){
                $isList=array_is_list($x); if($isList) return array_map($canon,$x);
                ksort($x,SORT_STRING); foreach($x as $k=>$val) $x[$k]=$canon($val); return $x;
            }
            if(is_object($x)) return $canon(get_object_vars($x)); return $x;
        };
        return json_encode($canon($v),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRESERVE_ZERO_FRACTION|JSON_THROW_ON_ERROR);
    }
}
