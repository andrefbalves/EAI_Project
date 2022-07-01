import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import {indexRouter} from './routes/index.mjs';
import {usersRouter} from './routes/users.mjs';
import {trainRouter} from './routes/training-engine.mjs';
import {configurationRouter} from './routes/configuration-engine.mjs';
import {testRouter} from './routes/test-engine.mjs';
import {classifierRouter} from './routes/classifier-engine.mjs';

export var app = express();
const __dirname = "C:\\EAI_Project\\";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images/', express.static('./public/images'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/training-engine', trainRouter);
app.use('/configuration-engine', configurationRouter);
app.use('/test-engine', testRouter);
app.use('/classifier-engine', classifierRouter);

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