//Array holding the names of the CSS files
var colorfiles = {"Yellow" : "css/colorcss/yellow.css", 
					"Green" : "css/colorcss/green.css", 
					"Red" : "css/colorcss/red.css", 
					"Blue" : "css/colorcss/blue.css"};

//Method Used by the changecolor page, and auto used on page load.
//Called in pageLoader.js
//Made By Daniel DD:05
function changeColour(color)
{
	var myCSS = document.getElementById("theme");
	console.log(color);

	if(color == "Yellow")
	{
		myCSS.href = colorfiles.Yellow;
		localStorage.setItem("color", "Yellow");
	}
	else if(color == "Red")
	{
		myCSS.href = colorfiles.Red;
		localStorage.setItem("color", "Red");
	}
	else if(color == "Green")
	{
		myCSS.href = colorfiles.Green;
		localStorage.setItem("color", "Green");
	}
	else if(color == "Blue")
	{
		myCSS.href = colorfiles.Blue;
		localStorage.setItem("color", "Blue");
	}
	else
	{
		myCSS.href = "css/yellow.css";
		localStorage.setItem("color", "Yellow");
	}
}