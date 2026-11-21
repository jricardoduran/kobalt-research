<?php
declare(strict_types=1);
require_once __DIR__.'/khipu5.php';
function must(bool $x,string $m):void{if(!$x)throw new RuntimeException($m);}
$cases=[
    [0x0002,'{"a":1,"b":2}'],
    [0x0003,'console.log("K5");'],
    [0x0000,"\x00\xff\x10"],
    [65000,'desconocido pero materialmente válido'],
];
$vectors=[];
foreach($cases as [$t,$body]){
    $e=Khipu5::encode($t,$body);$d=Khipu5::decode($e['bytes']);
    must($d['type']===$t && $d['body']===$body,'roundtrip K5');
    $vectors[]=['type'=>$t,'bodyHex'=>bin2hex($body),'recordHex'=>bin2hex($e['bytes']),'rid'=>$e['rid'],'hash'=>$e['hash'],'W'=>$e['W'],'k'=>$e['k']];
}
$recs=array_map(fn($c)=>Khipu5::encode($c[0],$c[1]),array_slice($cases,0,3));
$stream=Khipu5::pack($recs);$offset=0;$count=0;
while($offset<strlen($stream)){$d=Khipu5::decodeAt($stream,$offset);$offset=$d['nextByteOffset'];$count++;}
must($count===3 && $offset===strlen($stream),'stream framing');
$json=Khipu5::encode(0x0002,'{"ok":true}');
$d=Khipu5::decode($json['bytes']);must(json_decode($d['body'],true,512,JSON_THROW_ON_ERROR)['ok']===true,'JSON nativo extraíble');
foreach(['T'=>1,'B'=>5,'H'=>strlen($json['bytes'])-2] as $name=>$pos){$x=$json['bytes'];$x[$pos]=chr(ord($x[$pos])^1);$failed=false;try{Khipu5::decode($x);}catch(Throwable){$failed=true;}must($failed,'corrupción '.$name.' debe abortar');}
$out=['ok'=>true,'version'=>Khipu5::VERSION,'vectors'=>$vectors,'streamBytes'=>strlen($stream)];
file_put_contents(__DIR__.'/test-vectors.json',json_encode($out,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR));
echo json_encode($out,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),"\n";
