var Q = require('q');
var ajax = require('oet-lib/ajax');
var pubsub = require('oet-lib/pubsub');
var _ = require('lodash');

var $scope;


var Helper = module.exports = {
    init: function(controller){
        $scope = controller;
    },

    changePropertyValues: function(payload){
        var inputFields = payload.inputFields;
        var path = payload.path;
        var configToBeEdited = $scope.$parent.currentConfiguration['application.json'];
        configToBeEdited = configToBeEdited[$scope.$parent.selectedApplication].channels;


        inputFields.forEach(function(input){
            var channel = input.name;
            var property = configToBeEdited[input.name];
            for(var i = 0; i < path.length -1; i++){
                property = property[ path[i] ];
            }

            if( input.value !== 'true' && input.value !== 'false' ){
                property[ path[path.length -1] ] = input.value;
            } else {
                if( input.value === 'true' && input.checked ){
                    property[ path[path.length -1] ] = true;
                } else if( input.value === 'false' && input.checked ) {
                    property[ path[path.length -1] ] = false;
                }
            }
        });
    },

    deleteItemFromTemplate: function(payload){
        // if( !confirm('are you sure you want to delete ') ){
        //     return;
        // }
        var config = $scope.$parent.currentConfiguration.templates[$scope.$parent.selectedApplication][$scope.$parent.selectedConfigType];
        var path = payload.path.split(',');

        for( var i = 0; i < path.length; i++ ){
            if(i === path.length - 1 ){
                delete config[ path[i] ];
                break;
            }
            config = config[ path[i] ];
        }

        pubsub.broadcast( 'configuration updated' );
    },

    saveConfigToServer: function(){
        var selectedConfigType = $scope.$parent.selectedConfigType;
        var selectedApplication = $scope.$parent.selectedApplication;

        var origConfig = $scope.$parent.$config[selectedConfigType][selectedApplication];
        var currConfig = $scope.$parent.currentConfiguration[selectedConfigType][selectedApplication];

        var origTemplate = $scope.$parent.$config.templates[selectedApplication][selectedConfigType];
        var currTemplate = $scope.$parent.currentConfiguration.templates[selectedApplication][selectedConfigType];

        var promises = [];
        var payload = { 
            configToBeSaved:  currConfig,
            templateToBeSaved: currTemplate,
            selectedConfigType: selectedConfigType,
            selectedApplication: selectedApplication
        };
        if( !_.isEqual(origConfig, currConfig) ){
            promises.push( ajax.post('http://localhost:3001/save-configuration', payload) )
        }

        if( !_.isEqual(origTemplate, currTemplate) ){
            promises.push( ajax.post('http://localhost:3001/save-template', payload) )
        }        

        Q.all(promises)
            .then(
                function(res){
                    //[TODO] better error handling from the server
                    $scope.$parent.$config = $scope.$parent.currentConfiguration;
                    $scope.$parent.currentConfiguration = _.cloneDeep( $scope.$parent.$config );
                    pubsub.broadcast( 'configuration updated' );
                    //[TODO]: give better feedback to the user
                    alert('your configuration changes were successfully saved');
                }, 
                function(err){
                    console.error(err.stack);
                }
            );            
    }
};
