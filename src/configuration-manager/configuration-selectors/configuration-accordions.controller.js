var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-accordions.view');

var ConfigurationAccordions = function(){};
ConfigurationAccordions.prototype.constructor = ConfigurationAccordions;
var configurationAccordions = module.exports = new ConfigurationAccordions();

ConfigurationAccordions.prototype.init = function(config, wrapper){
	this.$config = config || {};
    this.$wrapper = wrapper || document.body;
    return view.init(this)
    	.then( function(){

    	});
};

ConfigurationAccordions.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};