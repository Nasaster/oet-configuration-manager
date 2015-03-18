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
        .then( accordions.init.bind(accordions, this) )
        .then( this.selectApplication.bind(this, Object.keys(config.applications)[0]) );
};

//.then( $scope.selectApplication.bind($scope, Object.keys($scope.$config.applications)[0] ) );

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};

ConfigurationManager.prototype.selectApplication = function(selectedApplication){
    // change Accordions to the selectedApplication specific
    this.broadcast('selected application changed', {
        selectedApplication: selectedApplication
    });  
};
