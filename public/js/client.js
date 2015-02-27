$(function() {

	var socket = io.connect('http://localhost:8000');

	/**
	 * USER LOGIN
	 **/

	// Login form submit
	$('#loginForm').submit(function(e) {
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
		$("#loginForm" ).hide("slide", function() {
        	$("#users").show("slide", function() {
        		$("#messages").delay(400).show("slide");
        		$("#messageForm").show("slide");
        	});
		});
	});

	// User disconnect
	socket.on('notificationUserDisconnect', function(user) {
		$('#user-'+user.id).remove();
	});

	/**
	 * USER MESSAGES
	 **/
		


});