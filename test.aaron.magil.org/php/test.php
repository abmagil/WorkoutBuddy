<?php
session_start();

    $dbhost = 'mysql.aaron.magil.org';
    $dbuser = 'workoutbuddy';
    $dbpass = 'workoutbuddy';
    $dbname = 'testworkoutbuddy';
    
    $link = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die('Error connecting to mysql');
    
    //$connection = mysqli_select_db($link,$dbname);    
    
    //query the database  
    $param = $_GET['term'];
	$user = $_SESSION['user'];
    $query = "select exercise_name from Exercise_List where exercise_name like '$param%' AND (defining_user='system' OR defining_user='$user') order by exercise_name";  //set to query Exercise_List for production
    $result = mysqli_query($link,$query);
    //build array of results
    for ($x = 0, $numrows = mysqli_num_rows($result); $x < $numrows; $x++) {  
        $row = mysqli_fetch_assoc($result);
        $exercises[$x] = array("name" => $row["exercise_name"]);  
    }
    //echo JSON to page  
    $response = $_GET["callback"] . "(" . json_encode($exercises) . ")"; 
    echo $response;  
    
    mysqli_close($link);  
      
?>