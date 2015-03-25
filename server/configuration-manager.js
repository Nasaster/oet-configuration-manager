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
	}
};


var saveApplicationConfig = function(application, config){
	var baseDir = configRoot + application + '/channels/';

// 	console.log( config['albelli.be'] );


// return;
	Object.keys(config).forEach(function(channelName){
		var filePath = baseDir + channelName + '/config/application.json';
		var dataToBeSaved = JSON.stringify( config[channelName] );
		fs.writeFileSync( filePath, dataToBeSaved, {encoding: 'utf8'} );
	});
	setUpConfigurationObject();
};



function setUpConfigurationObject(someParam){console.log('setUpConfigurationObject');
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
		configObject.templates[appName].application = require(configRoot + appName + '.application.template.json');

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

	console.log('configObject recreated', 'stylepack', configObject['application.json'].Calendar.channels['albelli.be'].config.stylePack);
};
