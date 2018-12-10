var greeting = function(word) { alert(word); }

var memoTitle = function(words)
{
	document.location.href = "/#pageNewMemo";
	document.getElementById("memoTitleInput").value=words;
}//RV01

var memoText=function(words)
{
	if($( "#pageNewMemo" ).hasClass( "ui-page-active" ))
	{
		document.getElementById("memoTextInput").value=words;
	}
}//RV01

//Created By Razan, modified(expanded) by Daniel
//RV02
var css = function()
{
	var myCSS = document.getElementById("theme");

	if (myCSS.getAttribute("href")=="css/colorcss/yellow.css")
	{
		myCSS.href = "css/colorcss/red.css";
		localStorage.setItem("color", "Red");
	}
	else if (myCSS.getAttribute("href")=="css/colorcss/red.css")
	{
		myCSS.href = "css//colorcssgreen.css";
		localStorage.setItem("color", "Green");
	}
	else if (myCSS.getAttribute("href")=="css/colorcss/green.css")
	{
		myCSS.href = "css/colorcss/blue.css";
		localStorage.setItem("color", "Blue");
	}
	else if (myCSS.getAttribute("href")=="css/colorcss/blue.css")
	{
		myCSS.href = "css/colorcss/yellow.css";
		localStorage.setItem("color", "Yellow");
	}
	else 
	{
		myCSS.href = "css/colorcss/yellow.css";
		localStorage.setItem("color", "Yellow");
	}
}

function goBack(object) 
{
	console.log(object);
	window.history.back();
}

var loc = function(place)
{
	page="0";

	switch(place.toLowerCase()) 
	{
		case 'menu': case 'main menu':
			page= "pageMenu";
			break;
	    case 'memo':
			page = "pageMemo";
	        break;
		case 'new memo':
			page = "pageNewMemo";
			break;
	    case 'event':
	        page = "newPageEvents";
	        break;
		case 'new event':
			page = "pageNewEvent";
			break;
	    case 'messenger':case 'messaging':case 'message' :
			page = "pageMessanger";
			break;
	    case 'relax':case 'relaxation':
			page = "pageRelax";
			break;
	    case 'about':
			page = "pageAbout";
	        break;
		case 'log out' :case 'logout':
			page = "logout";
	        break;
	    		
	    default:
	        console.log(place + " is not valid.");
	}

	if (page === "logout")
	{
		document.location.href = "/#pageMenu";
		function a() { document.getElementById("btnLogout").click(); }
		a();
	}
	else if (page != "0") document.location.href = "/#" + page;
}//RV03

function openPanel() { $('#contactResidents').panel('open', ''); }

var saveMemo = function()
{
	if($( "#pageNewMemo" ).hasClass( "ui-page-active" ))
	{
		document.getElementById("saveMemo").click();
	}
}

var readMemo= function()
{
	if($( "#pageDisplayMemo" ).hasClass( "ui-page-active" ))
	{
	 	readOutLoud(document.getElementById("memoDispText").value);
	}
}//RV04



function setMessageBox(message)
{
	console.log(message);
	document.getElementById("inputMessage").value = message;
}

function sendMessage(message)
{
	console.log(message);
	document.getElementById("inputMessage").value = message;
	document.getElementById("SendButton").click();
}

function send()
{
	document.getElementById("SendButton").click();
}

if (annyang) 
{
  	// Let's define our first command. First the text we expect, and then the function it should call
  	var commands = 
  	{
	    'say *word': greeting,
	    'speak to me *word': greeting,
	    'repeat *word': greeting,
	    'output *word': greeting,
	    'go to *place(s) (page)': loc,
			'change color': css,
			'take me back (*word)':goBack,
			'(open)(show)(reveal) friends' : openPanel,
		'set memo title (as)(to) *word':memoTitle,
		'set memo message (as)(to) *word':memoText,
		'set memo description (as)(to) *word':memoText,
		'set memo text (as)(to) *word':memoText,
		'save memo':saveMemo,
		'type *message' : setMessageBox,
		'send *message' : sendMessage,
		'send' : send,
		'*place(s) (page)': loc,
	};

	function readOutLoud(message) 
	{
		var speech = new SpeechSynthesisUtterance();

	  	// Set the text and voice attributes.
		speech.text = message;
		speech.volume = 1.0;
		speech.rate = 1.0;
		speech.pitch = 1.0;
	  
		window.speechSynthesis.speak(speech);
	}

	//annyang.debug([newState=true]);

  	// Add our commands to annyang
  	annyang.addCommands(commands);
	  
  	// Start listening. You can call this here, or attach this call to an event, button, etc.
	document.addEventListener("DOMContentLoaded", function(event) 
	{
		//readOutLoud("Welcome.Back: We missed You");
    	annyang.start();
  	});
}//Main Voice command function that calls the previous function and initiaties the Voice command library