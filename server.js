/*************************************
//
// digital-clock app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device  = require('express-device');
var _ = require('underscore');


var runningPortNumber = process.env.PORT || 1337;


app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
     console.log({method:req.method, url: req.url, device: req.device});
	// goes onto the next function in line
	next();
});

app.post('/add', function(req, res){
	console.log(JSON.stringify(req.query));
    req.params =_.extend(req.params || {}, req.query || {}, req.body || {});
    console.log(JSON.stringify(req.query));
    var source = req.params["source"];
   
    console.log("the source is " + source);
    io.sockets.emit(source , {command:req.params.command});
    io.sockets.emit('new' , {command:"start"});
	res.send(200);
})

app.get("/", function(req, res){
	res.render('index', {});
});
app.get("/chat", function(req, res){
	res.render('chat', {});
});

app.get("/terminal", function(req, res){
	res.render('terminal', {});
});
io.sockets.on('connection', function (socket) {
    console.log("new connection added");
	io.sockets.emit('old', {msg:"<span style=\"color:red !important\">someone connected</span>"});
    socket.on('progress', function(data)
    {
    	console.log("do it");
    });
	socket.on('old', function(data, fn){
		console.log(data);
		io.sockets.emit('blast', {msg:data.msg});

		fn();//call the client back to clear out the field
	});

});


server.listen(runningPortNumber);

