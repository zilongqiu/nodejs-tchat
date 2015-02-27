function initialize(io) {
	var users = {};
	var messagesHistory = [];
	var historyMax = 3;

	io.on('connection', function (socket) {

	    var currentUser = false;

	    // Display all users connected
	    displayUsersConnected(socket);

	    // Display all messages
	    displayMessages(socket);

	    // User login
	    socket.on('login', function (user) {
	    	if(!currentUser) {
    		    currentUser = user;
		        currentUser.id = currentUser.email.replace(/@/g, '-').replace(/\./g, '-');
		        users[currentUser.id] = currentUser;
		        io.sockets.emit('notification_user_connection', currentUser);
		        socket.emit('user_connection');
	    	}
	    });

	    // User disconnect
	    socket.on('disconnect', function () { 
	        if(!currentUser) {
	            return false;
	        }
	        delete users[currentUser.id];
	        io.sockets.emit('notification_user_disconnect', currentUser);
	    });

	    // User message
	    socket.on('message_create', function (message) {
	    	if(typeof message.message !== 'undefined' && message.message.trim() != "") {
		    	var message;
		    	message.user = currentUser;
		    	date = new Date();
		    	message.h = date.getHours();
		    	message.m = (date.getMinutes()<10?'0':'') + date.getMinutes();

		    	// Check number of message in history
		    	messagesHistory.push(message);
		    	if(messagesHistory.length > historyMax) {
		    		messagesHistory.shift();
		    	}
		    	io.sockets.emit('new_message_notification', message);
	    	}
	    });

	});

	// Display all users connected
	function displayUsersConnected(socket) {
	    for(var index in users) {
	        socket.emit('notification_user_connection', users[index]);
	    }
	}

	// Display all messages
	function displayMessages(socket) {
		for(var index in messagesHistory) {
			socket.emit('new_message_notification', messagesHistory[index]);
		}
	}
}

module.exports.initialize = initialize;