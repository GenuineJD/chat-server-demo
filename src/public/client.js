(function() {
  var socket = io();
  var username = '_test_username_';
  var isTyping = false;
  var isLoggedIn = false;


  var sendMessage = function(message) {
    data = {
      message: message,
      username: username
    }
    socket.emit('message',data);
  }

  $('.chat').submit(function(){
    // socket.emit('message', $('#m').val());
    sendMessage($('#m').val())
    $('#m').val('');
    return false;
  });

  $('.login').submit(function() {
    username = $('#username').val();
    socket.emit('login',username);
    return false;
  });

  socket.on('message', function(msg){
    appendMessage(msg.username + ': ' + msg.message);
  });


  socket.on('loginCallback', function(resp) {
    console.log(resp);
    if(resp.status) {
      appendMessage(resp.username + ' has joined.');
      if(resp.username == username) {
        $('.login').hide();
      }
    } else {

    }
  });

  var appendMessage = function(msg) {
    $('#messages').append($('<li>').text(msg));
  }
})();