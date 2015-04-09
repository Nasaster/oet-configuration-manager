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
        var fieldItems = payload.fieldItems;
        var path = payload.path;
        var configToBeEdited = $scope.$parent.currentConfiguration['application.json'];
        configToBeEdited = configToBeEdited[$scope.$parent.selectedApplication].channels;

        fieldItems.forEach(function(li){
            var channel = li.dataset.name;
            var property = configToBeEdited[channel];
            for(var i = 0; i < path.length -1; i++){
                property = property[ path[i] ];
            }
            var type = li.dataset.type;
            switch( type ){
                case 'Boolean':
                    var radios = Array.prototype.slice.call( li.querySelectorAll('input') );
                    radios.forEach(function(radio){
                        if(radio.checked){
                            property[ path[path.length -1] ] = radio.value === 'true'? true : false;
                        }
                    });
                    break;
                default:
                    var input = li.querySelector('input');
                    if( li.dataset.array === 'true' ){
                        var value = input.value.split(',');
                        if(type === 'Number'){
                            value = value.map(function(number){
                                return Number(number);
                            });    
                        }
                        property[ path[path.length -1] ] = value;
                    } else {
                        property[ path[path.length -1] ] = input.value;
                    }
                    break;
            }
        });
    },

    addPropertyToTemplate: function(payload){
        if ( !payload.fieldName ) {
            return;
        }

        var templateToBeEdited = $scope.$parent.currentConfiguration.templates[$scope.$parent.selectedApplication][$scope.$parent.selectedConfigType];
        var configToBeEdited = $scope.$parent.currentConfiguration[ $scope.$parent.selectedConfigType ][ $scope.$parent.selectedApplication ];

        var path = payload.path;
        templateToBeEdited = ( path[0] ? templateToBeEdited[ path[0] ] : templateToBeEdited );

        if(payload.isGroup){
            templateToBeEdited[ payload.fieldName ] = { 'delete me': 'String' };
            addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, '');
        } else {
            if(payload.isArray){
                templateToBeEdited[ payload.fieldName ] = [payload.fieldType];
                addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, []);
            } else {
                templateToBeEdited[ payload.fieldName ] = payload.fieldType;
                addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, null);
            }
        }

        pubsub.broadcast( 'configuration updated' );  
    },

    deleteItemFromTemplate: function(payload){
        // if( !confirm('are you sure you want to delete ') ){
        //     return;
        // }
        var template = $scope.$parent.currentConfiguration.templates[$scope.$parent.selectedApplication][$scope.$parent.selectedConfigType];
        var config = $scope.$parent.currentConfiguration[$scope.$parent.selectedConfigType][$scope.$parent.selectedApplication];
        var path = payload.path.split(',');

        for( var i = 0; i < path.length; i++ ){
            if(i === path.length - 1 ){
                delete template[ path[i] ];
                break;
            }
            template = template[ path[i] ];
        }
        deletePropertyFromEachChannel(config, path, payload.fieldName);

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

        // if( !_.isEqual(origTemplate, currTemplate) ){
            promises.push( ajax.post('http://localhost:3001/save-template', payload) )
        // }        

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
    }, 

    resetConfiguration: function(){
        $scope.$parent.currentConfiguration = _.cloneDeep( $scope.$parent.$config );
        pubsub.broadcast( 'configuration updated' );
    }
};

var addPropertyToEachChannel = function(configToBeEdited, path, fieldName, value){
    Object.keys( configToBeEdited.channels ).forEach(function(channel){
        var config = configToBeEdited.channels[channel];
        config = ( path[0] ? config[ path[0] ] : config );
        config[ fieldName ] = {};
    });
};

var deletePropertyFromEachChannel = function(configToBeEdited, path, fieldName){
    Object.keys( configToBeEdited.channels ).forEach(function(channel){
        var config = configToBeEdited.channels[channel];
        for(var i = 0; i < path.length; i++){
            if(i === path.length -1){
                delete config[ path[i] ];
                break;
            }
            config = config[ path[i] ];
        };
    });
};
