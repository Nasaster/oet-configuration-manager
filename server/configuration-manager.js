var fs = require('fs');

module.exports = {
	getAllConfiguration: function(){
		return configObject;
	}
};

var configRoot = __dirname + '/../data/';
var configObject = {
	templates: {
		calendar: {
			// application: sjdsdlf
		}
	},
	applications: {}
};

var applications = fs.readdirSync(configRoot).filter(function(fileName){
	var stats = fs.statSync(configRoot + fileName);
	return stats.isDirectory();
});

applications.forEach(function(appName){
	var lcName = appName.toLowerCase();
	configObject.templates[lcName] = {};
	configObject.templates[lcName].application = require(configRoot + lcName + '.application.template.json');

	configObject.applications[appName] = { channels: {} };
	configObject.channels = configObject.channels || fs.readdirSync(configRoot + appName + '/channels');
	configObject.channels.forEach(function(channelName){
		var channelPath = configRoot + appName + '/channels/' + channelName;
		if( fs.existsSync(channelPath) ) {
			configObject.applications[appName].channels[channelName] = require(channelPath + '/config/application.json');
		}
	});
});
