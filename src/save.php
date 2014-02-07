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
$mtype = "application/octet-stream";
header("Content-type: $mtype");
header("Content-Disposition: filename=\"$fname\"");
header("Content-length: $fsize");
header("Cache-control: private");
echo $data;
?>