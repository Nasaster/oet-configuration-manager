var pubsub = require('oet-lib/pubsub');


window.jQuery = require('jquery');
require('bootstrap');
var ajax = require('oet-lib/ajax');

var configurationManager = require('./configuration-manager/configuration-manager.controller');

var CONFIGURATION_URL = 'http://localhost:3001/get-configuration';


ajax.getJSON( CONFIGURATION_URL )
	.then( configurationManager.init.bind(configurationManager) )
	.then (
		function(){ console.log('configurationManager started successfully'); },
		function(err){ console.error(err.stack); }
	);

pubsub.subscribe('*', function(message, payload){
    if(!debug) return;
	console.log('------- Message Received ----------');
	console.log('message:', message);
	console.log('payload:', payload);
    console.log('-----------------------------------');
});

var debug = localStorage.debugMode || false;
window.debug = function(){
    if(localStorage.debugMode){
        delete localStorage.debugMode;
    } else {
        localStorage.debugMode = true;
    };
    debug = !debug;
}


/**
This file is where it all starts.
- it requires global libs as jQuery and bootstrap so they are available anywhere
- it uses Ajax to get any configuration it needs from the server
- it uses pubsub to listen to any messages coming and logs them to the console
   you may deactivate/reactivate this by running debug() in the console
- and initializes the main controller with the retrieved configuration
- it also attaches a success and error handlers that log to the console any error 
    that might occur in the initialization of the app
**/
