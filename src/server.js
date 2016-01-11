var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// socket.io connection has been established
io.on('connection', function(socket){
	console.log('client connected');

	// socket.on('_chat', function(msg){
	// 	io.emit('_chat', msg);
	// });

	socket.on('message', onMessage);

	socket.on('login', onLogin);

	// socket.on('_login', function(username) {
	// 	console.log('received login request for: ' + username);
	// 	if(isUniqueUsername(username)) {
	// 		console.log('adding user: ' + username);
	// 		users.push(username);
	// 	} else {
	// 		// TODO send client failure message
	// 		console.log('login failed');
	// 		socket.emit('_login_fail');
	// 	}
	// });

	socket.on('disconnect', onDisconnect);
});

http.listen(3000, function(){
	console.log('app is running and listening on *:3000');
});

//////////////////////////////
// socket functions

var onMessage = function(msg) {
	io.emit('message',msg.username);
}

var onLogin = function(username) {
	io.emit('loginCallback', { result: isUniqueUsername(username) });


	// validate unique username

	// emit user list refresh message

	// emit user entered message
}

var onDisconnect = function() {
	console.log('user disconnected')
	// emit user disconnected message

	// emit user list refresh message
}

//////////////////////////////
// helper functions

var isUniqueUsername = function(username) {
	// TODO validate username is unique
	return false;
}