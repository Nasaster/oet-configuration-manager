var _ = require('lodash');
var pubsub = require('oet-lib/pubsub');
var ajax = require('oet-lib/ajax'); 
var view = require('./configuration-proxy.view');

var ConfigurationProxy = function(){};
ConfigurationProxy.prototype.constructor = ConfigurationProxy;
var configurationProxy = module.exports = new ConfigurationProxy();

ConfigurationProxy.prototype.init = function(parent){
    this.$parent = parent;
    this.$config = parent.$config;
    window.current = this.currentConfiguration = _.cloneDeep(this.$config);
    this.registerNotificationInterests();
    return view.init(this);
};

ConfigurationProxy.prototype.registerNotificationInterests = function(){
    var interests = [
        'config property changed'
    ];

    pubsub.subscribe(interests, notificationHandler );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'config property changed':
            changePropertyValues(payload);
            break;
    }
};

var changePropertyValues = function(payload){
    var inputFields = payload.inputFields;
    var path = payload.path;
    var configToBeEdited = configurationProxy.currentConfiguration.applications;
    configToBeEdited = configToBeEdited[configurationProxy.$parent.selectedApplication].channels;


    inputFields.forEach(function(input){
        var channel = input.name;
        var property = configToBeEdited[input.name];
        for(var i = 0; i < path.length -1; i++){
            property = property[ path[i] ];
        }
        property[ path[path.length -1] ] = input.value;
    });
}

var saveConfigToServer = function(){return;
    var payload = { config: configurationProxy.$parent.currentConfiguration };
    ajax.post('http://localhost:3001/save-configuration', payload)
        .then(
            function(res){ 
                if(res === 'ok'){
                    configurationManager.$config = configurationManager.currentConfiguration;
                    this.currentConfiguration = _.cloneDeep(this.$config);
                    //[TODO]: give better feedback to the user
                    alert('your configuration changes were successfully saved');
                }
            }, 
            function(err){
                console.error(err.stack);
            }
        );
}
