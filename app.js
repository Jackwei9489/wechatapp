var express = require('express');
var session = require('express-session')
var Promise = require('bluebird');
var mongoose = require('mongoose')

var bodyParser = require('body-parser');
var serveStatic=require('serve-static');
var path = require('path');

var app = new express();
var dbUrl = 'mongodb://115.28.226.162/wechat';
mongoose.connect(dbUrl);
app.set('views','./app/views');
app.set('view engine','jade');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 12 * 60 * 60 //有效期一天
    }
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(serveStatic('public'));

require('./config/router')(app);


app.listen(1234);
app.listen(1233);
console.log('listen on port 1234 and 1233')
