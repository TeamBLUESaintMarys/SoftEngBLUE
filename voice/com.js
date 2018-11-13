var greeting = function(word) {
  alert(word);
}

var loc = function(place){
page="0";
switch(place.toLowerCase()) {
	case 'menu':
		page= "pageMenu";
		break;
    case 'memo':
		page = "pageMemo";
        break;
	case 'new memo':
		page = "pageNewMemo";
		break;
    case 'events':
        page = "pageEvents";
        break;
	case 'new event':
		page = "pageNewEvent";
		break;
    case 'messenger':
		page = "pageMessanger";
		break;
    case 'relax':
		page = "pageRelax";
		break;
    case 'about':
		page = "pageAbout";
        break;
	case 'logout':
		page = "";
        break;
    	
    	
    default:
        alert(place + " is not valid.");

}
if (page != "0")
	document.location.href = "/#" + page;
}

if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'say *word': greeting,
    'speak to me *word': greeting,
    'repeat *word': greeting,
    'output *word': greeting,
    'go to *place': loc


 };
  



  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}





