var fs = require('fs');

var configRoot = __dirname + '/../data/';
var configObject;

setUpConfigurationObject();

module.exports = {
	getAllConfiguration: function(){
		return configObject;
	}, 
	saveConfiguration: function(body){
		switch( body.selectedConfigType ){
			case 'application.json':
				saveApplicationConfig( body.selectedApplication, body.configToBeSaved.channels);
				break;
		}
	}, 

	saveTemplate: function(){

	}
};


var saveApplicationConfig = function(application, config){
	var baseDir = configRoot + application + '/channels/';

	Object.keys(config).forEach(function(channelName){
		var filePath = baseDir + channelName + '/config/application.json';
		var dataToBeSaved = JSON.stringify( config[channelName] );
		fs.writeFileSync( filePath, dataToBeSaved, {encoding: 'utf8'} );
	});
	setUpConfigurationObject();
};

var saveTemplate = function(){

};


function setUpConfigurationObject(someParam){
	configObject = {
		templates: {},
		"application.json": {},
		channels: undefined,
		configTypes: [
			'application.json'
		]
	};

	var applications = fs.readdirSync(configRoot).filter(function(fileName){
		var stats = fs.statSync(configRoot + fileName);
		return stats.isDirectory();
	});

	applications.forEach(function(appName){
		configObject.templates[appName] = {};
		configObject.templates[appName]['application.json'] = require(configRoot + appName + '.application.template.js');

		configObject["application.json"][appName] = { channels: {} };
		configObject.channels = configObject.channels || fs.readdirSync(configRoot + appName + '/channels');
		configObject.channels.forEach(function(channelName){
			var channelPath = configRoot + appName + '/channels/' + channelName;
			if( fs.existsSync(channelPath) ) {
				var json = fs.readFileSync( channelPath + '/config/application.json', {enconding: 'utf8'} );
				configObject["application.json"][appName].channels[channelName] = JSON.parse( json );
			}
		});
	});
};


// this file has all the logic to read and write the configuration files
// it reads through the data directory to fill the configObject that is sent to the frontend
