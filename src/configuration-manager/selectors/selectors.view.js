var templator = require('oet-lib/templator');

var $scope;

var SelectorsView = function(){};
SelectorsView.prototype.constructor = SelectorsView;
var selectorsView = module.exports = new SelectorsView();

SelectorsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$parent.$DOM.selectorsSection)
        .then( registerDOM )
        .then( registerBehaviour );

};

SelectorsView.prototype.render = function(wrapper){
    return templator.render( 'views/configuration-manager/selectors.html', $scope.$config, wrapper );
};

var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.applicationSelect = $scope.$wrapper.querySelector('.application-select select');
    console.log($scope.$DOM);
};

var registerBehaviour = function(){
    $scope.$DOM.applicationSelect.addEventListener('change', function(ev){
        $scope.selectApplication(this.value);
    } );
};


