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
        var configToBeEdited = $scope.currentConfiguration['application.json'];
        configToBeEdited = configToBeEdited[$scope.$parent.selectedApplication].channels;


        inputFields.forEach(function(input){
            var channel = input.name;
            var property = configToBeEdited[input.name];
            for(var i = 0; i < path.length -1; i++){
                property = property[ path[i] ];
            }
            property[ path[path.length -1] ] = input.value;
        });
    },

    saveConfigToServer: function(){
        var selectedConfigType = $scope.$parent.selectedConfigType;
        var selectedApplication = $scope.$parent.selectedApplication;
        var payload = { 
            configToBeSaved:  $scope.currentConfiguration[selectedConfigType][selectedApplication],
            selectedConfigType: selectedConfigType,
            selectedApplication: selectedApplication
        };

        ajax.post('http://localhost:3001/save-configuration', payload)
            .then(
                function(res){ 
                    if(res === 'ok'){
                        $scope.$parent.$config = $scope.currentConfiguration;
                        $scope.currentConfiguration = _.cloneDeep( $scope.$parent.$config );
                        pubsub.broadcast( 'configuration updated' );
                        //[TODO]: give better feedback to the user
                        alert('your configuration changes were successfully saved');
                    }
                }, 
                function(err){
                    console.error(err.stack);
                }
            );
    }

}
