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
        var selectedConfiguration = $scope.$parent.selectedConfigType;
        var allConfiguration = $scope.$parent.currentConfiguration[ selectedConfiguration ];
        var selectedApplication = $scope.$parent.selectedApplication;
        var configToBeEdited = allConfiguration[ selectedApplication ].channels;

        fieldItems.forEach(function(li){
            var channel = li.dataset.name;
            var property = configToBeEdited[channel];
            for(var i = 0; i < path.length - 1; i++){
                property = property[ path[i] ];
            }
            var type = li.dataset.type;
            var currentElement = path[path.length -1];
            switch( type ) {
                case 'Boolean':
                    if( li.dataset.array === 'true' ){
                        var input = li.querySelector('input');
                        var value = input.value.split(',');
                        value = value.map(function(myBoolean){
                            return ( myBoolean === 'true' );
                        });
                        property[ currentElement ] = value;
                    } else {
                        var radios = Array.prototype.slice.call( li.querySelectorAll('input') );
                        radios.forEach(function(radio){
                            if (radio.checked){
                                property[ currentElement ] = ( radio.value === 'true' );
                            }
                        });
                    }
                    break;
                case 'Number':
                    var input = li.querySelector('input');
                    if( li.dataset.array === 'true' ){
                        var value = input.value.split(',');
                        value = value.map(function(number){
                            return Number(number);
                        });
                        property[ currentElement ] = value;
                    } else {
                        property[ currentElement ] = Number( input.value );
                    }
                    break;
                case 'String':
                default:
                    var input = li.querySelector('input');
                    if( li.dataset.array === 'true' ){
                        var value = input.value.split(',');
                        property[ currentElement ] = value;
                    } else {
                        property[ currentElement ] = input.value;
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

        var i = 0;
        while (path[i] && templateToBeEdited[ path[i] ]) {
            templateToBeEdited = templateToBeEdited[ path[i] ];
            i++;
        }

        // Adding group type
        if(payload.isGroup){
            templateToBeEdited[ payload.fieldName ] = {};
            addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, {});
        } else {
            // Adding array
            if(payload.isArray){
                templateToBeEdited[ payload.fieldName ] = [payload.fieldType];
                addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, []);
            } else {
                templateToBeEdited[ payload.fieldName ] = payload.fieldType;
                // Adding number
                if (payload.fieldType === 'Number') {
                    addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, 0);
                }
                // Adding string
                if (payload.fieldType === 'String') {
                    addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, '');
                }
                // Adding boolean
                if (payload.fieldType === 'Boolean') {
                    addPropertyToEachChannel(configToBeEdited, path, payload.fieldName, true);
                }
            }
        }

        pubsub.broadcast( 'configuration updated' );  
    },

    renameItemFromTemplate: function(payload){
        if ( !payload.fieldName || !payload.fieldNameOriginal || payload.fieldName === payload.fieldNameOriginal ) {
            return;
        }

        var templateToBeEdited = $scope.$parent.currentConfiguration.templates[$scope.$parent.selectedApplication][$scope.$parent.selectedConfigType];
        var configToBeEdited = $scope.$parent.currentConfiguration[ $scope.$parent.selectedConfigType ][ $scope.$parent.selectedApplication ];

        var path = payload.path;

        var i = 0;
        while (path[i] && path[ i + 1 ] && templateToBeEdited[ path[i] ]) {
            templateToBeEdited = templateToBeEdited[ path[i] ];
            i++;
        }

        if (templateToBeEdited[ payload.fieldName ]) {
            alert("The name already exists!");
            return;
        }

        templateToBeEdited[ payload.fieldName ] = templateToBeEdited[ payload.fieldNameOriginal ];
        delete( templateToBeEdited[ payload.fieldNameOriginal ] );
        renamePropertyToEachChannel(configToBeEdited, path, payload.fieldName, payload.fieldNameOriginal);

        pubsub.broadcast( 'configuration updated' );
    },

    deleteItemFromTemplate: function(payload){
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

var renamePropertyToEachChannel = function(configToBeEdited, path, fieldName, fieldNameOriginal){
    Object.keys( configToBeEdited.channels ).forEach(function(channel){
        var config = configToBeEdited.channels[channel];

        var i = 0;
        while (path[i] && path[ i + 1 ] && config[ path[i] ]) {
            config = config[ path[i] ];
            i++;
        }

        config[ fieldName ] = config[ fieldNameOriginal ];
        delete( config[ fieldNameOriginal ] );
    });
};

var addPropertyToEachChannel = function(configToBeEdited, path, fieldName, value){
    Object.keys( configToBeEdited.channels ).forEach(function(channel){
        var config = configToBeEdited.channels[channel];
        
        var i = 0;
        while (path[i] && config[ path[i] ]) {
            config = config[ path[i] ];
            i++;
        }

        config[ fieldName ] = value;
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
