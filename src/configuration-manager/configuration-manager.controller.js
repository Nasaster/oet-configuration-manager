var _ = require('lodash');
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
        .then( selectors.init.bind(selectors, this) );
};

//.then( $scope.selectApplication.bind($scope, Object.keys($scope.$config.applications)[0] ) );

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};
