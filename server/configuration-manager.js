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
				saveApplicationConfig( body.selectedApplication, body.configToBeSaved.channels );
				break;
			case 'locale.json':
				saveLocaleConfig( body.selectedLocale, body .configToBeSaved.channels );
				break;
		}
	}, 

	saveTemplate: function(body){
		//[TODO] add logic to distinguish between templates
		var path = configRoot + body.selectedApplication + '.' + body.selectedConfigType.replace( '.json', '' ) + '.template.json';
		var path = configRoot + body.selectedLocale + '.' + body.selectedConfigType.replace( '.json', '' ) + '.template.json';
		var jsonToWrite = JSON.stringify( body.templateToBeSaved, null, 4 );
		fs.writeFileSync( path, jsonToWrite, {encoding: 'utf8'} );
		setUpConfigurationObject();
	}
};


var saveApplicationConfig = function(application, config){
	var baseDir = configRoot + application + '/channels/';

	Object.keys(config).forEach(function(channelName){
		var filePath = baseDir + channelName + '/config/application.json';
		var dataToBeSaved = JSON.stringify( config[channelName], null, 4 );
		fs.writeFileSync( filePath, dataToBeSaved, {encoding: 'utf8'} );
	});
	setUpConfigurationObject();
};

var saveLocaleConfig = function(locale, locale){
	var baseDir = configRoot + locale + '/channels/';

	Object.keys(locale).forEach(function(channelName){
		var filePath = baseDir + channelName + '/locale/locale.json';
		var dataToBeSaved = JSON.stringify( locale[channelName], null, 4 );
		fs.writeFileSync( filePath, dataToBeSaved, {encoding: 'utf8'} );
	});
	setUpConfigurationObject();
};

var saveTemplate = function(){

};


function setUpConfigurationObject(someParam)
{
	var filterFiles = function(folder) {
		return fs.readdirSync(folder).filter(function(fileName){
			var stats = fs.statSync(folder + fileName);
			return stats.isDirectory();
		});
	};

	var loadConfiguration = function(configType, appName) {
		configObject.templates[appName] = ( configObject.templates[appName] ? configObject.templates[appName] : {} );
		var json = fs.readFileSync(configRoot + appName + '.' + configType + '.template.json', {encoding: 'utf8'});
		configObject.templates[appName][configType + '.json'] = JSON.parse(json);

		configObject[configType + '.json'][appName] = { channels: {} };
		configObject.channels = configObject.channels || filterFiles(configRoot + appName + '/channels/');
		
		configObject.channels.forEach(function(channelName){
			var channelPath = configRoot + appName + '/channels/' + channelName;
			if( fs.existsSync( channelPath + '/config/' + configType + '.json' ) ) {
				var json = fs.readFileSync( channelPath + '/config/' + configType + '.json', {enconding: 'utf8'} );
				configObject[configType + '.json'][appName].channels[channelName] = JSON.parse( json );
			}
		});
	}

	configObject = {
		templates: {},
		"application.json": {},
		"locale.json": {},
		channels: undefined,
		configTypes: [
			'application.json',
			'locale.json'
		]
	};

	var applications = filterFiles(configRoot);
	
	applications.forEach(function(appName){
		['application', 'locale'].forEach(function(configType) {
			loadConfiguration(configType, appName);
		});
	});
};


// this file has all the logic to read and write the configuration files
// it reads through the data directory to fill the configObject that is sent to the frontend
