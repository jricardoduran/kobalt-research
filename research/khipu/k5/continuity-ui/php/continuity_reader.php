<?php
declare(strict_types=1);
require_once __DIR__.'/../../khipu5.php';
final class KobaltContinuity {
 private static function ok(bool $x,string $m):void{if(!$x)throw new RuntimeException($m);}
 private static function value(array $o,string $p):mixed{foreach(explode('.',$p) as $k){if(!is_array($o)||!array_key_exists($k,$o))return null;$o=$o[$k];}return $o;}
 public static function reconstruct(string $dir):array{
  $head=strtolower(trim((string)file_get_contents($dir.'/head.txt'))); self::ok((bool)preg_match('/^[0-9a-f]{64}$/',$head),'head');
  $back=[];$seen=[];$rid=$head;$name=null;
  while($rid!==null){
   self::ok(!isset($seen[$rid]),'ciclo');$seen[$rid]=1;$f=$dir.'/'.$rid.'.k5';self::ok(is_file($f),'falta '.$rid);
   $d=Khipu5::decode((string)file_get_contents($f));self::ok($d['rid']===$rid,'rid');self::ok($d['type']===2,'JSON');
   $e=json_decode($d['body'],true,512,JSON_THROW_ON_ERROR);self::ok(($e['v']??null)===1,'envelope');$name??=$e['continuity'];self::ok($e['continuity']===$name,'continuidad');
   $back[]=['rid'=>$rid,'event'=>$e];$rid=$e['prev'];
  }
  $records=array_reverse($back);$g=$records[0]['event']??null;self::ok(is_array($g)&&array_key_exists('prev',$g)&&$g['prev']===null&&$g['op']==='continuity.define','génesis');
  self::ok(($g['data']['metaContract']??null)==='kobalt.continuity.ui.v1','metacontrato');$views=[];
  foreach($g['data']['views'] as $v){$matched=array_values(array_filter(array_slice($records,1),fn($r)=>$r['event']['op']===$v['event']));
   if($v['mode']==='append')$rows=array_map(fn($r)=>$r['event']['data']+['__rid'=>$r['rid']],$matched);
   elseif($v['mode']==='latestByKey'){$m=[];$order=[];foreach($matched as $r){$k=(string)self::value($r['event']['data'],$v['key']);if(!isset($m[$k]))$order[]=$k;$m[$k]=$r['event']['data']+['__rid'=>$r['rid']];}$rows=array_map(fn($k)=>$m[$k],$order);}
   else throw new RuntimeException('modo '.$v['mode']);$v['rows']=$rows;$views[]=$v;
  }
  return ['head'=>$head,'continuity'=>$name,'title'=>$g['data']['title']??$name,'records'=>$records,'views'=>$views];
 }
}
