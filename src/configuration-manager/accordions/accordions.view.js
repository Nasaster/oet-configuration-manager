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
    var config = $scope.$config.templates[ $scope.selectedApplication.toLowerCase() ].application;

    templator.empty($scope.$DOM.configTree)
        .then( formHelper.buildFormTree.bind(formHelper, config) )
        .then( templator.inject.bind(templator, $scope.$DOM.configTree) )
        .then( afterChangeSelectedApplication );
};

var afterChangeSelectedApplication = function(){
    $scope.$DOM.subGroupULs = Array.prototype.slice.call( $scope.$wrapper.querySelectorAll('.sub-group') );
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
};


var openFieldEditModal = function(group, field){
    


    // var locals = {
    //         group: group,
    //         field: field
    //     };
    //     locals.config = Object.keys($config).reduce(function(a, b){
    //        a[b] = $config[b][group][field];
    //        return a;
    //     }, {} );

    //     templator.empty( Accordions.$DOM.fieldEditModal )
    //         .then( templator.getTemplate.bind( null, 'views/configuration-manager/field-edit.modal.html' ) )
    //         //plugin all the recursive stuff
    //         .then( function(template){
    //             return templator.parse(template, locals);
    //         } )
    //         .then( function(html){
    //             return templator.inject(Accordions.$DOM.fieldEditModal, html);
    //         } )
    //         .then( function(){
    //             jQuery(Accordions.$DOM.fieldEditModal.parentNode).modal();
    //         }, function(err){ console.error(err.stack) });

};

