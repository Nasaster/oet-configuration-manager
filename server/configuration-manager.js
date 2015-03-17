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
	var channelsList = fs.readdirSync(configRoot + appName + '/channels');
	channelsList.forEach(function(channelName){
		configObject.applications[appName].channels[channelName] = require(configRoot + appName + '/channels/' + channelName + '/config/application.json');
	});
});