var fs = require('fs');

module.exports = {
	getAllConfiguration: function(){

		var configObject = {};
		
		var channelsPath = __dirname + '/../data/channels/';

		var allChannels = fs.readdirSync(channelsPath).filter(function(name){
	        return fs.statSync(channelsPath + name).isDirectory();
	    });

	    allChannels.forEach(function(name){
	    	configObject[name] = {};
	    	configObject[name].application = require(channelsPath + name + '/config/application.json');
	    });

	    return configObject;

	}
};

