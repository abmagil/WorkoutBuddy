/*
 * structure of "workout" object
 * level 1 keys are exercise names
 * level 1 values are arrays of objects.  First item is exercise type.
 * level 2 keys are set ID strings (1,2,3)
 * level 2 values are difficulty arrays
 * 
 * {
 * 	'exercise' : [{"type": "Weight"},//not type yet
 * 				  {'1' : [rep,weight]},
 * 				  {'2' : [rep,weight]},
 * 				  ...etc.
 * 				],
 *  'exercise2' : ["type": "Distance",//Only handles Weight as of v1.0
 * 				   {'1' : [distance,duration,incline]},
 * 				   {'2' : [distance,duration,incline]},
 * 				]
*  'exercise3' : ["type" : "Plyo",//Only handles Weight as of v1.0
 * 				   {'1' : [rep,weight,duration(optional)],
 * 				   {'2' : [rep,weight,duration(optional)]},
 * 				]
 * }
 */

var OverallSets = 0;
var workout = {};
var groups = new Array();
			

function load_Exercise_json()
{
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.xmlhttp");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.xmlhttp");
			} catch (e) {
			}
		}
	}
	
	xmlhttp.open("GET","php/exercises.json",true);
	xmlhttp.send();
	
	xmlhttp.onreadystatechange = function() 
	{ 
		if (xmlhttp.readyState == 4)
		{ 
			var response = JSON.parse(xmlhttp.responseText);
			jsonExercises = (response['exercises']);
		}
	
	}
}

function add_line()
{
	var enteredExercise = trimJS(document.getElementById("tbxExercise").value);
	if (enteredExercise !=='')
	{
		add_Row(enteredExercise);//add row
		//re-zero the textbox
		document.getElementById("tbxExercise").value = "";
		document.getElementById("tbxExercise").focus();
		pnlExercise.style.display = "table";
	}
}

function add_Row(enteredExercise)
{
	pnlExercise = document.getElementById("tblCompletedExercises");
	var row = pnlExercise.insertRow(-1);
	row.setAttribute("data-totalSets",0); //Start at 0 sets, add inside of "add_Detail_Cell"
	row.setAttribute("data-exercisename",enteredExercise);//keep the exercise stored in the exercise cell
	row.setAttribute("data-group",addGroup());
	add_Ex_Cell(row,enteredExercise);
	add_Detail_Cell(row,enteredExercise);
	add_New_Set_Cell(row,enteredExercise);
	add_Del_Row_Btn(row,enteredExercise);
	check_And_Persist_Exercise(enteredExercise);
	
}

function add_Ex_Cell(row,enteredExercise)
{
	var exCell = row.insertCell(-1);
	var exDiv = document.createElement("DIV");
	var exName = document.createTextNode(enteredExercise);
	exDiv.appendChild(exName);
	exCell.appendChild(exDiv);
	//choose_exercise_type(exCell);
	exCell.style.fontWeight = "bold";
	workout[enteredExercise] = {}; //Add information to the object with the detail cell (in print_summary)
	show_last_exercise(row,enteredExercise);
}

function add_Del_Row_Btn(row)
{
	var delCl = row.cells[0];
	var delDiv = document.createElement("DIV");
	var delBtn = document.createElement("BTN");
	delBtn.onclick = function() { remove_Row(row);};
	delBtn.src = "images/del_img.png";
	delDiv.appendChild(delBtn);
	delCl.appendChild(delDiv);	
}

function add_Detail_Cell(row,enteredExercise)
{
	var setCell = row.insertCell(-1);
	var totalSets = parseInt(row.getAttribute("data-totalSets"));
	row.setAttribute("data-totalSets",totalSets+1);
	setCell.setAttribute("data-setID", totalSets+1);
	var definitionTable = document.createElement("TABLE");
	definitionTable.style.border = "thin solid #FF0000";
	definitionTable.setAttribute("data-setIDTbl",setCell.getAttribute("data-setID"));
	for (i = 0; i < 3;i++)
	{
		var tblRow = definitionTable.insertRow(-1);
		tblRow.id = "row" + i;
		for (j = 0; j < 3; j++)
		{
			var cell = tblRow.insertCell(-1);
		}
	}
	
	//append text to button
	setCell.appendChild(definitionTable);
	setCell.ClassName = "detailCell";
	set_Detail_Buttons(definitionTable,enteredExercise);
	return setCell;
}

