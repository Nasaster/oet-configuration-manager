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

ConfigurationProxy.prototype.registerNotificationInterests = function(){
    var interests = [
        'config property changed',
        'item deleted'
    ];

    pubsub.subscribe(interests, notificationHandler );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'config property changed':
            helper.changePropertyValues(payload);
            break;
        case 'item deleted': 
            helper.deleteItemFromTemplate(payload);
            break;
    }
};

