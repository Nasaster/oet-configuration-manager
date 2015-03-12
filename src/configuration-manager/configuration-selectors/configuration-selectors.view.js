var templator = require('oet-lib/templator');
var $scope;

var selectedApplicationLi = null;

var ConfigurationSelectorsView = function(){};
ConfigurationSelectorsView.prototype.constructor = ConfigurationSelectorsView;
var configurationSelectorsView = module.exports = new ConfigurationSelectorsView();

ConfigurationSelectorsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$config, $scope.$wrapper)
        .then(registerDOM)
        .then(registerBehaviour);
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationSelectorsView.prototype.render = function(config, wrapper){
    var data = {
        applications: config.applications,
        channels: Object.keys(config.channels)
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
    $scope.$DOM = {};
    $scope.$DOM.applicationMenuItems = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.application-select .menu-item') );
    $scope.$DOM.applicationMenuItemsList = $scope.$wrapper.querySelector('.application-select ul.dropdown-menu');

    console.log($scope.$DOM)
};

//we attach the events needed
var registerBehaviour = function(){
    $scope.$DOM.applicationMenuItemsList.addEventListener('click', function(ev){
        var clickedElement = ev.target;
        if( !clickedElement.classList.contains('menu-item') ){
            return;
        }

        selectedApplicationLi && selectedApplicationLi.classList.remove('active');
        selectedApplicationLi = clickedElement.parentNode;
        
        selectedApplicationLi.classList.add('active');
        $scope.broadcast('selected application changed', {
            selectedApplication: clickedElement.innerText
        });  
    });
};
