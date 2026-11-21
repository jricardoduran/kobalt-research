<?php
declare(strict_types=1);

final class Khipu5 {
    public const VERSION = 'K5.1';
    public const TYPES = [
        0x0000 => ['code'=>0x0000,'name'=>'binary','extension'=>'.bin','mime'=>'application/octet-stream'],
        0x0001 => ['code'=>0x0001,'name'=>'utf8-text','extension'=>'.txt','mime'=>'text/plain; charset=utf-8'],
        0x0002 => ['code'=>0x0002,'name'=>'json','extension'=>'.json','mime'=>'application/json'],
        0x0003 => ['code'=>0x0003,'name'=>'javascript','extension'=>'.js','mime'=>'text/javascript'],
        0x0004 => ['code'=>0x0004,'name'=>'php','extension'=>'.php','mime'=>'application/x-httpd-php'],
        0x0010 => ['code'=>0x0010,'name'=>'png','extension'=>'.png','mime'=>'image/png'],
        0x0011 => ['code'=>0x0011,'name'=>'jpeg','extension'=>'.jpg','mime'=>'image/jpeg'],
        0x0012 => ['code'=>0x0012,'name'=>'webp','extension'=>'.webp','mime'=>'image/webp'],
        0x0020 => ['code'=>0x0020,'name'=>'pdf','extension'=>'.pdf','mime'=>'application/pdf'],
        0x0030 => ['code'=>0x0030,'name'=>'zip','extension'=>'.zip','mime'=>'application/zip'],
        0x0040 => ['code'=>0x0040,'name'=>'wasm','extension'=>'.wasm','mime'=>'application/wasm'],
    ];

    private static function ok(bool $condition, string $message): void {
        if (!$condition) throw new RuntimeException($message);
    }
    public static function typeInfo(int $type): array {
        return self::TYPES[$type] ?? ['code'=>$type,'name'=>'unknown','extension'=>'.bin','mime'=>'application/octet-stream','unknown'=>true];
    }
    public static function bitLength(int $n): int {
        if ($n === 0) return 1;
        $k = 0;
        while ($n > 0) { $n = intdiv($n, 2); $k++; }
        return $k;
    }
    private static function writeUInt(array &$bits, int $value, int $width): void {
        self::ok($width >= 0, 'ancho inválido');
        if ($width === 0) return;
        self::ok($value >= 0, 'entero negativo');
        if ($width < PHP_INT_SIZE * 8 - 1) self::ok($value < (1 << $width), 'entero no cabe en el ancho');
        for ($i=$width-1; $i>=0; $i--) $bits[] = ($value >> $i) & 1;
    }
    private static function writeBytes(array &$bits, string $bytes): void {
        $n = strlen($bytes);
        for ($i=0; $i<$n; $i++) self::writeUInt($bits, ord($bytes[$i]), 8);
    }
    private static function bitsToBytes(array $bits): string {
        $n = (int)ceil(count($bits)/8);
        $out = '';
        for ($j=0; $j<$n; $j++) {
            $v=0;
            for ($k=0; $k<8; $k++) {
                $i=$j*8+$k;
                $v=($v<<1) | (($i<count($bits)) ? $bits[$i] : 0);
            }
            $out .= chr($v);
        }
        return $out;
    }
    private static function readBit(string $bytes, int &$pos, int $limit): int {
        self::ok($pos < $limit, 'registro truncado');
        $p=$pos++;
        return (ord($bytes[intdiv($p,8)]) >> (7-($p%8))) & 1;
    }
    private static function readUInt(string $bytes, int &$pos, int $width, int $limit): int {
        $v=0;
        for($i=0;$i<$width;$i++) $v=($v<<1)|self::readBit($bytes,$pos,$limit);
        return $v;
    }
    private static function readBytes(string $bytes, int &$pos, int $bitCount, int $limit): string {
        self::ok($bitCount % 8 === 0, 'K5.1 exige cuerpo byte-aligned');
        $bits=[];
        for($i=0;$i<$bitCount;$i++) $bits[]=self::readBit($bytes,$pos,$limit);
        return self::bitsToBytes($bits);
    }

    public static function encode(int $type, string $body): array {
        self::ok($type >= 0 && $type <= 0xffff, 'T debe ser uint16');
        $L = strlen($body) * 8;
        $k = self::bitLength($L);
        self::ok($k <= 256, 'L excede K5.1');
        $W = $k - 1;
        $prefix=[];
        self::writeUInt($prefix,$type,16);
        self::writeUInt($prefix,$W,8);
        self::writeUInt($prefix,$L,$k);
        self::writeBytes($prefix,$body);
        $digest = hash('sha256', self::bitsToBytes($prefix), true);
        $record = $prefix;
        self::writeBytes($record,$digest);
        $bytes = self::bitsToBytes($record);
        return [
            'version'=>self::VERSION,
            'bytes'=>$bytes,
            'rid'=>hash('sha256',$bytes),
            'type'=>$type,
            'typeInfo'=>self::typeInfo($type),
            'body'=>$body,
            'bodyBits'=>$L,
            'W'=>$W,
            'k'=>$k,
            'hash'=>bin2hex($digest),
            'bitLength'=>count($record),
            'physicalBytes'=>strlen($bytes),
        ];
    }

