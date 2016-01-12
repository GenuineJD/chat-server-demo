(function() {
  var socket = io();
  var username;
  var username_re = /^([a-zA-Z0-9]){3,12}$/; 
  var users = [];
  var isLoggedIn = false;

  var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];


  ///////////////////////////
  // window/dom events
  ///////////////////////////
  
  // handle chat window form submit
  //  
  //  get the chat message
  //  send it to the socket
  //  clear the chat input field
  //  
  document.getElementById('chatform').onsubmit = function(){
    var el = getEl('m');
    var msg = el.value;
    sendMessage(msg);
    el.value = '';
    return false;
  };

  // handle login form submit
  //  
  //  get the username
  //  validate it against the regex
  //    display an error if it fails
  //  send a login message to the socket
  //  
  document.getElementById('loginform').onsubmit = function() {
    username = getEl('username').value;
    if(!username_re.exec(username)) {
      alert('Invalid username.  Use 3-12 alpha-numerics only.');
    } else {
      sendLogin(username);
    }
    return false;
  };

  ///////////////////////////
  // socket handlers
  ///////////////////////////

  // message handler
  //  
  //  append the message to the UI
  //  
  socket.on('message', function(msg){
    appendMessage(msg);
  });

  // refreshUsers handler
  //  
  //  keep a local copy of the users
  //  update the users list in the UI
  //  
  socket.on('refreshUsers', function(remoteUsers) {
    users = remoteUsers;
    populateUsersList();
  });

  // disconnect handler
  //  
  //  updated logged in flag
  //  show the login form again
  //  
  socket.on('disconnect', function() {
    isLoggedIn = false;
    getEl('login').style.display = '';
  });


  ///////////////////////////
  // socket functions
  ///////////////////////////

  // sendMessage(message)
  //  creates a message object and sends 
  //  itthrough to the chat server
  // 
  //  message (string) - the message
  //  
  var sendMessage = function(message) {
    data = {
      message: message,
      username: username
    }
    socket.emit('message',data);
  };

  // sendLogin(username)
  //  send a login message to the chat server with the
  //  given username and specify a callback to process
  //  the response
  //  
  // username (string)
  //  the username for the chat user client
  //  
  var sendLogin = function(username) {
    socket.emit('login', username, loginCallback);
  }

  ///////////////////////////
  // callback functions
  ///////////////////////////

  // loginCallback(data)
  //  call back function from the chat server
  //  after a login message was sent.
  //  
  //  only triggered for this client upon login
  //  
  //  if the login was successful, the login form is hidden and the
  //  chat window is populated with the most recent messages from
  //  the server
  //  
  //  if the login was unsuccessful, the error message from the server
  //  is displayed
  //  
  //  data (obj)
  //    status (bool) - true | false if the login was successful
  //    message (string) - error message if login was unsuccessful
  //    messages (array) - array of messages in the curren chat history
  //    
  var loginCallback = function(data) {
    if(data.status) {
      getEl('login').style.display = 'none';
      isLoggedIn = true;
      populateMessagesList(data.messages);
    } else {
      alert(data.message);
    }
  };


  ///////////////////////////
  // helper functions
  ///////////////////////////

  // appendMessage(msg)
  //  adds a message to the chat window
  //  
  //  msg (obj) - the message to append
  //    username
  //    message
  //    date
  //  
  var appendMessage = function(msg) {
    var li = document.createElement('li');
    li.innerHTML = formatMessage(msg);

    getEl('messages').appendChild(li);
  };

  // formatMessage(msg)
  //  Returns the message object as a properly formatted string
  //  
  //  msg (obj)
  //    username
  //    message
  //    date
  //    
  var formatMessage = function(msg) {
    // TODO format message with local date
    return msg.username + ' ' + formatDate(msg.date) + ': ' + msg.message;
  }

  // populateMessagesList(messages)
  //  processes each message in the array for adding
  //  to the chat UI.  Clears out any exist messages.
  //  
  //  this is only invoked after a successful login
  // 
  // messages (array) of message objects
  //  
  var populateMessagesList = function(messages) {
    getEl('messages').innerHTML = '';
    messages.forEach(function(msg,idx,arr) {
      appendMessage(msg);
    });
  };

  // appendUser(username)
  //  adds a user to the user list
  //  
  // username (string)
  //  
  var appendUser = function(username) {
    var li = document.createElement('li');
    li.innerText = username;

    getEl('users').appendChild(li);
  };

  // populateUsersList
  //  clears our the existing user list and adds
  //  each user to the user list UI
  //  
  var populateUsersList = function() {
    getEl('users').innerHTML = '';
    users.forEach(function(user,idx,arr) {
      appendUser(user.username);
    });
  };

  // getEl(id)
  //  get an element in the DOM by id
  //  we don't need no stinkin' jquery
  //  
  // id (string)
  //  the id of the element
  //  
  var getEl = function(id) {
    return document.getElementById(id);
  };

  // formatDate(date)
  //  Format a date (epoch) value into a string
  //  Thu Jan 7, 11:34am
  //  
  // date (int)
  //  a date value in the form of milliseconds since the epoch
  //  
  var formatDate = function(date) {
    var d = new Date(date);
    var dstr = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ';

    var h = d.getHours();
    var a = 'am';
    if(h==0) {
      h = 12;
    } else if(h > 11) {
      a = 'pm';
      h = h - 12;
    }

    dstr += h;

    var m = zeroPad(d.getMinutes(),2);

    dstr += ':' + m + a;

    return dstr;
  };

  // zeroPad(i, len)
  //  add leading zeros to the front of a digit to ensure it is a least len characters
  //  
  //  i
  //    the current digit
  //  len
  //    the minimum required length
  //    
  var zeroPad = function(i,len) {
    return i.toString().length >= len ? i : Array(len+1-i.toString().length).join('0') + i;
  };

})();