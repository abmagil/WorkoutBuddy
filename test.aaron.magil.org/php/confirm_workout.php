<?php
session_start();
?>
<script src="/JS/persona.js"></script>
<?php
$user = $_SESSION['user'];

$workout = json_decode($_POST["workout"],TRUE);
$date = $_POST['dateField']; //Defaults to today.  Can be changed by datePicker
if (is_null($workout)) {
	echo '<p><a href="/">Please enter a workout.</a></p>';
	return;
}
echo "<h2>Please confirm this is your workout</h2>";
if ($date!=date()){
	echo "<p id='note'>NOTE: You have changed the workout date to $date.</p>";
}
$_SESSION['workout'] = $workout;
$_SESSION['date'] = $date;
$allExercises = array_keys($workout);
foreach ($allExercises as $exerciseNm) {
	echo $exerciseNm."<br/>";
    $exercise = $workout[$exerciseNm];//ARRAY
	$exerciseSetKeys = array_keys($exercise);
	foreach ($exerciseSetKeys as $setNm) {
		$set = $exercise[$setNm];
		$reps = $set[0];
		$wt = $set[1];
		echo "<p>".$setNm.": ".$reps." x ".$wt."</p>"; 
	}
}
if (!isset($user)) 
{
    echo '<a href="email_workout.php">This is my workout!  I want to email it to myself (TK) </a>';
	print '<img src=\'images/Sign_In_With_Your_Email.png\' id=\'signin\' onclick="navigator.id.request({siteName: \'Workout Buddy\'})" />';
}
else {
	echo "Logged in as ".$user;
	echo '<p><a href="persist_workout.php">This is my workout!  I want to store it in the database! </a></p>';
	echo '<button id=\'signout\' onclick=\"navigator.id.logout()\">Log Out</button>';
}
?>
<p><a href="/">Wait, I have more to add!  Return me Home</a></p>