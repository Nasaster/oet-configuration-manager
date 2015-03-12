var templator = require('oet-lib/templator');
var $scope;

var ConfigurationManagerView = function(){};
ConfigurationManagerView.prototype.constructor = ConfigurationManagerView;
var configurationManagerView = module.exports = new ConfigurationManagerView();

ConfigurationManagerView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$wrapper)
        .then(registerDOM)
        // .then(registerEvents);
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationManagerView.prototype.render = function(wrapper, data){
    //use the templator to render the html
    return templator.render('views/configuration-manager/main.html', data)
        .then( templator.inject.bind(null, $scope.$wrapper) );
};

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.selectorsSection = $scope.$wrapper.querySelector('.configuration-selectors');
    //$scope.$DOM.selectorsSection = $scope.$wrapper.querySelector('.configuration-accordions');
};

//we attach the events needed
var registerEvents = function(){
    // $scope.$DOM.element.addEventListener('click', clickHandler);
};