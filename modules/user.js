function initialize(io) {
	var users = {};

	io.on('connection', function (socket) {

	    var currentUser = false;

	    // Display all users connected
	    displayUsersConnected(socket);

	    socket.on('login', function (user) {
	    	if(!currentUser) {
    		    currentUser = user;
		        currentUser.id = currentUser.email.replace(/@/g, '-').replace(/\./g, '-');
		        users[currentUser.id] = currentUser;
		        io.sockets.emit('notificationUserConnection', currentUser);
		        socket.emit('userConnection');
	    	}
	    });

	    socket.on('disconnect', function () { 
	        if(!currentUser) {
	            return false;
	        }
	        delete users[currentUser.id];
	        io.sockets.emit('notificationUserDisconnect', currentUser);
	    });

	});

	// Display all users connected
	function displayUsersConnected(socket) {
	    for(var index in users) {
	        socket.emit('notificationUserConnection', users[index]);
	    }
	}
}

module.exports.initialize = initialize;