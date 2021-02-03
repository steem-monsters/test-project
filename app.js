var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const config = require('./config');
const { Hive } = require('@splinterlands/hive-interface');

const hive = new Hive();
hive.stream({
  on_op: onOperation,
  save_state: () => null,
  load_state: () => null
});

function onOperation(op, block_num, block_id, previous, transaction_id, block_time) {
  // Filter out any operations not related to Splinterlands
  if (op[0] != 'custom_json' || !op[1].id.startsWith(config.operation_prefix))
    return;

  //console.log(`Received operation: ${JSON.stringify(op)}`);
}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
