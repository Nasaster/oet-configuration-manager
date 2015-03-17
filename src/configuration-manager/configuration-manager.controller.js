var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var configurationSelectors = require('./configuration-selectors/configuration-selectors.controller');
var configurationAccordions = require('./configuration-accordions/configuration-accordions.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){console.log(config);
	this.$config = config || {};
    this.$wrapper = wrapper || document.body;


    return view.init(this)
    	.then( function(){
    		// initialize selectors
    		return configurationSelectors.init( { applications: Object.keys(this.$config) } , this.$DOM.selectorsSection );
    	}.bind(this) )
    	.then( function(){
    		// initialize accordions
    		return configurationAccordions.init( { channels: this.$config.channels }, this.$DOM.accordionsSection );
    	}.bind( this ));
};

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};