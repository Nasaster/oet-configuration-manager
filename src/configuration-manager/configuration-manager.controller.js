var _ = require('lodash');
var ajax = require('oet-lib/ajax');
var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var accordions = require('./accordions/accordions.controller');
var selectors = require('./selectors/selectors.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){
	this.$config = config || {}; console.log(config);
    this.currentConfiguration = _.cloneDeep(this.$config);

    this.$wrapper = wrapper || document.body;
    return view.init(this)
        .then( accordions.init.bind(accordions, this) )
        .then( selectors.init.bind(selectors, this) )
        .then( this.registerNotificationInterests );
};

//.then( $scope.selectApplication.bind($scope, Object.keys($scope.$config.applications)[0] ) );

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};


ConfigurationManager.prototype.registerNotificationInterests = function(){
    var interests = [
        'current configuration changed'
    ];

    pubsub.subscribe(interests, notificationHandler );
};

var notificationHandler = function(message, payload){
    switch(message){
        case 'current configuration changed':
            // ajax.post('/save-configuration', configurationManager.currentConfiguration)
            //     .then(function(res){
            //         if(res === 'ok'){
            //             alert('your configuration changes were successfully saved');
            //             configurationManager.$config = configurationManager.currentConfiguration;
            //             this.currentConfiguration = _.cloneDeep(this.$config);
            //         }
            //     })
            break;
    }
};
