document.getElementById("start").onclick = function() {start()};
document.getElementById("stop").onclick = function() {stop()};


function start() {
	$(".start").click(function(){
		$(".example.stopwatch").TimeCircles().start(); 
	}); 
}

function stop() {
	$(".stop").click(function(){
		$(".example.stopwatch").TimeCircles().stop(); 
	}); 
}

