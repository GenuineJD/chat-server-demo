var io = require('socket.io-client');
var assert = require('assert');

var test_users = ['user1','user2','user3'];
var test_messages = ['test message 1','test message 2','test message 3 with a link to google.com']

describe('Chat server test', function() {
	var socket1;
	var socket2;
	var socket3;

	var sockopts = {
        'reconnection delay' : 0,
        'reopen delay' : 0,
		'force new connection' : true,
		'timeout' : 4000
    };

    var chathost = 'http://localhost:3000';

	describe('login', function() {
		it('should return true with the first user', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {

				socket1.emit('login', test_users[0], function(result) {
					assert.equal(result.status, true);
					socket1.disconnect();
					done();
				});
				
			});


		});

		it('should return false with a non-unique username', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {

				socket1.emit('login', test_users[1], function(data) {

					var socket2 = io.connect(chathost, sockopts);
					socket2.on('connect', function() {

						socket2.emit('login', test_users[1], function(data) {

							assert.equal(data.status, false);
							
							socket2.disconnect();
							socket1.disconnect();

							done();
						});
					});

				});
			});


		});

		it('should return a status message if it fails', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {

				socket1.emit('login', test_users[0], function(data) {

					var socket2 = io.connect(chathost, sockopts);
					socket2.on('connect', function() {

						socket2.emit('login', test_users[0], function(data) {

							assert.equal(data.message, 'Username is already taken!');
							
							socket2.disconnect();
							socket1.disconnect();

							done();
						});
					});

				});
			});
		});

		it('should return a list of messages', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				socket1.emit('login', test_users[2], function(result) {
					assert.notEqual(result.messages, undefined);
					assert.notEqual(result.messages.length, 0);
					socket1.disconnect();
					done();
				});
				
			});
		});

		it('should broadcast a \'user entered\' message', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				socket1.emit('login', test_users[2], function(result) {
					var lastMessage = result.messages[result.messages.length-1];
					assert.equal(lastMessage.message, 'user3 has joined.');
					socket1.disconnect();
					done();
				});
				
			});
		});

		it('should broadcast a \'refresh users\' event', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			var receivedRefresh = false;
			socket1.on('connect', function() {
				socket1.emit('login',test_users[0]);
			});
			socket1.on('refreshUsers', function(users) {
				receivedRefresh = true;
				socket1.disconnect();
			});

			socket1.on('disconnect', function() {
				if(!receivedRefresh) {
					assert.fail(1,2,'Refresh event not received!','');
				}
				done();
			});
		});

	});

	describe('message', function() {
		it('should assign a date value', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				socket1.emit('message', { message: test_messages[1], username: test_users[1] });
			})
			socket1.on('message', function(msg) {
				assert.notEqual(msg.date, undefined);
				socket1.disconnect();
				done();
			});
		});
		it('should emit the message to all clients', function(done) {
			var msgs = 0;
			var dissedClients = 0;

			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {

				var socket2 = io.connect(chathost, sockopts);
				socket2.on('connect', function() {

					var socket3 = io.connect(chathost, sockopts);
					socket3.on('connect', function() {

						socket3.on('message', function(msg) {
							assert.equal(msg.message, test_messages[1]);
							msgs++;
							socket3.disconnect();
						})

						socket3.on('disconnect', onDisconnect);

						socket3.emit('message', { message: test_messages[1], username: test_users[1] });

					})

					socket2.on('message', function(msg) {
						assert.equal(msg.message, test_messages[1]);
						msgs++;
						socket2.disconnect();
					})

					socket2.on('disconnect', onDisconnect);
				})

				socket1.on('message', function(msg) {
					assert.equal(msg.message, test_messages[1]);
					msgs++;
					socket1.disconnect();
				});

				socket1.on('disconnect', onDisconnect);

			});

			var onDisconnect = function() {
				if(++dissedClients == 3) {
					assert.equal(msgs, 3);
					done();
				}
			}
		});
		it('should detect and format links', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				socket1.emit('message', { message: test_messages[2], username: test_users[2] } );
			});

			socket1.on('message', function(msg) {
				assert.equal(msg.message,'test message 3 with a link to <a href="http://google.com" class="linkified" target="_blank">google.com</a>');
				socket1.disconnect();
				done();
			})
		});
	});

	describe('disconnect', function() {
		it('should broadcast a \'user left\' message', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				var socket2 = io.connect(chathost, sockopts);
				socket2.on('connect', function() {
					socket1.emit('login',test_users[0], function(data) {
						socket1.disconnect();
					});
				});
				socket2.on('message', function(msg) {
					if(msg.message == test_users[0] + ' has left.') {
						socket2.disconnect();
						done();
					}
				});
			});
		});
		it('should broadcast a \'refresh users\' event', function(done) {
			var socket1 = io.connect(chathost, sockopts);
			socket1.on('connect', function() {
				var socket2 = io.connect(chathost, sockopts);
				socket2.on('connect', function() {
					socket1.emit('login',test_users[0], function(data) {
						socket1.disconnect();
					});
				});
				socket2.on('refreshUsers', function(msg) {
					done();
				});
			});
		});
	});
});