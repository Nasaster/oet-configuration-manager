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
        .then( function(){
            return renderSelector($scope.$DOM.selectorsSection, { applications: Object.keys($scope.$config) } )
        } )
        .then(registerBehaviour);
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationManagerView.prototype.render = function(wrapper, locals){
    //use the templator to render the html
    return templator.render('views/configuration-manager/main.html', locals, wrapper)
};

var renderSelector = function(wrapper, locals){
    return templator.render('views/configuration-manager/application-selector.html', locals, wrapper)
        .then(function(){
            $scope.$DOM.applicationMenuItemsList = $scope.$wrapper.querySelector('.application-select ul.dropdown-menu');
        })
}

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.selectorsSection = $scope.$wrapper.querySelector('.configuration-selectors');
    $scope.$DOM.accordionsSection = $scope.$wrapper.querySelector('.configuration-accordions');
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
            selectedApplication: clickedElement.dataset.application
        });  
    });
};