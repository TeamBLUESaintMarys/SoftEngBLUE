
function logInPageLoad(){
	var xhr = new XMLHttpRequest();
	var url = "/autoLogin";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	    	console.log(xhr.responseText);
	        var json = JSON.parse(xhr.responseText);
	        //console.log(json.userFound);

	        	if (json.userFound){ //check if the cookie/session exist 
	        		//alert("Welcome: " + json.UserName);
	        		//var pageMenu = document.getElementById("pageMemo").scrollIntoView();
					//document.location.href = "#pageMenu"; // Jumps To Main Pag
					setUpSocketio();
	        	   $.mobile.changePage( "#pageMenu", {
  						transition: "slideup"
					});
	        		//$.mobile.pageContainer.pagecontainer("change",  "#pageMenu");
	        		//$( "#pageMenu" ).on( "pagechange", function( event ) { } );
	        		//$("#pageMenu").fadeIn("3000");
	        		
	        	}
		}
	}
	xhr.send();
}

$(document).on("pagebeforecreate","#pageHome",function(event){
  logInPageLoad();
  });

