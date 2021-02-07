var fs = require('fs');

var configRoot = __dirname + '/../data/';
var configObject;

var projectPathsUrl = 'projectPaths.json';
var projectPaths = {
	"calendar": "/../../{appName}/resources/config/channels/",
	"phonecase": "/../../{appName}/resources/config/channels/",
	"walldecor": "/../../{appName}/resources/config/channels/"
};
if( fs.existsSync( projectPathsUrl ) ) {
	var json = fs.readFileSync( projectPathsUrl, {enconding: 'utf8'} );
	projectPaths = JSON.parse( json );
}

setUpConfigurationObject();

module.exports = {
	getAllConfiguration: function(){
		return configObject;
	},
	saveConfiguration: function(body){
		saveApplicationConfig( body.selectedApplication, body.configToBeSaved.channels, body.selectedConfigType );
	},
	saveTemplate: function(body){
		//[TODO] add logic to distinguish between templates
		var path = configRoot + body.selectedApplication + '/' + body.selectedConfigType.replace( '.json', '' ) + '.template.json';
		var jsonToWrite = JSON.stringify( body.templateToBeSaved, null, 4 );
		fs.writeFileSync( path, jsonToWrite, {encoding: 'utf8'} );
		setUpConfigurationObject();
	}
};

var saveApplicationConfig = function(appName, config, configType){
	var channelsPath = __dirname + projectPaths[ appName ].replace('{appName}', appName);

	Object.keys(config).forEach(function(channelName){
		var filePath = channelsPath + channelName + '/config/' + configType;
		var dataToBeSaved = JSON.stringify( config[channelName], null, 4 );
		fs.writeFileSync( filePath, dataToBeSaved, {encoding: 'utf8'} );
	});
	setUpConfigurationObject();
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
		var json = fs.readFileSync(configRoot + appName + '/' + configType + '.template.json', {encoding: 'utf8'});
		configObject.templates[appName][configType + '.json'] = JSON.parse(json);

		if (!configObject[configType + '.json']) {
			configObject[configType + '.json'] = {};
		}
		configObject[configType + '.json'][appName] = { channels: {} };
		var channelsPath = __dirname + projectPaths[ appName ].replace('{appName}', appName);
		configObject.channels = configObject.channels.concat(
			filterFiles( channelsPath ).filter(function (item) {
				return configObject.channels.indexOf(item) < 0;
			})
		);

		configObject.channels.forEach(function(channelName){
			var channelSubPath = channelsPath + channelName;
			if( fs.existsSync( channelSubPath + '/config/' + configType + '.json' ) ) {
				var json = fs.readFileSync( channelSubPath + '/config/' + configType + '.json', {enconding: 'utf8'} );
				configObject[configType + '.json'][appName].channels[channelName] = JSON.parse( json );
			}
		});
	};

	configObject = {
		channels: [],
		configTypes: [
			'application.json',
			'locale.json'
		],
		issues: {
			templateToChannels: [],
			channelsToTemplate: []
		},
		templates: {}
	};

	var applications = filterFiles(configRoot);

	// Load templates and configurations.
	applications.forEach(function(appName){
		['application', 'locale'].forEach(function(configType) {
			loadConfiguration(configType, appName);
		});
	});


	// *****************************************************************************************************************
	// TEST CODE, SHOULD BE REMOVED
	// *****************************************************************************************************************

	var checkConfiguration = function(appName, configType, channelName, direction, original, compared) {
		//console.warn(appName, configType, channelName, direction);
		Object.keys( original ).forEach(function(key){
			//console.warn(key);
			if ( original[ key] === null || compared[ key ] === null) {
				// Do nothing.
			}
			else if (
				compared[ key ] === undefined ||
				(typeof original[ key ] === 'object' && typeof compared[ key ] !== 'object') ||
				(
					['string', 'number', 'boolean'].indexOf(typeof original[ key ]) !== -1 &&
					['string', 'number', 'boolean'].indexOf(typeof compared[ key ]) === -1
				) ||
				( Array.isArray( original[ key] ) && !Array.isArray( compared[ key ] ))
			) {
				//console.warn(compared[ key ], original[ key], typeof compared[ key ], typeof original[ key]);
				// Issue.
				configObject.issues[ direction ].push({
					"appName": appName,
					"configType": configType,
					"channelName": channelName,
					"key": key
				});
			}
			else if (Array.isArray( original[ key] )) {
				// Do nothing.
			}
			else if (typeof original[ key ] === 'object') {
				// Subpath.
				checkConfiguration(appName, configType, channelName, direction, original[ key ], compared[ key ]);
			}
			else {
				// Do nothing.
			}
		});
	};

	// Check templates and configurations.
	applications.forEach(function(appName){
		['application', 'locale'].forEach(function(configType) {
			configObject.channels.forEach(function(channelName){
				if (configObject[configType + '.json'][appName].channels[channelName]) {
					var templateData = configObject.templates[appName][configType + '.json'];
					var channelData = configObject[configType + '.json'][appName].channels[channelName];
					checkConfiguration(appName, configType, channelName, 'templateToChannels', templateData, channelData);
					checkConfiguration(appName, configType, channelName, 'channelsToTemplate', channelData, templateData);
				}
			});
		});
	});
};


// this file has all the logic to read and write the configuration files
// it reads through the data directory to fill the configObject that is sent to the frontend
