var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter = require('./routes/employee');
var customerRouter = require('./routes/customer');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var transferRouter = require('./routes/transfers');
var passwordRouter = require('./routes/password');
var transferHistoryRouter = require('./routes/transferHistory');
var employeeToolsRouter = require('./routes/employeeTools');
var employeeTransferRouter = require('./routes/employeeTransfer');
var employeeAccountsRouter = require('./routes/employeeAccounts');
var employeeCustomerRouter = require('./routes/employeeCustomer');
var adminRolesRouter = require('./routes/adminRoles');
var adminPasswordResetRouter = require('./routes/adminPasswordReset');
var employeeCustomerTransferHistoryRouter = require('./routes/employeeCustomerTransferHistory');
var employeeTransferHistoryRouter = require('./routes/employeeTransferHistory');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap-icons/")));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employee', employeeRouter);
app.use('/customer', customerRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/transfers', transferRouter);
app.use('/password', passwordRouter);
app.use('/transferHistory', transferHistoryRouter);
app.use('/employeeTools', employeeToolsRouter);
app.use('/employeeTransfer', employeeTransferRouter);
app.use('/employeeAccounts', employeeAccountsRouter);
app.use('/employeeCustomer', employeeCustomerRouter);
app.use('/adminRoles', adminRolesRouter);
app.use('/adminPasswordReset', adminPasswordResetRouter);
app.use('/employeeCustomerTransferHistory', employeeCustomerTransferHistoryRouter);
app.use('/employeeTransferHistory', employeeTransferHistoryRouter);
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
