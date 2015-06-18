var express = require('express');
var bodyParser = require('body-parser');
var configManager = require('./configuration-manager');

var app = express();
var port = 3001;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

app.post('/save-template', function(req, res){
    configManager.saveTemplate(req.body);
    res.send('ok');
});


// this file is the configuration of the web server
//  5 - it starts express and makes it listen to port 3001
// 12 - configures CORS headers so it can accept ajax requests from different domains
// 18 - uses bodyParser.json so the post data be mapped to req.body
// 20 - sets up the necessary routes
// requires ./configuration-manager where the controller does all the heavy work
