<?php
session_start();
	$dbhost = "mysql.aaron.magil.org"; // this will ususally be 'localhost', but can sometimes differ  
    $dbname = ($_SESSION['TEST'])?"testworkoutbuddy":"workoutbuddy"; // the name of the database that you are going to use for this project  
    $dbuser = "workoutbuddy"; // the username that you created, or were given, to access your database  
    $dbpass = "workoutbuddy"; // the password that you created, or were given, to access your database  
    $db = mysqli_connect($dbhost, $dbuser, $dbpass) or die("MySQL Error: " . mysql_error());  
    mysqli_select_db($db,$dbname) or die("MySQL Error: " . mysql_error());
?>