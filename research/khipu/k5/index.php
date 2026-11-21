<?php
declare(strict_types=1);
require_once __DIR__.'/khipu5.php';
$message='';$details=null;$download=null;
try{
    if($_SERVER['REQUEST_METHOD']==='POST'){
        $action=$_POST['action']??'';
        if($action==='encode'){
            $type=(int)($_POST['type']??0);
            if(isset($_FILES['bodyfile']) && $_FILES['bodyfile']['error']===UPLOAD_ERR_OK) $body=file_get_contents($_FILES['bodyfile']['tmp_name']);
            else $body=(string)($_POST['bodytext']??'');
            $e=Khipu5::encode($type,$body);$d=Khipu5::decode($e['bytes']);
            $message='MATERIAL_VALID';$details=$d;$download=['record'=>base64_encode($d['bytes']),'body'=>base64_encode($d['body'])];
        } elseif($action==='decode'){
            if(!isset($_FILES['k5file'])||$_FILES['k5file']['error']!==UPLOAD_ERR_OK)throw new RuntimeException('Selecciona un .k5');
            $d=Khipu5::decode(file_get_contents($_FILES['k5file']['tmp_name']));$message='MATERIAL_VALID';$details=$d;$download=['record'=>base64_encode($d['bytes']),'body'=>base64_encode($d['body'])];
        }
    }
}catch(Throwable $e){$message='ABORT: '.$e->getMessage();}
if(isset($_GET['download']) && isset($_GET['data'])){
    $data=base64_decode($_GET['data'],true);if($data===false)exit('base64 inválido');
    $name=$_GET['name']??'file.bin';header('Content-Type: application/octet-stream');header('Content-Disposition: attachment; filename="'.basename($name).'"');echo $data;exit;
}
?>
<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Khipu-5 PHP</title>
<style>body{font-family:system-ui;background:#f5f5f3;margin:0;color:#171717}main{max-width:1050px;margin:auto;padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px}.card{background:#fff;border:1px solid #ddd;border-radius:14px;padding:16px}label{display:block;margin:.8rem 0 .3rem;font-weight:650}textarea,select,input{width:100%;box-sizing:border-box;font:inherit}textarea{min-height:140px}button,a.btn{display:inline-block;padding:10px 14px;margin-top:8px;border:1px solid #999;border-radius:9px;background:#fff;color:#111;text-decoration:none;font:inherit}pre{white-space:pre-wrap;word-break:break-word;background:#111;color:#eee;padding:14px;border-radius:10px}.ok{color:#08783f}.bad{color:#b42318}</style><main><h1>Khipu-5 <small>K5.1 · PHP</small></h1><p><b>[T16][W8][LENk][BODY][SHA-256]</b></p><div class="grid"><section class="card"><h2>Crear</h2><form method="post" enctype="multipart/form-data"><input type="hidden" name="action" value="encode"><label>Tipo T</label><select name="type"><?php foreach(Khipu5::TYPES as $t):?><option value="<?=$t['code']?>" <?=$t['code']===2?'selected':''?>><?=sprintf('0x%04x',$t['code'])?> · <?=htmlspecialchars($t['name'])?> · <?=htmlspecialchars($t['extension'])?></option><?php endforeach?></select><label>Texto/cuerpo</label><textarea name="bodytext">{"producto":"P1","precio":35000}</textarea><label>o archivo</label><input type="file" name="bodyfile"><button>Crear y verificar</button></form></section><section class="card"><h2>Abrir .k5</h2><form method="post" enctype="multipart/form-data"><input type="hidden" name="action" value="decode"><input type="file" name="k5file"><button>Verificar y abrir</button></form><p>La verificación material es binaria y no necesita parsear el formato declarado.</p></section></div>
<?php if($message):?><section class="card" style="margin-top:14px"><h2 class="<?=str_starts_with($message,'MATERIAL')?'ok':'bad'?>"><?=htmlspecialchars($message)?></h2><?php if($details):$info=$details['typeInfo'];$view=['version'=>$details['version'],'type'=>$details['type'],'typeInfo'=>$info,'bodyBytes'=>strlen($details['body']),'W'=>$details['W'],'k'=>$details['k'],'bodyBits'=>$details['bodyBits'],'hash'=>$details['hash'],'rid'=>$details['rid'],'representationCheck'=>Khipu5::quickCheckRepresentation($details['type'],$details['body'])];?><pre><?=htmlspecialchars(json_encode($view,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE))?></pre><a class="btn" href="?download=1&amp;name=<?=urlencode(substr($details['rid'],0,16).'.k5')?>&amp;data=<?=urlencode($download['record'])?>">Descargar .k5</a><a class="btn" href="?download=1&amp;name=<?=urlencode(substr($details['rid'],0,16).$info['extension'])?>&amp;data=<?=urlencode($download['body'])?>">Extraer cuerpo nativo</a><?php endif?></section><?php endif?></main></html>
