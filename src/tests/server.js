var io = require('socket.io-client');
var assert = require('assert');


describe('Chat server test', function() {
	var socket1;
	var socket2;
	var socket3;

	var sockopts = {
        'reconnection delay' : 0,
        'reopen delay' : 0,
		'force new connection' : true
    };

    var chathost = 'http://localhost:3000';

	// before(function(done) {
	// 	console.log('setting up chat server tests...');
	// 	// Setup
 //        socket1 = io.connect('http://localhost:3000', sockopts);
 //        socket1.on('connect', function() {
 //            console.log('connected to socket1.');
 //            done();
 //        });
 //        socket1.on('disconnect', function() {
 //            console.log('socket1 disconnected.');
 //        });
 //        socket1.on('error', function() {
 //        	console.log('error connecting to chat server on socket1...');
 //        });
	// });

	after(function(done) {
        // Cleanup
        console.log('cleaning up chat server tests.')
        if(socket1 && socket1.connected) {
            console.log('disconnecting socket1...');
            socket1.disconnect();
        }
        if(socket2 && socket2.connected) {
            console.log('disconnecting socket2...');
            socket2.disconnect();
        }
        if(socket3 && socket3.connected) {
            console.log('disconnecting socket3...');
            socket3.disconnect();
        }
        done();
    });

	describe('login', function() {
		it('should return true with the first user', function(done) {
			socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				console.log('connected to socket1');
			});

			socket1.emit('login', 'myuniqueusername', function(result) {
				assert.equal(result.status, true);
				done();
			});

		});

		it('should return false with a non-unique username', function(done) {
			socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				console.log('connected to socket1');
			});

			socket1.emit('login', 'myuniqueusername', function(data) {

				socket2 = io.connect(chathost, sockopts);
				socket2.on('connect', function() {
					console.log('connected to socket2');
					socket2.emit('login', 'myuniqueusername', function(data) {
						assert.equal(data.status, false);
						done();
					});
				});

			});

		});

		it('should return a status message if it fails')

		it('should return a list of users');

		it('should broadcast a \'user entered\' message');

		it('should broadcast a \'refresh users\' event');

	});

	describe('message', function() {
		it('should assign a date value');
		it('should emit the message to all clients');
		it('should detect and format links');
	});

	describe('disconnect', function() {
		it('should broadcast a \'user left\' message');
		it('should broadcast a \'refresh users\' event');
	});
});