var express = require('express');
var bodyParser = require('body-parser');
var configManager = require('./configuration-manager');

var app = express();
var port = 3001;

app.listen(port, function(){
	console.log('listening on port ', port);
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
 });

app.use( bodyParser.json() );

app.get('/get-configuration', function(req, res){
	var configurationData = configManager.getAllConfiguration();
	res.send(configurationData);
});

app.post('/save-configuration', function(req, res){
    configManager.saveConfiguration(req.body);
    res.send('ok');
});
