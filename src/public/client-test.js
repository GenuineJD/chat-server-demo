var test_users = [
	{ username: 'user1', id: '111aaa' },
	{ username: 'user2', id: '222bbb' },
	{ username: 'user3', id: '333ccc' }
];

var test_messages = [
	{ message: 'a test message 1', username: 'user1', date: 1452629777071 },
	{ message: 'a test message 2', username: 'user2', date: 1452639788271 },
	{ message: 'a test message 3', username: 'user3', date: 1452659798771 },
	{ message: 'a test message 4', username: 'user2', date: 1452699877071 },
	{ message: 'a test message 5', username: 'user1', date: 1452729977071 },
];


describe('DOM Tests', function() {
	describe('append message', function() {
		it('should add a message to the chat window', function() {
			// first clear list, try appending a message, check for that element
			populateMessagesList([]);
			appendMessage(test_messages[1]);
			var messagesEl = getEl('messages');
			should(messagesEl.children.length).be.equal(1);
			appendMessage(test_messages[2]);
			should(messagesEl.children.length).be.equal(2);
		});

		it('should only allow 20 messages in the chat window', function() {
			populateMessagesList([]);
			var i = 19;
			while(i--) {
				appendMessage(test_messages[1]);
			}
			var messagesEl = getEl('messages');
			should(messagesEl.children.length).be.equal(19);

			appendMessage(test_messages[1]);
			should(messagesEl.children.length).be.equal(20);

			appendMessage(test_messages[1]);
			should(messagesEl.children.length).be.equal(20);

			appendMessage(test_messages[1]);
			should(messagesEl.children.length).be.equal(20);
		});
	});

	describe('append user', function() {
		it('should add a user to the user window', function() {
			// first clear list, try appending a user, check for that element
			users = []
			populateUsersList();
			appendUser(test_users[1].username);
			var usersEl = getEl('users');
			should(usersEl.children.length).be.equal(1);
			appendUser(test_users[2].username);
			should(usersEl.children.length).be.equal(2);
		});
	});

	describe('get element', function() {
		it('should return a dom element with the specified id', function() {
			should(getEl('messages')).not.be.equal(null);
			should(getEl('messages').id).be.equal('messages');
			should(getEl('thereisnoelementbythisname')).be.equal(null);
		});
	});

	describe('populate users list', function() {
		it('should clear the users list', function() {
			users = [];
			populateUsersList();
			var usersEl = getEl('users');
			should(usersEl.children.length).be.equal(0);
		});

		it('should clear the users list and add users to the user window', function() {
			users = test_users;
			populateUsersList();
			var usersEl = getEl('users');
			should(usersEl.children.length).be.equal(3);
		});
	});

	describe('populate messages list', function() {
		it('should clear the messages list', function() {
			populateMessagesList([]);
			var msgsEl = getEl('messages');
			should(msgsEl.children.length).be.equal(0);
		});

		it('should clear the messages list and add messages to the chat window', function() {
			populateMessagesList(test_messages);
			var msgsEl = getEl('messages');
			should(msgsEl.children.length).be.equal(5);
		});
	});


});

describe('Formatting Tests', function() {
	describe('format message', function() {

		it('should return a string', function() {
			formatMessage(test_messages[0]).should.be.String;
		});

		it('should return a specifically formatted string', function() {	
			formatMessage(test_messages[1]).should.be.equal('user2 Tues Jan 12, 5:03pm: a test message 2');
		});
	});

	describe('format date', function() {
		it('should return a date in a specific format', function() {
			formatDate(test_messages[0].date).should.be.equal('Tues Jan 12, 2:16pm');
			formatDate(test_messages[1].date).should.be.equal('Tues Jan 12, 5:03pm');
			formatDate(test_messages[2].date).should.be.equal('Tues Jan 12, 10:36pm');
		});
	});

	describe('zero pad', function() {
		it('should add leading zeros to an integer with not enough digits', function() {
			zeroPad(1,5).should.be.equal('00001');
			zeroPad(104,19).should.be.equal('0000000000000000104');
		});
		it('should round non-integer numeric values before padding with leading zeros', function() {
			zeroPad(23.582,3).should.be.equal('024');
		});
		it('should parse a string to a numeric value', function() {
			zeroPad('5.1234',4).should.be.equal('0005');
		});
		// should not add zeros for right length
		it('should not add leading zeros to an integer with the correct number of digits', function() {
			zeroPad(23,2).should.be.equal('23');
		})
		// should not add zeros for longer than min
		it('should not add leading zeros to an integer with more than the correct number of digits', function() {
			zeroPad(235,2).should.be.equal('235');
		})
	});
});

describe('Socket.IO Tests', function() {

	describe('send message', function() {
		it('should invoke the chat server to broadcast a message', function(done) {
			var testsock = io();
			testsock.on('message', function(msg) {
				should(msg).have.property('message');
				should(msg).have.property('date');
				should(msg.message).be.equal(test_messages[0].message);

				testsock.disconnect();
				done();
			})

			sendMessage(test_messages[0].message);
		});
	});

	describe('send login', function() {
		it('should invoke the chat server to submit a login', function(done) {
			var oldCallback = loginCallback;
			// re-define the callback
			loginCallback = function(data) {
				should(data).have.property('status');
				should(data).have.property('message');
				should(data).have.property('messages');

				should(data.status).be.equal(true);

				loginCallback = oldCallback;

				done();
			}
			sendLogin(test_users[2].username);
		});
	});

	describe('login callback', function() {
		it('should log the user into the chat room', function() {
			var callbackSucceed = {
				status: true,
				message: 'Unknown',
				messages: test_messages
			};

			// reset messages list first
			populateMessagesList([]);
			var messagesEl = getEl('messages');
			should(messagesEl.children.length).be.equal(0);
			
			loginCallback(callbackSucceed);
			should(messagesEl.children.length).be.equal(5);

			should(isLoggedIn).be.equal(true);

			should(getEl('login').style.display).be.equal('none');

		}); // hide the form, loggedin flag, populate messages
		it('should check for login errors', function() {
			var callbackFail = {
				status: false,
				message: 'testing login callback failure',
				messages: []
			};
			isLoggedIn = false;
			// test failure, uncomment the next two lines to test login call back failure status from chat server
			// loginCallback(callbackFail);
			// should(isLoggedIn).be.equal(false);
		});
	});

});
