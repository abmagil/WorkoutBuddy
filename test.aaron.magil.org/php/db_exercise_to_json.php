<?php

include $_SERVER['DOCUMENT_ROOT']."/php/db_connect.php";

$result = mysql_query("SELECT * from Exercise_List;") or die('Could not query');
$json = array();

if(mysql_num_rows($result)){
        $row=mysql_fetch_assoc($result);
    while($row=mysql_fetch_row($result)){
        $exercise = $row[1];//id is first column

		//TODO Get this putting in as associative with their categories
        $test_data[mysql_escape_string($exercise)]=array_slice($row,2);
    }
    $json['exercises']=$test_data;
}

mysql_close($db);

$json = json_encode($json);

$myFile = "exercises.json";
$fh = fopen($myFile, 'w') or die("can't open file");

fwrite($fh, $json);
fclose($fh);
