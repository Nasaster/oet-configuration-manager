window.jQuery = require('jquery');
require('bootstrap');
var ajax = require('oet-lib/ajax');

var configurationManager = require('./configuration-manager/configuration-manager.controller');

var config = {
	configurationURL: 'http://localhost:3001/get-configuration',
	applications: [
		'Calendar',
		'Walldecor',
		'Phonecase'
	]
}; 


ajax.getJSON( config.configurationURL )
	.then( function(res){
		config.channels = res;
	})
	.then( configurationManager.init.bind(null, config) )
	.then (
		function(){ console.log('configurationManager started successfully'); },
		function(err){ console.error(err); }
	);