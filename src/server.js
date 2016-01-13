var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var linkify = require('linkifyjs');
var linkifyHtml = require('linkifyjs/html');

var PORT = 3000;
var MSG_LIST_MAX_LENGTH = 20;

// array of current user objects { username, id }
var users = [];

// array of message objects
var messages = [];

// respond to root '/' http request
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// respond to /test
app.get('/test', function(req, res) {
	res.sendFile(__dirname + '/test.html');
});

// serve static assets from the 'public' folder
app.use(express.static('src/public'));

// socket.io client connection handler
io.on('connection', function(socket){
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
	// may also contain a callback function for the client
	// 	
	socket.on('login', onLogin);

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
// socket handlers
//////////////////////////////

// login event handler
// 
// 	validate unique username
// 	validate username format
// 	add user to list
// 	send user entered message
// 	send user list refresh message
// 	
// username (string) the username attempting to log in
// fn (function) a client callback function (optional) to invoke
// 	
// invoke callback function with result object
//	status (bool) - true | false if the username is unique and valid
//	users (array) - list of users in the chat room
//	
var onLogin = function(username, fn) {
	var status = false;
	var msg = 'Unknown';

	if(!isUniqueUsername(username)) {
		msg = 'Username is already taken!';
	} else if(!isValidUsername(username)) {
		msg = 'Username does not meet criteria!';
	} else {
		status = true;
		// TODO sort users alphabetically?
		users.push( {username: username, id: this.id } );
		onMessage(
			{ 
				username: '',
				message:  username + ' has joined.'
			}
		);
		sendRefreshUsers();
	}

	// client callback function
	if(fn) {
		fn({ 
			status: status,
			message: msg,
			messages: messages
		});
	}
}

// message event handler
// 
// 	set the date of the message to server UTC in epoch format
//	check for links in the message and overwrite the original message string
// 	store the message object in memory
// 	emit the message to clients
// 	
// msg (obj)
// 	message (string)
// 	username (string)
// 	
// 	
var onMessage = function(msg) {
	msg.date = Date.now();
	if(msg.message) {
		msg.message = formatMessage(msg.message);
	}
	addMessage(msg);
	io.emit('message',msg);
}

// disconnect event handler
//	filter out the disconnected user from the users array
//	when disconnected user is found, emit user disconnected message
// 	emit user list refresh message
// 
var onDisconnect = function() {
	// socket id for the disconnected client
	var socketId = this.id;
	users = users.filter(function(user) {
		if(user.id == socketId) {
			// should this functionality really be 
			// inside the filter function?
			onMessage(
				{
					username: '',
					message: user.username + ' has left.'
				}
			);
		}
		return user.id != socketId;
	});
	sendRefreshUsers();
}


//////////////////////////////
// helper functions
//////////////////////////////

// sendRefreshUsers()
// 	emits a refreshUsers message to all connected clients and
// 	sends a list of the currently logged in users
// 	
var sendRefreshUsers = function() {
	io.emit('refreshUsers', users);
}

// isUniqueUsername(username)
// 	validate that the username provided does not currently exist in the chat room
// 	
// username (string)
//	
// returns:
//	(bool) true | false
//		
var isUniqueUsername = function(username) {
	var user = users.find(function(user,idx,arr) {
		return user.username == username;
	});
	return user == undefined;
}

// isValidusername(username)
// 	validate the username meets the requirements
// 
// username (string)
// 
// returns:
// 	(bool) true | false
// 	
var isValidUsername = function(username) {
	// any server-side validation rules can go here
	return true;
}

// addMessage(message)
// 	add message object to the messages array
// 
// 	push message object onto array
// 	check array length, prune to appropriate length as needed
// 
// data:
// 	message
// 	username
// 	timestamp
// 	
var addMessage = function(message) {
	if(messages.push(message) > MSG_LIST_MAX_LENGTH) {
		messages.shift();
	}
}

// formatMessage(msg)
// 	format message string
// 
// 	detect links and replace with <a>'s
// 	
// msg (string)
// 	
// returns:
// 	(string) html for formatted string
// 			
var formatMessage = function(msg) {
	return linkifyHtml(msg);
}
