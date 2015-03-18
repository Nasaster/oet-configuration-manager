var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var accordions = require('./accordions/accordions.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){
	this.$config = config || {};
    this.$wrapper = wrapper || document.body;
    return view.init(this)
        .then( function(){
            accordions.init(this, this.$DOM.accordionsSection);
        }.bind(this) );
};

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};


ConfigurationManager.prototype.selectApplication = function(selectedApplication){
    // change Accordions to the selectedApplication specific

    //view.selectApplication(selectedApplication);
    
    this.broadcast('selected application changed', {
        selectedApplication: selectedApplication
    });  
};