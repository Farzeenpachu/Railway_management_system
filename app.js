const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const { engine } = require('express-handlebars');

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();

// View engine setup with default layout
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'userLayout',  // Set user layout as default
  layoutsDir: path.join(__dirname, 'views', 'Layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', indexRouter);
app.use('/user', usersRouter);

// Use admin layout for admin routes
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'adminLayout';  // Override layout for admin routes
  next();
}, adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
