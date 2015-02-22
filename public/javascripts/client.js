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

	socket.on('notificationUserConnection', function (user) {
		$('#users').append('<li id="user-' + user.id + '">' + user.email + '</li>')
	});

	socket.on('userConnection', function () {
		console.log('Im logged');
	});

	socket.on('notificationUserDisconnect', function(user) {
		console.log(user.id);
		$('#user-'+user.id).remove();
	});


});