    public static function decode(string $bytes): array {
        self::ok(strlen($bytes) >= 36, 'K5 demasiado corto');
        $limit = strlen($bytes)*8;
        $pos=0;
        $T=self::readUInt($bytes,$pos,16,$limit);
        $W=self::readUInt($bytes,$pos,8,$limit);
        $k=$W+1;
        self::ok($k>=1 && $k<=256,'W/k inválido');
        self::ok($k < PHP_INT_SIZE*8-1,'K5 demasiado grande para esta implementación PHP');
        $L=self::readUInt($bytes,$pos,$k,$limit);
        self::ok($k===self::bitLength($L),'LEN no canónico');
        self::ok($L%8===0,'K5.1 exige cuerpo byte-aligned');
        $expectedBits=16+8+$k+$L+256;
        $expectedBytes=(int)ceil($expectedBits/8);
        self::ok(strlen($bytes)===$expectedBytes,"longitud física inválida");
        $body=self::readBytes($bytes,$pos,$L,$limit);
        $digest=self::readBytes($bytes,$pos,256,$limit);
        while($pos<$limit) self::ok(self::readBit($bytes,$pos,$limit)===0,'padding final no canónico');
        $prefix=[];
        self::writeUInt($prefix,$T,16);
        self::writeUInt($prefix,$W,8);
        self::writeUInt($prefix,$L,$k);
        self::writeBytes($prefix,$body);
        $expectedHash=hash('sha256',self::bitsToBytes($prefix),true);
        self::ok(hash_equals($expectedHash,$digest),'HASH inválido');
        return [
            'version'=>self::VERSION,
            'bytes'=>$bytes,
            'rid'=>hash('sha256',$bytes),
            'type'=>$T,
            'typeInfo'=>self::typeInfo($T),
            'body'=>$body,
            'bodyBits'=>$L,
            'W'=>$W,
            'k'=>$k,
            'hash'=>bin2hex($digest),
            'bitLength'=>$expectedBits,
            'physicalBytes'=>strlen($bytes),
            'materialValid'=>true,
        ];
    }

    public static function decodeAt(string $stream, int $byteOffset=0): array {
        self::ok($byteOffset>=0 && $byteOffset<strlen($stream),'offset inválido');
        $tail=substr($stream,$byteOffset);
        $limit=strlen($tail)*8;$pos=0;
        self::readUInt($tail,$pos,16,$limit);
        $W=self::readUInt($tail,$pos,8,$limit);$k=$W+1;
        self::ok($k>=1 && $k<PHP_INT_SIZE*8-1,'W/k inválido');
        $L=self::readUInt($tail,$pos,$k,$limit);
        $totalBytes=(int)ceil((16+8+$k+$L+256)/8);
        self::ok($totalBytes<=strlen($tail),'stream truncado');
        $d=self::decode(substr($tail,0,$totalBytes));
        $d['consumedBytes']=$totalBytes;
        $d['nextByteOffset']=$byteOffset+$totalBytes;
        return $d;
    }

    public static function pack(array $records): string {
        $out='';
        foreach($records as $r) $out .= is_array($r) ? $r['bytes'] : $r;
        return $out;
    }

    public static function quickCheckRepresentation(int $type, string $body): array {
        try {
            return match($type) {
                0x0000 => ['known'=>true,'valid'=>true,'level'=>'opaque','reason'=>'binario opaco'],
                0x0001 => self::utf8Check($body),
                0x0002 => self::jsonCheck($body),
                0x0003,0x0004 => self::utf8OnlyCheck($body),
                0x0010 => ['known'=>true,'valid'=>strlen($body)>=8 && bin2hex(substr($body,0,8))==='89504e470d0a1a0a','level'=>'magic'],
                0x0011 => ['known'=>true,'valid'=>strlen($body)>=3 && ord($body[0])===0xff && ord($body[1])===0xd8 && ord($body[2])===0xff,'level'=>'magic'],
                0x0012 => ['known'=>true,'valid'=>strlen($body)>=12 && substr($body,0,4)==='RIFF' && substr($body,8,4)==='WEBP','level'=>'magic'],
                0x0020 => ['known'=>true,'valid'=>str_starts_with($body,'%PDF-'),'level'=>'magic'],
                0x0030 => ['known'=>true,'valid'=>strlen($body)>=4 && substr($body,0,2)==="PK" && in_array(ord($body[2]),[3,5,7],true) && in_array(ord($body[3]),[4,6,8],true),'level'=>'magic'],
                0x0040 => ['known'=>true,'valid'=>strlen($body)>=4 && substr($body,0,4)==="\x00asm",'level'=>'magic'],
                default => ['known'=>false,'valid'=>null,'level'=>'unavailable','reason'=>'sin procesador local para T='.$type],
            };
        } catch(Throwable $e) {
            return ['known'=>isset(self::TYPES[$type]),'valid'=>false,'level'=>'decode','reason'=>$e->getMessage()];
        }
    }
    private static function utf8Check(string $body): array {
        self::ok(preg_match('//u',$body)===1,'UTF-8 inválido');
        return ['known'=>true,'valid'=>true,'level'=>'utf8'];
    }
    private static function utf8OnlyCheck(string $body): array {
        self::ok(preg_match('//u',$body)===1,'UTF-8 inválido');
        return ['known'=>true,'valid'=>true,'level'=>'utf8-only','reason'=>'no ejecuta ni valida sintaxis completa'];
    }
    private static function jsonCheck(string $body): array {
        json_decode($body,true,512,JSON_THROW_ON_ERROR);
        return ['known'=>true,'valid'=>true,'level'=>'json-parse'];
    }
}
