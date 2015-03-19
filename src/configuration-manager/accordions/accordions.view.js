var templator = require('oet-lib/templator');
var formHelper = require('./form.helper');

var $scope;

var AccordionsView = function(){};
AccordionsView.prototype.constructor = AccordionsView;
var accordionsView = module.exports = new AccordionsView();

AccordionsView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    registerDOM();
    registerBehaviour();
};

AccordionsView.prototype.changeSelectedApplication = function(){
    var config = $scope.$config.templates[ $scope.selectedApplication.toLowerCase() ].application;

    templator.empty($scope.$wrapper)
        .then( formHelper.buildFormTree.bind(formHelper, config) )
        .then( templator.inject.bind(templator, $scope.$wrapper) );
};

var registerDOM = function(){
    this.$DOM = {};
    this.$DOM.fieldEditModal = $scope.$wrapper.querySelector('.field-edit-modal .modal-dialog');
    
    console.log(this.$DOM);
};

var registerBehaviour = function(){
    $scope.$wrapper.addEventListener('click', function(ev){
        var clickedElement = ev.target;
        switch(clickedElement.dataset.role){
            case 'toggle-sub-group':
                ev.preventDefault();
                var ancestorLI = clickedElement.parentNode.parentNode;
                var wasClosed = ancestorLI.classList.contains('closed');
                ancestorLI.classList[ wasClosed? 'remove' : 'add' ]('closed');
                ancestorLI.querySelector('i.action-open').classList[ wasClosed? 'add' : 'remove' ]('hidden');
                ancestorLI.querySelector('i.action-close').classList[ wasClosed? 'remove' : 'add' ]('hidden');
                break;
        }
    });
};

