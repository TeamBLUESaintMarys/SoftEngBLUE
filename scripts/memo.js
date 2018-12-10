var userMemos;
var currentMemoID;

//KH:04
document.addEventListener("DOMContentLoaded", function(event) 
{ 
    $("#saveMemo").click(function()
    {
		    var memoToSave = {"memoTitle" : $("#memoTitleInput").val(), "memoText" : $("#memoTextInput").val()};
		    console.log(memoToSave);
			newMemo(memoToSave);
	})
});

//KH:04
document.addEventListener("DOMContentLoaded", function(event) 
{ 
    $("#btnDelete").click(function()
    {
		    var memoToDelete = currentMemoID;
		    console.log(memoToDelete);
			deleteMemo(memoToDelete);
	})
});	

//DD: Previous Iteration
function displayTable()
{
		$("#memoTable").html("");
		for(var i = 0; i < userMemos.length; i++)  
		{
			//console.log(userMemos.length);
			$("#memoTable").append("<tr>" + "<td>" +
				"<a data-role=\"button\" id=\"" + userMemos[i].memoID + "\" class=\"wbStdBtn memodisp\">" +
				"<h2>" + userMemos[i].memoTitle + "</h2></a>" + "</td>" +
				"</tr>");
			//console.log(userMemos[i].memoID);
			$("#memoTable").trigger("create");
		}
}

function displayMemo(id)
{
	document.location.href = "#pageDisplayMemo";
	
	var memo = userMemos.filter(m => m.memoID == id);
	currentMemoID = id;

	$("#memoTitleDisp").val(memo[0].memoTitle).trigger("create");
	$("#memoDispText").html(memo[0].memoText).trigger("create");
}

//KH:01
function newMemo(memoToSave)
{
    var xhr = new XMLHttpRequest();
	var url = "/saveMemo";
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) 
	    {
	    	//console.log(xhr.responseText);
	    	document.location;
		};
	}
	var toSend = JSON.stringify(memoToSave);
	xhr.send(toSend);
}

//KH:02
function deleteMemo(memoToDelete)
{
	var xhr = new XMLHttpRequest();
	var url = "/deleteMemo";
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () 
	{
	    if (xhr.readyState === 4 && xhr.status === 200) 
	    {
	    	document.location;
		};
	}
	var toDelete = JSON.stringify({memoID:memoToDelete});
	xhr.send(toDelete);
}

//KH:03
function requestMemos()
{
	var xhr = new XMLHttpRequest();
	var url = "/requestMemos";
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState === 4 && xhr.status === 200) 
		{
			var json = JSON.parse(xhr.responseText);
	        	
	        userMemos = json;
	        displayTable();
		}
	}
	
	xhr.send();
	return true;
}