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
      socket.emit('login', username, loginCallback);
    }
    return false;
  };

  ///////////////////////////
  // socket functions/handlers
  ///////////////////////////

  socket.on('message', function(msg){
    // if(!isLoggedIn) return;
    appendMessage(msg);
  });

  socket.on('refreshUsers', function(remoteUsers) {
    // if(!isLoggedIn) return;
    users = remoteUsers;
    populateUsersList();
  });


  socket.on('disconnect', function() {
    // setTimeout(function() {
    //   document.location = '/';
    // },2000);
    isLoggedIn = false;
    getEl('login').style.display = '';
  });


  ///////////////////////////
  // helper functions
  ///////////////////////////
  
  // sendMessage(message) - sends a message through to the chat server
  //  message (string) - the message
  //  
  var sendMessage = function(message) {
    data = {
      message: message,
      username: username
    }
    socket.emit('message',data);
  };

  // appendMessage(msg) - adds a message to the chat window
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


  var formatMessage = function(msg) {
    // TODO format message with local date
    return msg.username + ' ' + formatDate(msg.date) + ': ' + msg.message;
  }

  var populateMessagesList = function(messages) {
    getEl('messages').innerHTML = '';
    messages.forEach(function(msg,idx,arr) {
      appendMessage(msg);
    });
  };


  var appendUser = function(username) {
    var li = document.createElement('li');
    li.innerText = username;

    getEl('users').appendChild(li);
  };

  var populateUsersList = function() {
    getEl('users').innerHTML = '';
    users.forEach(function(user,idx,arr) {
      appendUser(user.username);
    });
  };

  // loginCallback(data)
  //  only triggered for this client upon login
  var loginCallback = function(data) {
    if(data.status) {
      getEl('login').style.display = 'none';
      isLoggedIn = true;
      populateMessagesList(data.messages);
    } else {
      alert(data.message);
    }
  };

  // get an element in the DOM by id
  var getEl = function(id) {
    return document.getElementById(id);
  };

  // Thu Jan 7, 11:34am
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

  var zeroPad = function(i,len) {
    return i.toString().length >= len ? i : Array(len+1-i.toString().length).join('0') + i;
  };

})();