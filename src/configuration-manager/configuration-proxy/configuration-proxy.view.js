var templator = require('oet-lib/templator');

var $scope;

var ConfigurationProxyView = function(){};
ConfigurationProxyView.prototype.constructor = ConfigurationProxyView;
var configurationProxyView = module.exports = new ConfigurationProxyView();

ConfigurationProxyView.prototype.init = function(controller){
    $scope = controller;
    registerDOM();
    registerBehaviour();
};

var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.saveResetSection = document.getElementById('save-reset-controls');
};

var registerBehaviour = function(){
    $scope.$DOM.saveResetSection.addEventListener('click', function(ev){
        var clickedElement = ev.target;
        //[TODO] better feedback to the user before resetting or saving
        switch(clickedElement.dataset.role){
            case 'reset':
                //if( confirm('Are you sure you want to reset your changes?') ){
                    $scope.resetConfiguration();
                //}
                break;
            case 'save':
                //if( confirm('Are you sure you want to save the configuration?') ){
                    $scope.saveConfiguration();
                //}
                break;
        }
    } );
};


/*
Sub-module to manage the configuration-proxy view
- read configuration-manager.view comments at the end 
*/
