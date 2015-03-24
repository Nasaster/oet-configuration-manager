var pubsub = require('oet-lib/pubsub');
var view = require('./configuration-manager.view');
var accordions = require('./accordions/accordions.controller');
var selectors = require('./selectors/selectors.controller');
var configurationProxy = require('./configuration-proxy/configuration-proxy.controller');

var ConfigurationManager = function(){};
ConfigurationManager.prototype.constructor = ConfigurationManager;
var configurationManager = module.exports = new ConfigurationManager();

ConfigurationManager.prototype.init = function(config, wrapper){
	this.$config = config || {}; console.log('AppConfig', config);

    this.$wrapper = wrapper || document.body;
    return view.init(this)
        .then( accordions.init.bind(accordions, this) )
        .then( selectors.init.bind(selectors, this) )
        .then( configurationProxy.init.bind(configurationProxy, this) );
};

ConfigurationManager.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};
