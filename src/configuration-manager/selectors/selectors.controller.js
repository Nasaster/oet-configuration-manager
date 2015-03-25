var pubsub = require('oet-lib/pubsub');
var view = require('./selectors.view');

var Selectors = function(){};
Selectors.prototype.constructor = Selectors;
var selectors = module.exports = new Selectors();

Selectors.prototype.init = function(parent){
    this.$parent = parent;
    this.$wrapper = this.$parent.$DOM.selectorsSection;
    this.$config = parent.$config;
    return view.init(this)
        .then( this.selectApplication.bind(null, Object.keys(this.$config["application.json"])[0]) )
        .then( this.selectConfigType.bind(null, this.$config.configTypes[0] ) );
};

Selectors.prototype.selectApplication = function(selectedApplication){
    // change Accordions to the selectedApplication specific
    pubsub.broadcast('selected application changed', {
        selectedApplication: selectedApplication
    });  
};

Selectors.prototype.selectConfigType = function(selectedConfigType){
    // change Accordions to the selectedApplication specific
    pubsub.broadcast('selected config-type changed', {
        selectedConfigType: selectedConfigType
    });  
};
