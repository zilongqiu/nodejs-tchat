var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var http = require('http');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

// Mongoose
mongoose.connect('mongodb://localhost:27017/nodejs-tchat', function (error) {
    if (error) {
        console.log(error);
    }
});;

// Mongoose Schema definition
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true }
});

// Routing
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Match url with local resource
var resourceLoader = require('./modules/resource/resource-loader.js');
// Match CSS
resourceLoader.matchLocalResource(app, '/css/bootstrap.min.css', path.join(__dirname,'node_modules','bootstrap','dist','css','bootstrap.min.css'));

// Match JS
resourceLoader.matchLocalResource(app, '/js/bootstrap.min.js', path.join(__dirname,'node_modules','bootstrap','dist','js','bootstrap.min.js'));
resourceLoader.matchLocalResource(app, '/js/jquery.min.js', path.join(__dirname,'node_modules','jquery','dist','jquery.min.js'));
resourceLoader.matchLocalResource(app, '/js/jquery.min.map', path.join(__dirname,'node_modules','jquery','dist','jquery.min.map'));
resourceLoader.matchLocalResource(app, '/js/socket.io.js', path.join(__dirname,'node_modules','socket.io','node_modules','socket.io-client','socket.io.js'));

// Create server's socket
var server = http.createServer(app).listen(8000);
var io = socket.listen(server);
require('./modules/user/user.js').initialize(io);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
