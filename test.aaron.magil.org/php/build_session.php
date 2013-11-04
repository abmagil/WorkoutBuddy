<?php
session_start();
$response = json_decode($_POST['baton'],true);
$user = $_SESSION['user'] = mysql_escape_string($response['email']);
if (!$_SESSION['user']=="")
{
	setcookie("email",$user,time()+3600,"/");
	include $_SERVER['DOCUMENT_ROOT']."/php/db_connect.php"; //populates $db and db parameters
	$date = date("Y-m-d H:i:s");
	$query = "insert into Persons(email, last_login) Values('$user','$date') on duplicate key update last_login='$date'";
	mysqli_query($db,$query);
	exit("okay");	
}
?>
