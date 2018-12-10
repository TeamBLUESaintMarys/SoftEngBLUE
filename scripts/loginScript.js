//From Thyroid App
if (!sessionStorage) 
{
  	alert(
    'Warning: Your browser does not support features required for this application, please consider upgrading.'
  	);
}

var delay = 5000;
var originalColour = document.getElementById("userName").style.background;

function tempAlert(msg,duration)
{
	var el = document.createElement("a");
	// el.setAttribute();
	 el.innerHTML = msg;
	setTimeout(
	function(){ el.parentNode.removeChild(el); }, duration);
	 
	//Style The Error
	el.style.color= "red";
	el.style.fontSize= "x-large";
	//el.style.background= "white";
	//Remove children 
	var myNode = document.getElementById("loginError");
	
	while (myNode.firstChild) 
	{
	 	myNode.removeChild(myNode.firstChild);
	}
	
	//Set It Attribute 
	el.setAttribute("data-role", "button");
	el.setAttribute("id", "errormessage");
	document.getElementById("loginError").appendChild(el);
	$("#loginError").trigger("create");
}

function LogInProtocol(jsonDataField)
{
	var xhr = new XMLHttpRequest();

	var url = "/verifyUser";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () 
	{
	    if (xhr.readyState === 4 && xhr.status === 200) 
	    {
	    	console.log(xhr.responseText);
	    	//console.log(document.cookie['sessionId']);
	        var json = JSON.parse(xhr.responseText);
	        if (json.userFound)
	        { //check if the cookie/session exist 
        		//alert("Welcome: " + json.UserName);
        		//var pageMenu = document.getElementById("pageMemo").scrollIntoView();
        		//document.location.href = "#pageMenu"; // Jumps To Main Pag
        	    $.mobile.changePage( "#pageMenu", { transition: "slideup" });
				setUpSocketio();
        		//$.mobile.pageContainer.pagecontainer("change",  "#pageMenu");
        		//$( "#pageMenu" ).on( "pagechange", function( event ) { } );
        		//$("#pageMenu").fadeIn("3000");
	        		
	        }
        	else 
        	{
				readOutLoud("Username or Password Incorrect: Please Try Again");
				tempAlert("Username or Password Incorrect: Please Try Again",delay);
				document.getElementById("userName").style.background = "rgba(255, 0, 0, 0.1)";
				document.getElementById("passcode").style.background = "rgba(255, 0, 0, 0.1)";
				//$("#userName").effect("shake");
				//$("#passcode").effect("shake");
        		//alert("Username/orPassword Innocorrect: Please Try Again");

        	}
	    }
	    else if (xhr.readyState === 4 && xhr.status === 403)
	    {
	     	alert("Could Not Connect To Server: 403 Erorr ");
	    }
	     else if (xhr.readyState === 4 && xhr.status === 404)
	    {
	     	alert("Could Not Connect To Server: 404 Erorr ");
	    }     	    
	};

	xhr.send(jsonDataField);
}



function postuserValidation(UserFound)
{
	//User Found Will Be A Boolean which when false the user hasnt been found it 
}

function preValidation(jsonDataField)
{

	var nameField = jsonDataField['userName'];
	var passCodeField = jsonDataField['passcode'];
	var hasUser = jsonDataField.userName.length != 0 ;
	var hasPass = jsonDataField.passcode.length != 0 ;
	
	if (!hasPass && !hasUser)
	{
		readOutLoud("Empty Username And Passcode  Please Enter A Username and Passcode");
		tempAlert("Empty Username And Passcode : Please Enter A Username and Passcode",delay);
		document.getElementById("userName").style.background = "rgba(255, 0, 0, 0.1)";
		document.getElementById("passcode").style.background = "rgba(255, 0, 0, 0.1)";
		return false;
	}
	else if  (!hasUser )
	{
		readOutLoud("Empty Username  Please Enter A Username");
		tempAlert("Empty Username : Please Enter A Username",delay);
		document.getElementById("userName").style.background = "rgba(255, 0, 0, 0.1)";
		return false;
	}
	else if (!hasPass)
	{
		readOutLoud("Empty Passcode  Please Enter A Password");
		tempAlert("Empty Passcode : Please Enter A Password",delay);
		document.getElementById("passcode").style.background = "rgba(255, 0, 0, 0.1)";
		return false;
	}
	
	//Check if PassWord Has Illegal Character such as anything but nummbers
	var isnum = /^\d+$/.test(jsonDataField.passcode);
	if(!isnum)
	{
		document.getElementById("passcode").style.background = "rgba(255, 0, 0, 0.1)";
		readOutLoud("Password  Digits Only, Please Re-Enter");
		tempAlert("Password: Digits Only, Please Re-Enter",delay);
		return false;
	}
	return true ;
}

//This Clears The Password Field in event of retry by the user
function  changeColourRemoveErorr(element) 
{
	if (element.style.background != originalColour)
	{
		element.style.background = originalColour;
	}
}

function LogInProtocolEvent (event)
{
	var userField = document.getElementById("userName").value;
	var PassWordField = document.getElementById("passcode").value;
	var loginData = {
							userName:userField,
							passcode:PassWordField
					}
	if (preValidation(loginData))
	{
		LogInProtocol(JSON.stringify(loginData));
	}
  	//get data from dataFild
}




window.addEventListener("load", function(event) 
{
	document.getElementById("LogInButton").addEventListener("click", LogInProtocolEvent);

	document.getElementById("userName").addEventListener("input", 
		function() 
		{
			changeColourRemoveErorr(document.getElementById("userName"));
		});

	document.getElementById("passcode").addEventListener("input", 
		function() 
		{
			changeColourRemoveErorr(document.getElementById("passcode"));
		});  
});

//From Thyroid App
function addValueToPassword(button) 
{
  	var currVal = $("#passcode").val();
  	if (button == "bksp") 
  	{
    	$("#passcode").val(currVal.substring(0, currVal.length - 1));
  	} 
  	else 
  	{
    	$("#passcode").val(currVal.concat(button));
  	}
}