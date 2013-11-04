<?php
session_start();
$envAry = explode(".",$_SERVER['SERVER_NAME']);
if ($envAry[0]=="test") {
	$_SESSION['TEST'] = true;
}
else {
	$_SESSION['TEST'] = false;
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <script src="https://login.persona.org/include.js" type="text/javascript"></script>
        <script type="text/javascript">
        	//Backup of the persona files, in case Mozilla CDN goes down
			if (typeof jQuery == 'undefined') {
			    document.write(unescape("%3Cscript src='/JS/backup_include.js' type='text/javascript'%3E%3C/script%3E"));
			}
		</script>
        <script src="JS/jquery-1.7.2.min.js" type="text/javascript"></script>
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css" />
        <script src="JS/jquery-ui-1.9.0.custom.js"></script>
        <link rel="JS/jquery-ui-1.9.0.custom/css/smoothness/images/jquery-ui-1.9.0.custom.css"/>
        <script src="JS/workoutJS.js" type="text/javascript"></script>
        <script src="JS/persona.js" type="text/javascript"></script>
        <title>Workout Metrix</title>
        <meta name="description" content="" />
        <meta name="author" content="amagil" />
        <script type="text/javascript">
    //When ready...
    $(function(){
        //attach autocomplete
        $("#tbxExercise").autocomplete({
            //define callback to format results
            source: function(req, add){
                //pass request to server
                $.getJSON("php/getExercises.php?callback=?", req, function(data) {
                    //create array for response objects
                    var suggestions = [];
                    //process response
                    $.each(data, function(i, val){
                        suggestions.push(val.name);
                    });
                    //pass array to callback
                    add(suggestions);
                });
            },
            //define select handler
            select: function(e, ui) {
                //create formatted friend
                var exercise = ui.item.value;
                $("#tbxExercise").text = exercise;
                /*
                 * 1) On select, fill the tbxExercise box with the exercise selected
                 * 2) Do nothing else?
                 * 3) Profit
                 */
                },
            //define select handler
            change: function() {
                
            }
        });
    });
    load_Exercise_json()
</script>

<script>
    navigator.id.watch({
        loggedInUser : "<?php $_SESSION['user']?>",
        onlogin: function (assertion) {
            $.ajax({
                url: "php/verify_assertion.php",
                type: "POST",
                cache: false,
                data: {"assertion": assertion},
                success: function(response){
                	var jsonResponse = JSON.parse(response);
				    if (jsonResponse["status"] == "okay"){
				    	$.ajax({
				    		url:"php/build_session.php",
				    		type:"POST",
				    		data:{"baton":response},
				    		success: function(response) {
				    			if(response == "okay") {
					    			$("#signin").hide();
					    			$("#loginInfo").show();
					    			$("#loginInfo").text("You are logged in as " + jsonResponse["email"]);
			    				}
				    		}
				    	});
				    	
				    }
                }
            });
        },
        onlogout: function() {
    		$.ajax({
	    		url:"php/tear_down.php",
	    		success: function(response) {
	    			if (response == "okay"){
	    				$("#loginInfo").text("You have logged out.");
	    				$("#signin").show();
	    			}
	    			else if (response =="problo rob lowe") {
	    				$("#loginInfo").text("There was a problem");
	    			}
	    			else {
	    				$("#signin").show();
	    				$("#loginInfo").hide()
	    			}
	    		}
	    	});
        }
    });
</script>
<script>
    $(document).ready(function() {
        $("#tblCompletedExercises").hide();
        });
</script>
<meta name="viewport" content="width=device-width; initial-scale=1.0" />
</head>
<body>
	<div>
		<?php
			if (!isset($_SESSION['user'])){
	        	print '<img src=\'images/Sign_In_With_Your_Email.png\' id=\'signin\' onclick="navigator.id.request({siteName: \'Workout Buddy\'})" />';
			}
			else {
	        	?><script>$("#loginInfo").text("You are logged in as " + jsonResponse["email"]||document.cookie["user"]);</script>
	        	<?php 
			}
        ?>
        <p id='loginInfo'></p>
    </div>
    <div class="page-header">
        <nav>
    <div class="internal_nav" style="text-align:left">
                <a class="internal nav" href="php/historical_insert.php">Insert Old Workout</a>
                <a class="internal nav" href="mailto:aaron@magil.org">Contact Me</a>
    </div>
    <div class="user_auth" style="text-align:right">
        <button id='signout' onclick="navigator.id.logout()">Log Out</button>
    </div>
        </nav>
    </div>
    <div>
        <header>
            <h1>Workout</h1>
        </header>
        <div id="body">
            <table id="tblCompletedExercises" border="1"></table>
            <form action="php/confirm_workout.php" method="post" id="exercise_form" >
                <span id="spExercise"></span><br/>
                Exercise<input type="text" size="20" id="tbxExercise"/><input type="button" value="Add Line" onclick="add_line()" />
                <br />
                <input type="submit" value="Submit" id="form_submit" />
                <input type="hidden" id="workout" name="workout" value=''/>
            </form>
        </div>
        <footer>
            <p>
                <a href="/">Home</a>
                &copy; Copyright  by amagil
            </p>
        </footer>
    </div>
</body>