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
        switch(clickedElement.dataset.role){
            case 'reset':

                break;
            case 'save':

                break;
        }
    } );
};


