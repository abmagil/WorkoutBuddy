<?php
session_start();

if ($_SESSION['user'])
{
    include $_SERVER['DOCUMENT_ROOT']."/php/db_connect.php";
	
	$exercise = $_GET['exercise'];
	
	if (isset($exercise))
	{
		$exercise = mysqli_real_escape_string ($db,$exercise);
		$today = date("Y-m-d H:i:s");
		$type = '';
		$user = mysql_escape_string($_SESSION['user']);
		echo "<br>user: " . $_SESSION['user'];//REMOVE
		//TODO If two users enter the same exercise, it will be keyed to the first, so it won't autocomplete for the second.  Get better aliasing scheme
		$query = 'INSERT into Exercise_List(exercise_name,exercise_type,date_added,defining_user)
					VALUES("'.$exercise.'","'.$type.'","'.$today.'","'.$user.'");'; //set to query Exercise_List for production
		//echo $query;//REMOVE
		$result = mysqli_query($db,$query) or die('Could not query');
	}
	
	echo $result;
}
?>