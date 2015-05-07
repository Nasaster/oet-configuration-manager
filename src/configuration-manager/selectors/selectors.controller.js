var pubsub = require('oet-lib/pubsub');
var view = require('./selectors.view');

var Selectors = function(){};
Selectors.prototype.constructor = Selectors;
var selectors = module.exports = new Selectors();

Selectors.prototype.init = function(parent){
    this.$parent = parent;
    this.$wrapper = this.$parent.$DOM.selectorsSection;
    var selectedConfiguration = this.$parent.$config.selectedConfiguration;
    return view.init(this)
        .then( this.selectApplication.bind(null, Object.keys(this.$parent.$config[ selectedConfiguration ])[0]) )
        .then( this.selectConfigType.bind(null, this.$parent.$config.configTypes[0] ) );
};

Selectors.prototype.selectApplication = function(selectedApplication){
    pubsub.broadcast('selected application changed', {
        selectedApplication: selectedApplication
    });  
};

Selectors.prototype.selectConfigType = function(selectedConfigType){
    pubsub.broadcast('selected config-type changed', {
        selectedConfigType: selectedConfigType
    });  
};

/*
Sub-module to manage the selectors
- read configuration-controller comments at the end 
*/
