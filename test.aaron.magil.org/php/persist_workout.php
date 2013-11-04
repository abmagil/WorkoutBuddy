<?php
session_start();
$user = $_SESSION['user'];
if (!isset($user)) 
{
	echo "Not logged in!";
	return;
}
    include $_SERVER['DOCUMENT_ROOT']."/php/db_connect.php"; //populates $db and db parameters
    
   
   /* check connection */
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
		printf("Please contact aaron@magil.org");
    	exit();
	}
    
    $user = mysqli_escape_string($db,$user);
    echo "<p>persist_workout page</p>";
	$workout = $_SESSION['workout'];
	$allExercises = array_keys($workout);
    
	foreach ($allExercises as $exerciseNm) {
	    $exercise = $workout[$exerciseNm];
		$exerciseSetKeys = array_keys($exercise);
		foreach ($exerciseSetKeys as $setNm) {
			$set = $exercise[$setNm];
			$reps = $set[0];
			$wt = $set[1];
			$setOrder = $setNm;
			$query = "Insert into Sets(exercise_name,set_order,weight,reps) Values('$exerciseNm',$setNm,$wt,$reps)";
			if (isset($reps) && isset($wt)){
				echo $query."<br/>";
                $result1 = mysqli_query($db,$query);
				if ($result1==FALSE){echo "FAIL<br/>";}
				$dbSetID = mysqli_insert_id($db);
                $date = $_SESSION['date'];   
                $perfQuery = "insert into Performed_Workouts(user,performed_exercise,date_of_exercise,set_id) Values('$user','$exerciseNm','$date',$dbSetID)";
                echo $perfQuery."<br/>";
                $result = mysqli_query($db,$perfQuery);
				if ($result==FALSE){echo "FAIL<br/>";}
			}
		}
	}	
?>

<a href="/">Return Home</a>