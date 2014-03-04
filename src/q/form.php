<?php

//THIS IS AN AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

$__RES = array();

if (!(is_int((integer)$_POST['preference']))) {
    die("preference is not an integer!");
}

$preference = $_POST['preference'];
$__RES["preference"] = $preference;

if (!(is_string($_POST['preference_exp']))) {
    die("preference_exp is not a string!");
}

$preference_exp = $_POST['preference_exp'];
$__RES["preference_exp"] = $preference_exp;

if (!isset($_POST['wants_transfer'])) {
    // A boolean which is not set means false.
    $_POST['wants_transfer'] = "false";
} else if ($_POST['wants_transfer'] === "true" || $_POST['wants_transfer'] === "false") {
} else {
    die("wants_transfer is not a boolean!");
}

$wants_transfer = $_POST['wants_transfer'] === "true";
$__RES["wants_transfer"] = $wants_transfer;

if ($wants_transfer) {
    if (!(is_string($_POST['transfer']))) {
        die("transfer is not a string!");
    }

    $transfer = $_POST['transfer'];
    $__RES["transfer"] = $transfer;

}

if (!isset($_POST['wants_additions'])) {
    // A boolean which is not set means false.
    $_POST['wants_additions'] = "false";
} else if ($_POST['wants_additions'] === "true" || $_POST['wants_additions'] === "false") {
} else {
    die("wants_additions is not a boolean!");
}

$wants_additions = $_POST['wants_additions'] === "true";
$__RES["wants_additions"] = $wants_additions;

if ($wants_additions) {
    if (!(is_string($_POST['additions']))) {
        die("additions is not a string!");
    }

    $additions = $_POST['additions'];
    $__RES["additions"] = $additions;

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
if(!$uid) {
    die("Error! Could not find UID cookie, did you use OFraMP?\n"
      . "Please email the remaining contents of this page:\n" . $__JSON);
}

$d = date("YmdHis");
do {
    $d += 1;
    $fname = $LOG_DIR . $uid . "_" . $d . "_results.json";
} while(file_exists($fname));

if ($fp = fopen($fname, 'w')) {
    fwrite($fp, $__JSON);
    fclose($fp);
} else {
    die("Error! Could not write results file. Please email the remaining "
      . "contents of this page:\n" . $__JSON);
}

echo "Thank you for participating in the OFraMP user studies, you can close this window now.";
?>
