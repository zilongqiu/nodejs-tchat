$(function() {

	var socket = io.connect('http://localhost:8080');

	// LOGIN
	$('#login').submit(function(e) {
		e.preventDefault();

		socket.emit('login', { 
			email   : $('#email').val(),
			password: $('#password').val()
		});
	});

	// List all users connected
	socket.on('notificationUserConnection', function (user) {
		$('#users').append('<li id="user-' + user.id + '">' + user.email + '</li>')
	});

	// User connected
	socket.on('userConnection', function () {
		$("#login" ).hide("slide", function() {
        	$("#users").show("slide");
		});
	});

	// User disconnect
	socket.on('notificationUserDisconnect', function(user) {
		$('#user-'+user.id).remove();
	});


});