<?php
declare(strict_types=1);
require_once __DIR__.'/rav.php';
$v=json_decode(file_get_contents(__DIR__.'/test-vectors.json'),true,512,JSON_THROW_ON_ERROR);
foreach($v['vectors'] as $x){$e=KobaltRav::encode((int)$x['slot'],(string)$x['payload']);if(bin2hex($e['bytes'])!==$x['hex']||$e['rid']!==$x['rid']||$e['hash']!==$x['hash'])throw new RuntimeException('encode vector '.$x['slot']);$d=KobaltRav::decode(KobaltRav::unhex($x['hex']));if($d['slot']!==(int)$x['slot']||$d['payload']!==$x['payload'])throw new RuntimeException('decode vector '.$x['slot']);}
echo "PASS ".count($v['vectors'])." vectores
";
