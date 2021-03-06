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
    var config = $scope.$parent.currentConfiguration.templates[ $scope.$parent.selectedApplication ][ $scope.$parent.selectedConfigType ];

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
    $scope.$DOM.fieldEditModal = document.body.querySelector('.field-edit-modal .modal-dialog');
    $scope.$DOM.expandCollapse = $scope.$wrapper.querySelector('.expand-collapse-all');
};

var registerBehaviour = function(){
    $scope.$wrapper.addEventListener( 'click', behaviour.configTreeClickHandler );
    $scope.$DOM.expandCollapse.addEventListener( 'click', behaviour.expandCollapseClickHandler );
    $scope.$DOM.fieldEditModal.addEventListener( 'click', behaviour.fieldEditModalClickHandler );
};

/*
Sub-module to manage the accordions view
- read configuration-manager.view comments at the end 
*/

