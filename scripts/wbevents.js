//<!--==================    Event Page ~Tye TB:03 =================================-->
var userEvents;
function newEvent(eventToSave)
{
	var xhr = new XMLHttpRequest();

	var url = "/saveEvent";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200)
		{

			document.location;
		};
	}
	var toSend = JSON.stringify(eventToSave);
	xhr.send(toSend);
}

document.addEventListener("DOMContentLoaded",
	function(event)
	{
		$("#submitEbtn").click(
			function()
			{
				var startTime = document.getElementById("eStartAP");
				var endTime = document.getElementById("eEndAP");
				var type = document.getElementById("etype");

				var date = document.getElementById("edate").value
				if(startTime.options[startTime.selectedIndex].text == "PM")
				{
					var hour = document.getElementById("selectAMH").value * 1 + 12;
					var min = document.getElementById("eStartMin").value * 1;
					if(min == 0)
					{
						min = "00";
					}
					startTime = "" + hour + ":" + min + ":00";
				}
				else
				{
					var hour = document.getElementById("selectAMH").value;

					if(hour < 10)
					{
						hour = "0" + hour;
					}

					var min = document.getElementById("eStartMin").value * 1;

					if(min == 0)
					{
						min = "00";
					}

					startTime = "" + hour + ":" + min + ":00";
				}
				if(endTime.options[endTime.selectedIndex].text == "PM")
				{
					var hour = document.getElementById("selectPMH").value * 1 + 12;

					var min = document.getElementById("eEndMin").value * 1;
					if(min == 0){
						min = "00"
					}
					endTime = "" + hour + ":" + min + ":00";
				}
				else
				{
					var hour = document.getElementById("selectPMH").value;

					if(hour < 10)
					{
						hour = "0" + hour;
					}

					var min = document.getElementById("eEndMin").value * 1;

					if(min == 0)
					{
						min = "00";
					}
					endTime = "" + hour + ":" + min + ":00";
				}
				console.log("test");
				var eventToSave =
				{
					"eventTitle" : $("#eName").val(),
					"eventDate" : date,
					"eventType": type.options[type.selectedIndex].text,
					"eventStartA" : startTime,
					"eventEndA" : endTime,
					"location" : $("#lName").val(),
					"description": document.getElementById("eDescription").value
				};

				//Error checking added by Daniel DD:09
				if (eventToSave.eventDate == "")
				{
					console.log(eventToSave);
					alert("Date field must be filled in.");
				}
				else if (eventToSave.eventTitle == ""  || eventToSave.eventTitle.length > 25)
				{
					alert("Please Enter an event Title less than 50 characters.");
				}
				else if (eventToSave.location  == "" )
				{
					alert("Please Enter an event Location");
				}
				else if (eventToSave.description == "" )
				{
					alert("Please Enter an event Description");
				}
				else
				{
					console.log(eventToSave);
					newEvent(eventToSave);
					document.location = "#newPageEvents";
				}
			})
	});

/*document.addEventListener("DOMContentLoaded", function(event)
{
	$("#btnDelete").click(function()
	{
		var memoToDelete = currentMemoID;
		console.log(memoToDelete);
		deleteMemo(memoToDelete);
	})
});*/
//<!--==================    Event Page ~Tye TB:04 =================================-->
function requestEvents()
{
	var xhr = new XMLHttpRequest();
	var url = "/requestEvents";

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function ()
	{
		if (xhr.readyState === 4 && xhr.status === 200)
		{
			console.log(xhr.responseText);
			var json = JSON.parse(xhr.responseText);
	        	//if (json.userFound){ //check if the cookie/session exist
	        		userEvents = json;
	        		console.log(userEvents);
	        		dispEventTable();
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
//<!--==================    Event Page ~Tye TB:04 =================================-->
function dispEventTable()
{
	console.log(userEvents);
	//console.log("test");
	$("#eventTable").html("");

	for(var i = 0; i < userEvents.length; i++)
	{
		console.log(userEvents.length);
		console.log("name: " + userEvents[i].Name);
		$("#eventTable").append("<tr>" + "<td>" +
			"<a data-role=\"button\" id=\"" + userEvents[i].id + "\" class=\"wbStdBtn eventdisp\">" +
			"<h2>" + userEvents[i].Name + "</h2></a>" + "</td>" +
			"</tr>");
		console.log(userEvents[i].id);
		$("#eventTable").trigger("create");
	}
}
//<!--==================    Event Page ~Tye TB:04 =================================-->
function displayEvent(eventID)
{
	console.log("test");
	//document.location.href = "#pageDisplayEvent";
	var myEvent = userEvents.filter(e => e.id == eventID);
	console.log(eventID);

	var eventData = "Event Name : " + myEvent[0].Name
	+ "\nType : " + myEvent[0].Type
	+ "\nDate : " + myEvent[0].Date
	+ "\nStart Time : " + myEvent[0].StartTime
	+ "\nEnd Time : " + myEvent[0].EndTime
	+ "\nLocation : " + myEvent[0].Location
	+ "\nDescription : " + myEvent[0].Description;
	//alert(eventData);

	var r = confirm(eventData);
	if (r == true)
	{
		readOutLoud(eventData);
	}
	else
	{
		console.log("You pressed Cancel!");
	}
}
