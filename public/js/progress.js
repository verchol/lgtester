/*************************************
//
// digital-clock app
//
**************************************/

// connect to our socket server
var socket;

var app = app || {};


// shortcut for document.ready
$(function(){
function getHost(){
	if (!window) throw "window object is not defined";
	return window.location.host;
}
var loc = window.location;
var localHost = "http://127.0.0.1:1337";
var host  = getHost()
var socket = io.connect(host);

	//setup some common vars
	var $blastField = $('#blast'),
	    $clearOld= $('#clearOld');
	    $clearNew= $('#clearNew');
	    $clockOld = $('#clockOld');
	    $clockNew = $('#clockNew');
 		$stopOld = $('#stopOld');
	    $stopNew = $('#stopNew');
	    $startOld = $('#starOld');
	    $startNew = $('#startNew');



$stopOld.click(function()
{
	stop.call(oldController);
});
$stopNew.click(function()
{
	stop.call(newController);
})
$startOld.click(function()
{
	start.call(oldController);
});
$startNew.click(function()
{
	start.call(newController);
})

$clearOld.click(function(){
   oldController.setValue(0);
   oldController.startTime = new Date();

});
$clearNew.click(function(){
   newController.setValue(0);
   newController.startTime = new Date();

});

 oldController.timer = $clockOld;
 newController.timer = $clockNew;
 var recordId = 0;

 function stop(data)
 {
 	        clearTimeout(this.timerId);
		 	this.status = "stopped"
		 	app.recordApi.stop(this.recordTimer);
 }

 function start(data)
 {
 	       var controller = this;

 	       if (data.status === "started")
				clearTimeout(controller.timerId);

			controller.status = "started"
			controller.setValue(0);
			controller.startTime = new Date();
			controller.recordTimer = app.recordApi.start(controller);

			var counter  = function(){
				if (!(controller.status === "started")) return;

				var d = new Date();
				var gap = (d - controller.startTime)/1000;
				gap = Math.floor(gap);
                var gapSec  = Math.floor(gap % 60)
                var gapMin = Math.floor(gap / 60)
             //   console.log(gapMin + ":" + gapSec);
                function len (g)
                {
                	if (g.toString().length < 2)
                          return  "0" + g.toString();
                    else
                    return g.toString();
                }

                controller.timer.html('<h1>' + len(gapMin) + ":" + len(gapSec) + '</h1>');

                if (controller.status !== "stopped")
				   controller.timerId = setTimeout(counter , 1000);
			}

			counter();
 }


 newController.stop = stop;
 oldController.stop = stop;
 newController.start = start;
 oldController.start = start;

 var logic = function(data)
 {
    	var controller = this;

     	 if (data.command === "stop"){
		 	controller.stop();
		 	return;
		 }

	     if (this.status && this.status === "started" &&  data.command === "add")
				controller.add(1);

	  	if (data.command === "start")
	 	    controller.start(data);

 }

    var oldLogic = $.proxy(logic , oldController);
    var newLogic = $.proxy(logic , newController);

	//SOCKET STUFF
	socket.on("old", function(data){
			oldLogic(data);

	});
	socket.on("new", function(data){
         newLogic(data);

	});



});
