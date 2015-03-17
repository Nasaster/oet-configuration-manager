var templator = require('oet-lib/templator');
var $scope;

var ConfigurationAccordionsView = function(){};
ConfigurationAccordionsView.prototype.constructor = ConfigurationAccordionsView;
var configurationAccordionsView = module.exports = new ConfigurationAccordionsView();

ConfigurationAccordionsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$config, $scope.$wrapper)
        // .then(registerDOM)
        // .then(registerEvents);
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationAccordionsView.prototype.render = function(config, wrapper){
    var data = {
        applications: $scope.$config.applications,
        channels: Object.keys($scope.$config.channels)
    };
    //use the templator to render the html
    return templator.render('views/configuration-manager/configuration-accordions.html', data, wrapper);
};

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    // $scope.$DOM = {};
    // $scope.$DOM.element = $scope.$wrapper.querySelector('.some-element');
};

//we attach the events needed
var registerEvents = function(){
    // $scope.$DOM.element.addEventListener('click', clickHandler);
};