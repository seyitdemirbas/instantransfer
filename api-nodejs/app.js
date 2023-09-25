var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
console.log(process.env.CAPTCHA_SECRET_KEY) // remove this after you've confirmed it is working

mongoose.connect('mongodb://127.0.0.1:27017/test');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
