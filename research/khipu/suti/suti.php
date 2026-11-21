<?php
declare(strict_types=1);
final class KhipuSuti {
    public const VERSION='KS1';
    public static function make(int $userId,string|int $nodeId,int $localId): string {
        if($userId<0||$userId>0xffffffff||$localId<0||$localId>0xffffffff) throw new RuntimeException('KS1 fuera de rango');
        if(is_int($nodeId)) { if($nodeId<0) throw new RuntimeException('nodeId'); $n=str_pad(dechex($nodeId),16,'0',STR_PAD_LEFT); }
        else { $n=strtolower(preg_replace('/^0x/','',$nodeId)); if(!preg_match('/^[0-9a-f]{1,16}$/',$n)) throw new RuntimeException('nodeId'); $n=str_pad($n,16,'0',STR_PAD_LEFT); }
        return sprintf('%08x',$userId).'_'.$n.'_'.sprintf('%08x',$localId);
    }
    public static function parse(string $id): array { if(!preg_match('/^([0-9a-f]{8})_([0-9a-f]{16})_([0-9a-f]{8})$/',$id,$m)) throw new RuntimeException('KS1 inválido: '.$id); return ['id'=>$id,'userId'=>hexdec($m[1]),'userHex'=>$m[1],'nodeId'=>$m[2],'localId'=>hexdec($m[3]),'localHex'=>$m[3]]; }
}
