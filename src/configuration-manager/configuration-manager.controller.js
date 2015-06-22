var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var accordions = require('./accordions/accordions.controller');
var selectors = require('./selectors/selectors.controller');
var configurationProxy = require('./configuration-proxy/configuration-proxy.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){
	this.$config = config || {};
	this.$config.selectedConfiguration = config.configTypes[0];
	console.log('AppConfig', config);

    this.$wrapper = wrapper || document.body;
    return view.init(this)
        .then( configurationProxy.init.bind(configurationProxy, this) )
        .then( accordions.init.bind(accordions, this) )
        .then( selectors.init.bind(selectors, this) );
};

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};


/**
This file is where it all starts.
This is the main controller for the application, 
it gets and parses the configuration from the backend
checks if the user is logged in and initializes the correct route
it uses pubsub to send and receive messages to its components
it initializes and sends a reference of itself to its view
it initializes the controllers for the sub-modules like configuration-proxy, selectors and accordion
**/
