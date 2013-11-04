navigator.id.watch({
        loggedInUser : "<?php $_SESSION['user']?>",
        onlogin: function (assertion) {
        	$.ajax({
                url: "/php/verify_assertion.php",
                type: "GET",
                cache: false,
                data: {"assertion": assertion},
                success: function(response){
                	var jsonResponse = JSON.parse(response);
				    if (jsonResponse["status"] == "okay"){
				    	$.ajax({
				    		url:"/php/build_session.php",
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
	    		url:"/php/tear_down.php",
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