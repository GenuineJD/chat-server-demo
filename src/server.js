var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var PORT = 3000;
var MSG_LIST_MAX_LENGTH = 20;

// array of current user objects
var users = [];

// array of message objects
var messages = [];

// respond to root '/' http request
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static('src/public'));

// socket.io connection has been established
io.on('connection', function(socket){
	console.log('client connected');

	// socket.on('_chat', function(msg){
	// 	io.emit('_chat', msg);
	// });

	// receive a message event 
	// 
	// data:
	// 	message
	// 	username
	// 	
	socket.on('message', onMessage);

	// receive a login event 
	// 
	// data:
	// 	username
	// 	
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

	// receive a disconnect event
	// 
	socket.on('disconnect', onDisconnect);
});

// main app entry point
// start listening for requests
http.listen(PORT, function(){
	console.log('app is running and listening on *:' + PORT);
});


//////////////////////////////
// socket functions/handlers
//////////////////////////////

// message event handler
// 	store the message object 
// 	emit the message to clients
var onMessage = function(msg) {
	io.emit('message',msg);
}

// login event handler
// 
// 	validate unique username
// 	add user to list
// 	emit user list refresh message
// 	emit user entered message
// 	
// return result object
//	status (bool) - true | false if the username is unique
//	users (array) - list of users in the chat room
//	
var onLogin = function(username) {
	console.log('login(): ' + username);

	var status = false;
	var msg = 'Unknown';

	if(!isUniqueUsername(username)) {
		msg = 'Username is already taken!';
	} else if(!isValidUsername(username)) {
		msg = 'Username does not meet criteria!';
	} else {
		status = true;
		users.push(username);
		// TODO other stuff
	}

	// send the response back
	io.emit('loginCallback', { 
		status: status,
		username: username,
		message: msg
	});
}

// disconnect event handler
//
// 	emit user disconnected message
// 	emit user list refresh message
// 		another function 
// 
var onDisconnect = function() {
	console.log('user disconnected')
}


//////////////////////////////
// helper functions
//////////////////////////////

// validate that the username provided does not currently exist in the chat room
//	
// returns:
//	(bool) true | false
//		
var isUniqueUsername = function(username) {
	// TODO validate username is unique
	return users.indexOf(username) == -1;
}

// validate the username string meets the requirements
// 
// returns:
// 	(bool) true | false
// 	
var isValidUsername = function(username) {
	// TODO validate string
	return true;
}

// add message object to the messages array
// 
// 	push message object onto array
// 	check array length, prune to (MSG_LIST_MAX_LENGTH) messages only 
// 
// data:
// 	message
// 	username
// 	timestamp
// 	
var addMessage = function(message) {

}

// format message string
// 
// 	detect links and replace with <a>'s
// 	
// returns:
// 	(string) html for formatted string
// 			
var formatMessage = function(msg) {
	// TODO implement
	return msg;
}