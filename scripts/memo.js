
//=================================================
var SERVER_URL = "http://dev.cs.smu.ca:34567";
//=================================================

var userMemos1 = [{ "ID" : "1", "title" : "Memo 1", "memoText" : "THIS MEMO WAS PLACED WITH JAVA SCRIPT"},
{ "ID" : "2", "title" : "Memo 2", "memoText" : "THIS ONE TOO"},
{ "ID" : "3", "title" : "Memo 3", "memoText" : "EVENTUALLY THEY WILL COME FROM THE SERVER!"}];

var userMemos;	

function displayTable()
{
		console.log(userMemos);
		//console.log("test");
		$("#memoTable").html("");
		for(var i = 0; i < userMemos.length; i++)  
		{
			console.log(userMemos.length);
			$("#memoTable").append("<tr>" + "<td>" +
				"<a data-role=\"button\" id=\"" + userMemos[i].memoID + "\" class=\"wbStdBtn memodisp\">" +
				"<h2>" + userMemos[i].memoTitle + "</h2></a>" + "</td>" +
				"</tr>");
			console.log(userMemos[i].memoID);
			$("#memoTable").trigger("create");
		}
}

function displayMemo(id)
{
	console.log("test");
	document.location.href = "#pageDisplayMemo";
	var memo = userMemos.filter(m => m.memoID == id);
	console.log(id);
	console.log(memo[0].memoText);
	$("#memoTitleDisp").val(memo[0].memoTitle).trigger("create");
	$("#memoDispText").html(memo[0].memoText).trigger("create");
}

function newMemo()
{
	$("#saveMemo").click(function(){
		var memoToSave = {"memoTitle" : $("#memeTitleInput").val(), "memoText" : $("#memoTextInput")};
		console.log(memoToSave)
	})
}

function deleteMemo()
{
	
}

function requestMemos()
{
	var xhr = new XMLHttpRequest();
	var url = "/requestMemos";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
			var json = JSON.parse(xhr.responseText);
	        	//if (json.userFound){ //check if the cookie/session exist 
	        		userMemos = json;
	        		console.log(userMemos);
	        		displayTable();
	        		console.log("display finished");
	        	//}
				//else {
					//alert("Session not found.");
				//}
			}
		}
		xhr.send();
		return true;
	}