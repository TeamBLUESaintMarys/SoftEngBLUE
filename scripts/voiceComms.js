var greeting = function(word) {
  alert(word);
}

var css = function(){
	var exists = document.getElementById("theme");
	if (exists){
		$('#theme').remove();
     	        document.head.innerHTML += "<link id='theme2' rel='stylesheet' href='daniel.css'>";
}else{
		$('#theme2').remove();
     	        document.head.innerHTML += "<link id='theme' rel='stylesheet' href='daniel2.css'>";
}
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
    case 'event':
        page = "pageEvents";
        break;
	case 'new event':
		page = "pageNewEvent";
		break;
    case 'messenger':case 'messaging':
		page = "pageMessanger";
		break;
    case 'relax':case 'relaxation':
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
    'go to *place(s) (page)': loc,
    'change color': css


 };
  



  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}





