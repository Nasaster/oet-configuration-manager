var pubsub = require('oet-lib/pubsub');


window.jQuery = require('jquery');
require('bootstrap');
var ajax = require('oet-lib/ajax');

var configurationManager = require('./configuration-manager/configuration-manager.controller');

var CONFIGURATION_URL = 'http://localhost:3001/get-configuration';


ajax.getJSON( CONFIGURATION_URL )
	.then( configurationManager.init )
	.then (
		function(){ console.log('configurationManager started successfully'); },
		function(err){ console.error(err); }
	);


pubsub.subscribe('*', function(message, payload){
	console.log('------- Message Received ----------');
	console.log('message:', message);
	console.log('payload:', payload);
});