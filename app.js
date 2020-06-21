var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var flash = require('express-flash');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var productRouter =require('./routes/product');

var app = express();


// view engine setup
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/elements/');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ cookie: { maxAge: 180000*3 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist')));
app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/product',productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.session =req.session;
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
