var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var browserify = require('browserify-middleware');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/admin');
var apiV1 = require('./routers/apiv1');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var dbConnectionStr = 'mongodb://localhost:27017/colleges2018';

if (app.get('env') == 'development') {
    var browserSync = require('browser-sync');
    var config = {
        files: ["public/**/*.{js, css}", "client/*.js", "sass/**/*.scss", "view/**/*.hbs"],
        logLevel: 'debug',
        logSnippet: false,
        reloadDelay: 3000,
        reloadOnRestart: true
    };
    var bs = browserSync(config);
    app.use(require('connect-browser-sync')(bs));
}

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/api/v1', apiV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;