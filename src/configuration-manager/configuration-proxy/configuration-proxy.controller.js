var _ = require('lodash');
var pubsub = require('oet-lib/pubsub');
var ajax = require('oet-lib/ajax'); 
var view = require('./configuration-proxy.view');
var helper = require('./configuration-proxy.helper');

var ConfigurationProxy = function(){};
ConfigurationProxy.prototype.constructor = ConfigurationProxy;
var configurationProxy = module.exports = new ConfigurationProxy();

ConfigurationProxy.prototype.init = function(parent){
    this.$parent = parent;
    this.$config = parent.$config;
    this.$parent.currentConfiguration = _.cloneDeep(this.$config);
    this.registerNotificationInterests();
    helper.init(this);
    return view.init(this);
};

ConfigurationProxy.prototype.saveConfiguration = function(){
    helper.saveConfigToServer();
};

ConfigurationProxy.prototype.resetConfiguration = function(){
    helper.resetConfiguration();
};

ConfigurationProxy.prototype.registerNotificationInterests = function(){
    var interests = [
        'config property changed',
        'template property added',
        'item deleted',
        'item renamed'
    ];

    pubsub.subscribe(interests, notificationHandler );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'config property changed':
            helper.changePropertyValues(payload);
            break;
        case 'template property added':
            helper.addPropertyToTemplate(payload);
            break;
        case 'item deleted':
            helper.deleteItemFromTemplate(payload);
            break;
        case 'item renamed':
            helper.renameItemFromTemplate(payload);
            break;
    }
};

/*
Sub-module to manage the save and load of the configuration
- read configuration-controller comments at the end 
*/

