/**
 * @author amagil
 */

function load(){
	var dateStr=getDateString();
	writeDay(dateStr); 
	prepWorkout(dateStr);
}

function getDateString(){
	try {
		var d=new Date();
		var month=d.getMonth()+1;
		var day=d.getDate();
		var year=d.getFullYear();
	}
	catch(e) {
		alert("Well, that didn't work");
		alert(e.message);
	}
	return (month + "/" + day + "/" + year);
}

function writeDay(dateStr) {
	element = document.getElementById("today");
	element.innerHTML += dateStr;
}

function prepWorkout(dateStr) {
	parsedWorkout = loadDaysWorkout(dateStr);
	writeDaysWorkout(parsedWorkout);
}

function loadDaysWorkout(dateStr){
	 var workout = getWorkoutFromCalendar(dateStr);
	 return parseWorkout(workout);

	//will have to do some DB querying?  Pass back a JSON object describing the workout?
	//We'll have to run some server-side script to create a query?  Getting complicated...
	
	/*JSON Object
	 *	pass what the exercises for the day are FOR SURE
	 *	pass links to youtube maybe? 
	 * 	Maybe have icons, simple line drawings representing the lift/exercise.  Probably don't pass that back, instead store it on the webserver and let client-side scripts select it
	 * 	
	 */	

}

function getWorkoutFromCalendar(dateStr) {
	return 0;
}

function parseWorkout(workout) {
	//take in JSON object, parse to string, return
	return {
		"Bench press":"5x5",
		"Hammer curl":"5x5",
		"Squat":"3x10",
		"More bench press":"1x10",
	};
	//Will have to update this, eventually
}

function writeDaysWorkout(workout) {
	element = document.getElementById("workout");
	element.innerHTML += (JSON.stringify(workout));
}

