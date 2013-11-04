<?php
session_start();
echo "<b>Session: </b>";
var_dump($_SESSION);
echo "<br/><br/><b>Cookies: </b>";
var_dump($_COOKIE);
?>
