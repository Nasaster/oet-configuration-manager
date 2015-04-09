var templator = require('oet-lib/templator');

var $scope;

var ConfigurationManagerView = function(){};
ConfigurationManagerView.prototype.constructor = ConfigurationManagerView;
var configurationManagerView = module.exports = new ConfigurationManagerView();

ConfigurationManagerView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$wrapper, $scope.$config)
        .then( registerDOM )
        .then( registerBehaviour );
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationManagerView.prototype.render = function(wrapper, locals){
    //use the templator to render the html
    return templator.render('views/configuration-manager/main.html', locals, wrapper);
};

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.selectorsSection = $scope.$wrapper.querySelector('.configuration-selectors');
    $scope.$DOM.accordionsSection = $scope.$wrapper.querySelector('.configuration-accordions');
};

var registerBehaviour = function(){
    
}

/**
This is the view for the main application controller.
- it uses templator to render the main view
- gains total access to the controller through the $scope object
- caches all the relevant DOM elements, for later usage
- registers the desired behaviour on each of those elements 
**/
