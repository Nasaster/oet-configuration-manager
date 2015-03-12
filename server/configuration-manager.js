var fs = require('fs');

module.exports = {
	getAllConfiguration: function(){

		var configObject = {
			applications: [
				'Calendar',
				'Walldecor',
				'Phonecase'
			], 
			channels: {}
		};
		
		var channelsPath = __dirname + '/../data/channels/';

		var allChannels = fs.readdirSync(channelsPath).filter(function(name){
	        return fs.statSync(channelsPath + name).isDirectory();
	    });

	    allChannels.forEach(function(name){
	    	configObject.channels[name] = {};
	    	configObject.channels[name].application = require(channelsPath + name + '/config/application.json');
	    });

	    return configObject;

	}
};

