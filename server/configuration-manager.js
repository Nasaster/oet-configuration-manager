var fs = require('fs');

module.exports = {
	getAllConfiguration: function(){
		return configObject;
	}
};

var configRoot = __dirname + '/../data/';
var configObject = {
	applications: {}
};

var applications = fs.readdirSync(configRoot);
applications.forEach(function(appName){
	configObject.applications[appName] = { channels: {} };
	configObject.channels = configObject.channels || fs.readdirSync(configRoot + appName + '/channels');
	configObject.channels.forEach(function(channelName){
		var channelPath = configRoot + appName + '/channels/' + channelName;
		if( fs.existsSync(channelPath) ) {
			configObject.applications[appName].channels[channelName] = require(channelPath + '/config/application.json');
		}
	});
});