function set_Detail_Buttons(table,enteredExercise)//TODO REFACTOR THIS //TODO Handle exercise types
{
	var sumDivCl = table.rows[1].cells[1];
	var sumDiv = document.createElement("DIV");
	sumDiv.className = "sumDiv";
	sumDiv.setAttribute("data-rep","0");
	sumDiv.setAttribute("data-weight","0");
	sumDiv.setAttribute("data-setIdDiv",table.getAttribute("data-setIDTbl"))
	sumDivCl.appendChild(sumDiv);
	print_Summary(sumDiv,enteredExercise);
	
	var addRepCl = table.rows[0].cells[1];
	var addRepBtn = document.createElement("BUTTON");
	addRepBtn.onclick = function()
	{
		var reps = parseInt(sumDiv.getAttribute("data-rep"));
		sumDiv.setAttribute("data-rep",reps+=1);
		print_Summary(sumDiv,enteredExercise);
	};
	var addRepTxt = document.createTextNode("+1");
	addRepBtn.appendChild(addRepTxt);
	addRepCl.appendChild(addRepBtn);
	
	var rmRepCl = table.rows[2].cells[1];
	var rmRepBtn = document.createElement("BUTTON");
	rmRepBtn.onclick = function()
	{
		var reps = parseInt(sumDiv.getAttribute("data-rep"));
		sumDiv.setAttribute("data-rep",Math.max(0,reps-=1));
		print_Summary(sumDiv,enteredExercise);
	}
	var rmRepTxt = document.createTextNode("-1");
	rmRepBtn.appendChild(rmRepTxt);
	rmRepCl.appendChild(rmRepBtn);
	
	var addWtCl = table.rows[1].cells[2];
	var addWtBtn = document.createElement("BUTTON");
	addWtBtn.onclick = function()
	{
		var wt = parseInt(sumDiv.getAttribute("data-weight"));
		sumDiv.setAttribute("data-weight",wt+=5);
		print_Summary(sumDiv,enteredExercise);
	}
	var addWtTxt = document.createTextNode("+5#");
	addWtBtn.appendChild(addWtTxt);
	addWtCl.appendChild(addWtBtn);
	
	var rmWtCl = table.rows[1].cells[0];
	var rmWtBtn = document.createElement("BUTTON");
	rmWtBtn.onclick = function()
	{
		var wt = parseInt(sumDiv.getAttribute("data-weight"));
		sumDiv.setAttribute("data-weight",Math.max(wt-=5,0));
		print_Summary(sumDiv,enteredExercise);
	}
	var rmWtTxt = document.createTextNode("-5#");
	rmWtBtn.appendChild(rmWtTxt);
	rmWtCl.appendChild(rmWtBtn);
}

function add_New_Set_Cell(row,enteredExercise)
{
	var newSetCl = row.insertCell(-1);
	var newSetBtn = document.createElement("BUTTON");
	var newSetBtnTxt = document.createTextNode("Add Set");
	var remSetBtn = document.createElement("BUTTON");
	var remSetBtnTxt = document.createTextNode("Remove Set");
	
	newSetBtn.onclick = function()
	{
		row.removeChild(row.lastChild);
		copy_Forward_Details(row,enteredExercise);
		add_New_Set_Cell(row,enteredExercise);
		
	}
	remSetBtn.onclick = function()
	{
		row.removeChild(row.lastChild);
		row.removeChild(row.lastChild);
		var numSets = row.getAttribute("data-totalsets");
		var enteredExercise = row.getAttribute("data-exercisename");
		delete workout[enteredExercise][numSets];
		row.setAttribute("data-totalsets",--numSets);
		add_New_Set_Cell(row);
		if (row.getElementsByTagName("TABLE").length < 1)
		{
			remove_Row(row);
		}
	}
	newSetBtn.appendChild(newSetBtnTxt);
	remSetBtn.appendChild(remSetBtnTxt);
	newSetCl.appendChild(newSetBtn);
	newSetCl.appendChild(remSetBtn);
}

function check_And_Persist_Exercise(enteredExercise)
{
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.xmlhttp");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.xmlhttp");
			} catch (e) {
			}
		}
	}
	
	if (!(enteredExercise in Object.keys(jsonExercises)))
	{
		xmlhttp.open("GET","php/push_exercise.php?exercise="+enteredExercise,true);
		xmlhttp.send();
	}

	xmlhttp.onreadystatechange = function() 
	{ 
		if (xmlhttp.readyState == 4)
		{ 
			var response = xmlhttp.responseText;
		}
	
	}
}

