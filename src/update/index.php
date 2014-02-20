<?php
echo "<pre>";

echo "Hackity hack hack...\n";

echo "Updating mop GIT repo...\n";

$out = shell_exec("sh update_mop");
echo $out . "\n";

echo "Done\n";

echo "</pre>";
?>