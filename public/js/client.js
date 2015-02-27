$(function() {

	var socket = io.connect('http://localhost:8000');
	var messageTemplate = $('#message-template').html();
	$('#message-template').remove();

	/**
	 * USER LOGIN
	 **/

	// Login form submit
	$('#loginForm').submit(function(e) {
		e.preventDefault();

		socket.emit('login', { 
			username: $('#username').val(),
			email   : $('#email').val(),
			password: $('#password').val()
		});
	});

	// List all users connected
	socket.on('notification_user_connection', function (user) {
		$('#users').append('<li id="user-' + user.id + '">' + user.username + '</li>')
	});

	// User connected
	socket.on('user_connection', function () {
		$("#loginForm" ).hide("slide", function() {
        	$("#users").show("slide", function() {
        		$("#messages").delay(400).show("slide");
        		$("#messageForm").show("slide");
        		$("#message").focus();
        	});
		});
	});

	// User disconnect
	socket.on('notification_user_disconnect', function(user) {
		$('#user-'+user.id).remove();
	});

	/**
	 * USER MESSAGES
	 **/

	// Create a new message
	$('#messageForm').submit(function(e) {
		e.preventDefault();

		if($('#message').val().trim()) {
			socket.emit('message_create', { 
				message: $('#message').val()
			});

			$('#message').val('');
			$("#message").focus();
		}
		else {
			$('#message').val('');
		}
	});

	// New message notification
	socket.on('new_message_notification', function(message) {
		$('#messages').append('<div class="message">' + Mustache.render(messageTemplate, message) + '</div>');
		$('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')}, 500);
	});

});