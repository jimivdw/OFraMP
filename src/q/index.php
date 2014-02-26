<?php
echo "<pre>\n";

echo "Here, one will find a short questionnaire...\n";

print_r($_COOKIE);

echo "</pre>\n";


$LOG_DIR = "log/";

$d = date("YmdHis");
$json_fname = $LOG_DIR . "log_" . $d . ".json";
while(file_exists($json_fname)) {
    $d += 1;
    $json_fname = $LOG_DIR . "log_" . $d . ".json";
}
$csv_fname = $LOG_DIR . "log_" . $d . ".csv";

$log = urldecode($_COOKIE["log"]);
$log_csv = urldecode($_COOKIE["logCSV"]);

if($fp = fopen($json_fname, 'w')) {
    fwrite($fp, $log);
    fclose($fp);
} else {
    echo "Error! Could not write JSON file.";
}

if($fp = fopen($csv_fname, 'w')) {
    fwrite($fp, $log_csv);
    fclose($fp);
} else {
    echo "Error! Could not write CSV file.";
}
?>