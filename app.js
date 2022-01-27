const {readFileSync, writeFileSync} = require('fs');
const createError = require('http-errors')
const express = require('express')
const path = require('path');

const app = express();




app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

const netflixRouter = require('./routes/netflix');
app.use('/netflix', netflixRouter);

const disneyRouter = require('./routes/disney.js');
app.use('/disney', disneyRouter);

const inkyRouter = require('./routes/inky.js');
app.use('/inky', inkyRouter);

const coobRouter = require('./routes/coob.js');
const {system} = require("selenium-webdriver/lib/proxy");
app.use('/coob', coobRouter);


module.exports = app;
