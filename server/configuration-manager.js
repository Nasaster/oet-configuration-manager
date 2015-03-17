var fs = require('fs');

module.exports = {
	getAllConfiguration: function(){
		return configObject;
	}
};

var configRoot = __dirname + '/../data/';
var configObject = {};

var applications = fs.readdirSync(configRoot);
applications.forEach(function(appName){
	configObject[appName] = { channels: {} };
	var channelsList = fs.readdirSync(configRoot + appName + '/channels');
	channelsList.forEach(function(channelName){
		configObject[appName].channels[channelName] = require(configRoot + appName + '/channels/' + channelName + '/config/application.json');
	});
});