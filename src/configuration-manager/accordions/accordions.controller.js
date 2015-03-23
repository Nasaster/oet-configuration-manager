var pubsub = require('oet-lib/pubsub');
var view = require('./accordions.view');

var Accordions = function(){};
Accordions.prototype.constructor = Accordions;
var accordions = module.exports = new Accordions();

Accordions.prototype.init = function(parent){
    this.$parent = parent;
    this.$wrapper = this.$parent.$DOM.accordionsSection;
    this.$config = parent.currentConfiguration;
    this.registerNotificationInterests();
    return view.init(this);
};

Accordions.prototype.currentConfigurationChanged = function(){
    pubsub.broadcast( 'current configuration changed' );
};


Accordions.prototype.registerNotificationInterests = function(){
    var interests = [
        'selected application changed'
    ];

    pubsub.subscribe(interests, notificationHandler.bind(this) );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'selected application changed':
            this.selectedApplication = payload.selectedApplication;
            view.changeSelectedApplication();
            break;
    }
};
