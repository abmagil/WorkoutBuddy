<?php
session_start();
include $_SERVER['DOCUMENT_ROOT']."/php/db_connect.php";

$exercise = $_GET["exercise"];
$user = $_SESSION["user"];
$query = "select s.reps,s.weight from Sets as s inner join Performed_Workouts as p on s.set_id = p.set_id  where p.user = '$user' and p.performed_exercise = $exercise order by p.date_of_exercise DESC limit 1";
//TODO getting the die...don't know why.
$result = mysqli_query($db,$query) or die("Could not query");
//TODO

$row = mysqli_fetch_row($result);
$reps = $row[0];
$wt = $row[1];

$response = array($reps,$wt);

//echo JSON to page  
print json_encode($response);  
mysqli_free_result($result);
?>