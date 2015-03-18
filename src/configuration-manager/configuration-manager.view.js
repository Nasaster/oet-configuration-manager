var templator = require('oet-lib/templator');

var behaviour = require('./configuration-manager.behaviour.js');
var $scope;

var ConfigurationManagerView = function(){};
ConfigurationManagerView.prototype.constructor = ConfigurationManagerView;
var configurationManagerView = module.exports = new ConfigurationManagerView();

ConfigurationManagerView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$wrapper, $scope.$config)
        .then( registerDOM )
        .then( behaviour.registerBehaviour.bind(null, $scope) )
        .then( $scope.selectApplication.bind($scope, Object.keys($scope.$config.applications)[0] ) );
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationManagerView.prototype.render = function(wrapper, locals){
    //use the templator to render the html
    return templator.render('views/configuration-manager/main.html', locals, wrapper)
};




//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.selectorsSection = $scope.$wrapper.querySelector('.configuration-selectors');
    $scope.$DOM.accordionsSection = $scope.$wrapper.querySelector('.configuration-accordions');
    $scope.$DOM.applicationMenuItemsList = $scope.$wrapper.querySelector('.application-select ul.dropdown-menu');
};
