# Node Chat Server Demo
Node.js chat server using socket.io and express with mocha, should, linkify and gulp.

## Built With
* node.js 4.2.4 (npm 2.14.12)
* gulp 3.9.0

## Getting Started
Clone source and install modules
```
git clone git@github.com:GenuineJD/chat-server-demo.git
cd chat-server-demo
npm install
```

Run the node app using ``gulp`` and you should see something similar to the following:
```
gulp
[00:00:39] Using gulpfile ~/Documents/Source/chat-server-demo/gulpfile.js
[00:00:39] Starting 'server'...
[00:00:39] Finished 'server' after 2.15 ms
[00:00:39] Starting 'default'...
[00:00:39] Finished 'default' after 13 μs
[00:00:39] [nodemon] 1.8.1
[00:00:39] [nodemon] to restart at any time, enter `rs`
[00:00:39] [nodemon] watching: *.*
[00:00:39] [nodemon] starting `node src/server.js`
app is running and listening on *:3000
```

Load the chat interface in multiple tabs/windows at [http://localhost:3000/](http://localhost:3000/) and start chatting!

## Unit Tests
Both server and client side unit tests have been written.

Run the server tests using ``gulp test`` and you should see something similar to the following:
```
gulp test
[00:04:13] Using gulpfile ~/Documents/Source/chat-server-demo/gulpfile.js
[00:04:13] Starting 'test'...
[00:04:13] Starting 'server'...
[00:04:13] Finished 'server' after 1.68 ms
[00:04:13] Starting 'js-test'...
running js tests...
[00:04:14] [nodemon] 1.8.1
[00:04:14] [nodemon] to restart at any time, enter `rs`
[00:04:14] [nodemon] watching: *.*
[00:04:14] [nodemon] starting `node src/server.js`
app is running and listening on *:3000
 11  -_-_-_-_-_-__,------,
 0   -_-_-_-_-_-__|  /\_/\ 
 0   -_-_-_-_-_-_~|_( ^ .^) 
     -_-_-_-_-_-_ ""  "" 

  11 passing (1s)
```

Run the client tests by starting up the node app using ``gulp``, then navigating to [http://localhost:3000/test](http://localhost:3000/test).

## Notes
Once modules have been installed, there are no external dependancies.  The chat server, interface and all tests can be run locally.

Review the requirements [here](https://github.com/GenuineJD/chat-server-demo/blob/master/challenge.md)
