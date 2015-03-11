var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-selectors.view');

var ConfigurationSelectors = function(){};
ConfigurationSelectors.prototype.constructor = ConfigurationSelectors;
var configurationSelectors = module.exports = new ConfigurationSelectors();

ConfigurationSelectors.prototype.init = function(config, wrapper){
	this.$config = config || {};
    this.$wrapper = wrapper || document.body;
    return view.init(this)
    	.then( function(){

    	});
};

ConfigurationSelectors.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};