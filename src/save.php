<?php
if(array_key_exists('data', $_POST)) {
    $data = $_POST['data'];
} else {
    echo "Error! No data was provided.";
    exit;
}

if(array_key_exists('fname', $_POST)) {
    $fname = $_POST['fname'];
} else {
    $fname = "download";
}

$fsize = strlen($data);
$mtype = array("application/octet-stream");

header("Content-Type: $mtype");
header("Content-Disposition: attachment; filename=\"$fname\"");
header("Content-Transfer-Encoding: binary");
header("Content-Length: $fsize");
header("Expires: 0");
header("Cache-Control: private");

echo $data;
?>