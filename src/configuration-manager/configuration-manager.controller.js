var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var configurationSelectors = require('./configuration-selectors/configuration-selectors.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){
	this.$config = config || {};
    this.$wrapper = wrapper || document.body;


    return view.init(this)
    	.then( function(){
    		return configurationSelectors.init( this.$config, this.$DOM.selectorsSection );
    	}.bind(this) );
};

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};