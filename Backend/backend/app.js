var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//CORS Kütüphanesini Çağırıyor
var cors = require('cors');

require('./app_api/models/db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRoute = require('./app_api/routes/index');

var app = express();

//CORS'u Aktif Ediyor
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", apiRoute);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;