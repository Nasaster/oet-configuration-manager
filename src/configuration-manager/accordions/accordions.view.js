var templator = require('oet-lib/templator');
var formHelper = require('./form.helper');

var $scope;

var AccordionsView = function(){};
AccordionsView.prototype.constructor = AccordionsView;
var accordionsView = module.exports = new AccordionsView();

AccordionsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
};

AccordionsView.prototype.changeSelectedApplication = function(){
    var config = $scope.$config.templates[ $scope.selectedApplication.toLowerCase() ].application;
    config.selectedApplication = $scope.selectedApplication;

    templator.empty($scope.$wrapper)
        .then( formHelper.buildFormTree.bind(formHelper, config) )
        .then( templator.inject.bind(templator, $scope.$wrapper) );
};

var registerDOM = function(){
    this.$DOM = {};
    this.$DOM.fieldEditModal = $scope.$wrapper.querySelector('.field-edit-modal .modal-dialog');
    this.$DOM.fieldGroupContainers = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.group-form') );
    console.log(this.$DOM);
};

var registerBehaviour = function(){

};

