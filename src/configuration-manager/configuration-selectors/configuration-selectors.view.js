var templator = require('oet-lib/templator');
var $scope;

var selectedApplicationLi = null;
var selectedChannelLi = null;


var ConfigurationSelectorsView = function(){};
ConfigurationSelectorsView.prototype.constructor = ConfigurationSelectorsView;
var configurationSelectorsView = module.exports = new ConfigurationSelectorsView();

ConfigurationSelectorsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$config, $scope.$wrapper)
        .then( function()
            {
                registerDOM();
                addApplicationListener();
                addChannelListener();
            });
};

//we expose the render method because there may come the need for the controller to render it again
ConfigurationSelectorsView.prototype.render = function(config, wrapper){
    //use the templator to render the html
    return templator.render('views/configuration-manager/configuration-selectors.html', config, wrapper);
};

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.applicationMenuItems = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.application-select .menu-item') );
    $scope.$DOM.applicationMenuItemsList = $scope.$wrapper.querySelector('.application-select ul.dropdown-menu');
    $scope.$DOM.channelMenuItems = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.channel-select .menu-item') );
    $scope.$DOM.channelMenuItemsList = $scope.$wrapper.querySelector('.channel-select ul.dropdown-menu');
};

//we attach the events needed
var addApplicationListener = function()
{
    $scope.$DOM.applicationMenuItemsList.addEventListener('click', function(ev)
    {
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

var addChannelListener = function()
{
    $scope.$DOM.channelMenuItemsList.addEventListener('click', function(ev)
    {
        var clickedElement = ev.target;
        if( !clickedElement.classList.contains('menu-item') ){
            return;
        }
        
        selectedChannelLi && selectedChannelLi.classList.remove('active');
        selectedChannelLi = clickedElement.parentNode;
        
        selectedChannelLi.classList.add('active');
        $scope.broadcast('selected channel changed', {
            selectedChannel: clickedElement.dataset.app
        });  
    });
};
