<?php

//THIS IS AN AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

$__RES = array();

if (!(is_int((integer)$_POST['sus1']))) {
    die("sus1 is not an integer!");
}

$sus1 = $_POST['sus1'];
$__RES["sus1"] = $sus1;

if (!(is_int((integer)$_POST['sus3']))) {
    die("sus3 is not an integer!");
}

$sus3 = $_POST['sus3'];
$__RES["sus3"] = $sus3;

if (!(is_int((integer)$_POST['sus4']))) {
    die("sus4 is not an integer!");
}

$sus4 = $_POST['sus4'];
$__RES["sus4"] = $sus4;

if (!(is_int((integer)$_POST['sus5']))) {
    die("sus5 is not an integer!");
}

$sus5 = $_POST['sus5'];
$__RES["sus5"] = $sus5;

if (!(is_int((integer)$_POST['sus6']))) {
    die("sus6 is not an integer!");
}

$sus6 = $_POST['sus6'];
$__RES["sus6"] = $sus6;

if (!(is_int((integer)$_POST['sus7']))) {
    die("sus7 is not an integer!");
}

$sus7 = $_POST['sus7'];
$__RES["sus7"] = $sus7;

if (!(is_int((integer)$_POST['sus8']))) {
    die("sus8 is not an integer!");
}

$sus8 = $_POST['sus8'];
$__RES["sus8"] = $sus8;

if (!(is_int((integer)$_POST['sus9']))) {
    die("sus9 is not an integer!");
}

$sus9 = $_POST['sus9'];
$__RES["sus9"] = $sus9;

if (!(is_int((integer)$_POST['sus10']))) {
    die("sus10 is not an integer!");
}

$sus10 = $_POST['sus10'];
$__RES["sus10"] = $sus10;

if (!(is_int((integer)$_POST['umux1']))) {
    die("umux1 is not an integer!");
}

$umux1 = $_POST['umux1'];
$__RES["umux1"] = $umux1;

if (!(is_string($_POST['chem_pos']))) {
    die("chem_pos is not a string!");
}

$chem_pos = $_POST['chem_pos'];
$__RES["chem_pos"] = $chem_pos;

if (!(is_string($_POST['chem_neg']))) {
    die("chem_neg is not a string!");
}

$chem_neg = $_POST['chem_neg'];
$__RES["chem_neg"] = $chem_neg;

if (!(is_string($_POST['ui_pos']))) {
    die("ui_pos is not a string!");
}

$ui_pos = $_POST['ui_pos'];
$__RES["ui_pos"] = $ui_pos;

if (!(is_string($_POST['ui_neg']))) {
    die("ui_neg is not a string!");
}

$ui_neg = $_POST['ui_neg'];
$__RES["ui_neg"] = $ui_neg;

if (!isset($_POST['had_errors'])) {
    // A boolean which is not set means false.
    $_POST['had_errors'] = "false";
} else if ($_POST['had_errors'] === "true" || $_POST['had_errors'] === "false") {
} else {
    die("had_errors is not a boolean!");
}

$had_errors = $_POST['had_errors'] === "true";
$__RES["had_errors"] = $had_errors;

if ($had_errors) {
    if (!(is_string($_POST['errors']))) {
        die("errors is not a string!");
    }

    $errors = $_POST['errors'];
    $__RES["errors"] = $errors;

}

if (!isset($_POST['has_comments'])) {
    // A boolean which is not set means false.
    $_POST['has_comments'] = "false";
} else if ($_POST['has_comments'] === "true" || $_POST['has_comments'] === "false") {
} else {
    die("has_comments is not a boolean!");
}

$has_comments = $_POST['has_comments'] === "true";
$__RES["has_comments"] = $has_comments;

if ($has_comments) {
    if (!(is_string($_POST['comments']))) {
        die("comments is not a string!");
    }

    $comments = $_POST['comments'];
    $__RES["comments"] = $comments;

}

$__JSON = json_encode($__RES);



/*** ADDED SECTION FOR RESULTS STORAGE ***/

$LOG_DIR = "log/";

$uid = $_POST["uid"];
$log = $_POST["log"];
$log_csv = $_POST["logCSV"];

if (!$uid) {
    die("Error! Could not find UID cookie, did you use OFraMP?\n"
      . "Please email the remaining contents of this page:\n" . $__JSON . "\n"
      . $log . "\n" . $log_csv);
}

$d = date("YmdHis");
do {
    $d += 1;
    $fname = $LOG_DIR . $uid . "_" . $d . "_naive_results.json";
} while(file_exists($fname));
$json_fname = $LOG_DIR . $uid . "_" . $d . "_naive_log.json";
$csv_fname = $LOG_DIR . $uid . "_" . $d . "_naive_log.csv";

if ($fp = fopen($fname, 'w')) {
    fwrite($fp, $__JSON);
    fclose($fp);
} else {
    die("Error! Could not write results file. Please email the remaining "
      . "contents of this page:\n" . $__JSON . "\n" . $log . "\n" . $log_csv);
}

if($fp = fopen($json_fname, 'w')) {
    fwrite($fp, $log);
    fclose($fp);
} else {
    die("Error! Could not write JSON logfile. Please email the remaining "
      . "contents of this page:\n" . $__JSON . "\n" . $log . "\n" . $log_csv);
}

if($fp = fopen($csv_fname, 'w')) {
    fwrite($fp, $log_csv);
    fclose($fp);
} else {
    die("Error! Could not write CSV logfile. Please email the remaining "
      . "contents of this page:\n" . $__JSON . "\n" . $log . "\n" . $log_csv);
}

echo "Successfully submitted the form. Please continue with the next step of the user studies.";
?>
