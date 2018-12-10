function eg(){
  self.location = "voice/index.html";
}

function logout()
{
	var xhr = new XMLHttpRequest();
	var url = "/logout";
	xhr.open("GET", url, true);

	xhr.send();
}//RV05

function noAccess(){

var xhr = new XMLHttpRequest();
var url = "/pop";
xhr.open("POST", url, true);

xhr.send();
}