function setDate() {
	var dtFld = document.getElementById("dateField");
	var dtPick = document.getElementById("chgDate");
	dtFld.value = dtPick.value;
}
//HELPER FUNCTIONS

function copy_Forward_Details(row,enteredExercise)
{
	add_Detail_Cell(row,enteredExercise);
	var elements = row.getElementsByClassName("sumDiv");
	var aryLength = elements.length;
	
	var lastDetailDiv = elements[aryLength - 2];
	
	var nextDetailDiv = elements[aryLength - 1];
	
	nextDetailDiv.setAttribute("data-rep", lastDetailDiv.getAttribute("data-rep"));
	nextDetailDiv.setAttribute("data-weight", lastDetailDiv.getAttribute("data-weight"));
	print_Summary(nextDetailDiv);
}

function print_Summary(div)
{
	var row = div.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;//TODO Redo this to find that element better, because come on that's ridiculous
	enteredExercise = row.getAttribute("data-exercisename");
	div.innerHTML = '';
	var reps = parseInt(div.getAttribute("data-rep"));
	var wt =  parseInt(div.getAttribute("data-weight"));
	var sumTxt = document.createTextNode(reps + " x " + wt + "#");
	div.appendChild(sumTxt);
	
	//Modify DOM
	var setAry = [reps,wt];
	var setID = String(div.getAttribute("data-setIdDiv"));
	var exerciseKey = workout[enteredExercise];//list (starts empty)
	exerciseKey[setID] = setAry;
	document.getElementById("workout").value = JSON.stringify(workout); //workout field later posted to php
}

function trimJS (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function choose_exercise_type(exCell)
{
	//add radio buttons
	add_wrap_radio_button(exCell,"Weight","exercise_type",true);
	add_wrap_radio_button(exCell,"Distance","exercise_type");
	add_wrap_radio_button(exCell,"Plyo","exercise_type");
}

function add_wrap_radio_button(cell,btnVal,radio_nm,isDefaulted)
{
	var wrapSpan = document.createElement("SPAN");
	var btn = document.createElement("INPUT");
	btn.type = "radio";
	btn.value = btnVal;
	btn.id = "rd" + btnVal;
	btn.checked = isDefaulted;
	btn.name = radio_nm;
	btn.onpropertychange = function()
	{
		cell.setAttribute("data-exercise_type",btn.value);
		workout[enteredExercise]
	}
	var btnLbl = document.createElement("LABEL");
	btnLbl.setAttribute("for",btn.id);
	var lblTxt = document.createTextNode(btnVal);
	btnLbl.appendChild(lblTxt);
	wrapSpan.appendChild(btn);
	wrapSpan.appendChild(btnLbl);
	cell.appendChild(wrapSpan);
}

function remove_Row(row)
{
	var enteredExercise = row.getAttribute("data-exercisename");
	var exerciseTbl = document.getElementById("tblCompletedExercises");
	exerciseTbl.deleteRow(row.rowIndex);
	
	if (exerciseTbl.rows.length < 1)
	{
		exerciseTbl.style.display = "none";
	}
	delete workout[enteredExercise];//tear down this exercise's component in workout variable
}

function set_detail_onclick()
{
		var wt = parseInt(sumDiv.getAttribute("data-weight"));
		sumDiv.setAttribute("data-weight",Math.max(wt-=5,0));
		print_Summary(sumDiv,enteredExercise);
}

function holdit(btn, action, start, speedup)
{
	var t;
	
	
	var repeat = function () {
        action();
        t = setTimeout(repeat, start);
        start = start / speedup;
    }

    btn.mousedown = action

    btn.mouseup = function () {
        clearTimeout(t);
    }
}

function addGroup()
{
	//get top group
	//add next number to this workout
	//increment group and add info
	var lastGroup = groups[groups.length - 1]||0;
	var nextGroup = lastGroup+1;
	groups.push(nextGroup);
	return nextGroup;
}

function show_last_exercise(row,enteredExercise)
{
	$.ajax({
		url: "../php/getLast.php",
		type: "GET",
		cache: "false",
		data: {"exercise":enteredExercise},
		success: function(response) {
			console.log(response);
		}
	});
	
}
