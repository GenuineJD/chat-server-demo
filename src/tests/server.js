var io = require('socket.io-client');
var assert = require('assert');


describe('Chat Server Test Suite', function() {
	var socket;

	before(function(done) {
		console.log('running before()');
		// Setup
        socket = io.connect('http://localhost:3000', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('worked...');
            done();
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        });
        socket.on('error', function() {
        	console.log('error connecting to chat server...');
        });
	});

	after(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

	describe('login', function() {
		it('should return true with a unique username', function(done) {


			socket.emit('login', 'myuniqueusername');

			socket.on('loginCallback', function(data) {
				assert.equal(data.result, false);
				done();
			});

		});
	});
});