var templator = require('oet-lib/templator');
var $scope;

var ConfigurationSelectorsView = function(){};
ConfigurationSelectorsView.prototype.constructor = ConfigurationSelectorsView;
var configurationSelectorsView = module.exports = new ConfigurationSelectorsView();

ConfigurationSelectorsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$wrapper)
        // .then(registerDOM)
        // .then(registerEvents);
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationSelectorsView.prototype.render = function(wrapper){
    var data = {
        applications: $scope.$config.applications,
        channels: Object.keys($scope.$config.channels)
    };
    console.log(data);
    //use the templator to render the html
    return templator.render('views/configuration-manager/configuration-selectors.html', data)
        .then(function(html){
            return templator.inject($scope.$wrapper, html);
        })
        // .then(templator.inject.bind(null, $scope.$wrapper));
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