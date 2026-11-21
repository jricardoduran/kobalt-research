<?php
declare(strict_types=1);
$continuity=$_GET['continuity']??'comercio';
if(!preg_match('/^[A-Za-z0-9_-]{1,80}$/',$continuity)){http_response_code(400);exit('bad continuity');}
$dir=realpath(__DIR__.'/../continuity/'.$continuity);
$base=realpath(__DIR__.'/../continuity');
if($dir===false||$base===false||!str_starts_with($dir,$base.DIRECTORY_SEPARATOR)){http_response_code(404);exit('not found');}
$mode=$_GET['mode']??'head';
if($mode==='head'){
 $head=strtolower(trim((string)file_get_contents($dir.'/head.txt')));
 header('Content-Type: application/json; charset=utf-8');
 echo json_encode(['ok'=>true,'continuity'=>$continuity,'head'=>$head],JSON_UNESCAPED_SLASHES);exit;
}
if($mode==='record'){
 $rid=strtolower($_GET['rid']??'');if(!preg_match('/^[0-9a-f]{64}$/',$rid)){http_response_code(400);exit('bad rid');}
 $f=$dir.'/'.$rid.'.k5';if(!is_file($f)){http_response_code(404);exit('not found');}
 header('Content-Type: application/octet-stream');header('Cache-Control: no-store');readfile($f);exit;
}
http_response_code(400);echo 'bad mode';
