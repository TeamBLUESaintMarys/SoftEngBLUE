function logInPageLoad()
{
	var xhr = new XMLHttpRequest();
	var url = "/autoLogin";
	xhr.open("POST", url, true);
	console.log("test");
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () 
	{
	    console.log("orsc test");
	    if (xhr.readyState === 4 && xhr.status === 200) 
	    {
	    	console.log(xhr.responseText);
	    	if(xhr.responseText != "No Sessions")
	    	{
	        	var json = JSON.parse(xhr.responseText);
	        	console.log(json.userFound);

        		if (json.userFound) //check if the cookie/session exist
        		{
					setUpSocketio();
        	   		$.mobile.changePage( "#pageMenu", { transition: "slideup" });
        		}
			}
		}
	}	
	xhr.send();
}

$(document).on("pagecreate","#pageHome",function(event){ 
	console.log(event);
	logInPageLoad(); });