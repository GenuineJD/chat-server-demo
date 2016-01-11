#######################

Javascript Coding Challenge

Problem:

Using both client and server side javascript, create a real-time multiuser chat room that can display simple text messages.

Requirements:

* Node.js 4+ should be used for the server runtime, but there are no restrictions on what stardard or 3rd party libraries may be used.
* Client side 3rd party libraries to support real-time communication may be used in the browser client, but only core javascript and DOM APIs should be used for the UI (no jQuery).
* Automated unit tests should be included for both client and server code.
* The chat history only needs be stored in memory, there is no need to persist it to a data store or for it to survive a server restart.
* There is no limit on the number of users that may join the chat room.

* When a user loads the chat client in the browser they should be shown a simple form UI to enter their username.
* Usernames should be between 3 - 12 characters.
* The server should only allow unique usernames, and should return an error to the client if the username is already in use.
* After successfully entering a username the user should be shown the chat room UI.

* The chat room UI should consist of the following: 
    * A list of the current users in the chat room.
    * The most recent 20 messages.
    * A Text area and submit button that allows the user to enter a new message.

* A single message in the chat room should be displayed with the following fields:
    * The username that sent the message.
    * The timestamp when the message was sent, in the browser's local timezone, in the form: Thu Jan 7, 11:34am
    * The message text.
    * Any urls in the text should be detected and converted into anchor tags that open the url in a new window when clicked. The text of the anchor tag should be the url itself.
    * All fields should be displayed on the same line, and there should be one row per message.

* When a user joins the chat room the following message should be displayed: "<username> has joined."
* When user enters a new message it should display in the chat room.
* When a user leaves the chat room the following message should be display: "<username> has left."
* The list of users in the chat room should dynamically update as users join and leave.
