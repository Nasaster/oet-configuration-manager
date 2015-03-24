var pubsub = require('oet-lib/pubsub');
var view = require('./accordions.view');

var Accordions = function(){};
Accordions.prototype.constructor = Accordions;
var accordions = module.exports = new Accordions();

Accordions.prototype.init = function(parent){
    this.$parent = parent;
    this.$wrapper = this.$parent.$DOM.accordionsSection;
    this.$config = parent.$config;
    this.registerNotificationInterests();
    return view.init(this);
};

Accordions.prototype.propertyChanged = function(path, inputFields){
    pubsub.broadcast( 'config property changed', {
        path: path,
        inputFields: inputFields
    } );
};


Accordions.prototype.registerNotificationInterests = function(){
    var interests = [
        'selected application changed',
        'selected config-type changed'
    ];

    pubsub.subscribe(interests, notificationHandler.bind(this) );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'selected application changed':
            this.$parent.selectedApplication = payload.selectedApplication;
            view.changeSelectedApplication();
            break;
        case 'selected config-type changed':
            this.$parent.selectedConfigType = payload.selectedConfigType;
            view.changeSelectedApplication();
            break;
    }
};
