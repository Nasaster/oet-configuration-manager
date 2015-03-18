var templator = require('oet-lib/templator');

// var behaviour = require('./configuration-manager.behaviour.js');
var $scope;

var AccordionsView = function(){};
AccordionsView.prototype.constructor = AccordionsView;
var accordionsView = module.exports = new AccordionsView();

AccordionsView.prototype.init = function(controller){
    $scope = controller;  console.log('$scope', $scope)
    //returns the promise created in templator.render
    return this.render($scope.$wrapper, $scope.$config)
        .then( registerDOM.bind(this) )
        .then( behaviour.registerBehaviour.bind(null, $scope) )
        .then( $scope.selectApplication.bind($scope, Object.keys($scope.$config.applications)[0] ) );
};


AccordionsView.prototype.render = function(wrapper, config){
    var locals = {
        // we get this so we get a structure that will be the same for any channel
        configuration: config.applications[ Object.keys(config.applications)[0] ], 
        channels: config.channels
    };
    templator.render('views/configuration-manager/accordions.template.html', locals, $scope.$wrapper)
        .then( registerDOM )
        .then( registerBehaviour )
        .then(
            function(){},
            function(err){console.error(err.stack); }
        );
};


AccordionsView.prototype.selectApplication = function(selectedApplication){
    Array.prototype.slice.call($scope.$DOM.applicationMenuItemsList.children).forEach( function(li){
        li.classList.remove('active');
        if(li.dataset.application === selectedApplication){
            li.classList.add('active');
        }
    });

    //[TODO] change the accordions to the selected Application
    templator.empty($scope.$DOM.accordionsSection)
        //.then( accordions.render.bind(null, $scope.$config.applications[selectedApplication].channels) )
};

var registerDOM = function(){
    this.$DOM = {};
    this.$DOM.fieldEditModal = $scope.$wrapper.querySelector('.field-edit-modal .modal-dialog');
    this.$DOM.fieldGroupContainers = Array.prototype.slice( $scope.$wrapper.querySelectorAll('.group-form') );
};