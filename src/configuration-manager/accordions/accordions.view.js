var templator = require('oet-lib/templator');
var formHelper = require('./form.helper');
var behaviour = require('./behaviour');

var $scope;

var AccordionsView = function(){};
AccordionsView.prototype.constructor = AccordionsView;
var accordionsView = module.exports = new AccordionsView();

AccordionsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    registerDOM();
    registerBehaviour();
    behaviour.init($scope);

};

AccordionsView.prototype.changeSelectedApplication = function(){
    //[TODO] this config should also take into account $scope.selectedConfigType
    var config = $scope.$config.templates[ $scope.$parent.selectedApplication.toLowerCase() ].application;

    templator.empty($scope.$DOM.configTree)
        .then( formHelper.buildFormTree.bind(formHelper, config) )
        .then( templator.inject.bind(templator, $scope.$DOM.configTree) )
        .then( afterChangeSelectedApplication );
};

var afterChangeSelectedApplication = function(){
    $scope.$DOM.groupItemLIs = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.group-item') );
};

var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.configTree = $scope.$wrapper.querySelector('.config-tree');
    $scope.$DOM.fieldEditModal = $scope.$wrapper.querySelector('.field-edit-modal .modal-dialog');
    $scope.$DOM.expandCollapse = $scope.$wrapper.querySelector('.expand-collapse-all');
};

var registerBehaviour = function(){
    $scope.$wrapper.addEventListener( 'click', behaviour.configTreeClickHandler );
    $scope.$DOM.expandCollapse.addEventListener( 'click', behaviour.expandCollapseClickHandler );
    $scope.$DOM.fieldEditModal.addEventListener( 'click', behaviour.fieldEditModalClickHandler );
};


