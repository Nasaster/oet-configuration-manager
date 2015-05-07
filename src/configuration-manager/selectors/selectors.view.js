var templator = require('oet-lib/templator');

var $scope;

var SelectorsView = function(){};
SelectorsView.prototype.constructor = SelectorsView;
var selectorsView = module.exports = new SelectorsView();

SelectorsView.prototype.init = function(controller){
    $scope = controller;
    var selectedConfiguration = $scope.$parent.$config.selectedConfiguration;
    $scope.$parent.$config.applications = Object.keys($scope.$parent.$config[ selectedConfiguration ]);
    //returns the promise created in templator.render
    return this.render($scope.$parent.$DOM.selectorsSection)
        .then( registerDOM )
        .then( registerBehaviour );

};

SelectorsView.prototype.render = function(wrapper){
    return templator.render( 'views/configuration-manager/selectors.html', $scope.$parent.$config, wrapper );
};

var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.applicationSelect = $scope.$wrapper.querySelector('.application-select select');
    $scope.$DOM.configTypeSelect = $scope.$wrapper.querySelector('.config-type-select select');
};

var registerBehaviour = function(){
    $scope.$DOM.applicationSelect.addEventListener('change', function(ev){
        $scope.selectApplication(this.value);
    } );
    $scope.$DOM.configTypeSelect.addEventListener('change', function(ev){
        $scope.selectConfigType(this.value);
    } );
};


