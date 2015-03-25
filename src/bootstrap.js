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
