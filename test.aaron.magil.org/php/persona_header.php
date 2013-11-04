<?php
session_start();
echo <<<EOF
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body>
<form id="login-form" method="POST">
<input id="assertion-field" type="hidden" name="assertion" value="">
</form>
EOF;

?>