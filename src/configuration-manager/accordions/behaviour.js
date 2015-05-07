var templator = require('oet-lib/templator');

var $scope;

var Behaviour = module.exports = {
    init: function(scope){
        $scope = scope;
    },

    configTreeClickHandler: function(ev, isCollapsingAll){
        ev.preventDefault && ev.preventDefault();
        var clickedElement = ev.nodeName? ev : ev.target;

        switch(clickedElement.dataset.role){
            case 'toggle-sub-group':
                toggleSubgroup(clickedElement, ev, isCollapsingAll);
                break;
            case 'edit-item':
                openFieldEditModal( clickedElement.dataset.path );
                break;
            case 'add-item':
                openAddItemModal(clickedElement);
                break;
            case 'delete-item':
                openDeleteItemModal(clickedElement);
                break;
            case 'rename-item':
                openRenameItemModal(clickedElement);
                break;
        }
    },

    expandCollapseClickHandler: function(ev){
        var method;
        var clickedElement = ev.target;
        var action = clickedElement.dataset.role;
        var isCollapsingAll;

        switch(action){
            case 'collapse-all':
                isCollapsingAll = true;
                clickedElement.parentNode.nextElementSibling.classList.remove('hidden');
                break;
            case 'expand-all': 
                clickedElement.parentNode.previousElementSibling.classList.remove('hidden');
                break;
        }
        clickedElement.parentNode.classList.add('hidden');

        $scope.$DOM.groupItemLIs.forEach(function(li){
            var togglerAnchor = li.querySelector('label a');
            Behaviour.configTreeClickHandler.call(null, togglerAnchor, isCollapsingAll );
        });
    },

    fieldEditModalClickHandler: function(ev){
        var clickedElement = ev.target;
        var form = document.getElementById('configuration-property-form');
        var path = form.name.split(',');
        switch(clickedElement.dataset.role){
            case 'update-value':
                var fieldItems = Array.prototype.slice.call( form.querySelectorAll('.field-item') );
                var error = [];
                
                fieldItems.forEach(function(li){
                    var type = li.dataset.type;
                    var currentElement = path[path.length -1];
                    switch( type ) {
                        case 'Boolean':
                            if( li.dataset.array === 'true' ){
                                var input = li.querySelector('input');
                                var value = input.value.split(',');
                                value = value.map(function(myBoolean){
                                    var myBooleanLowerCase = myBoolean.toLowerCase();
                                    if ( ['true', 'false'].indexOf( myBooleanLowerCase ) === -1 ) {
                                        error.push( myBoolean + ' is not a boolean' );
                                    }
                                    return myBooleanLowerCase;
                                });
                                input.value = value.join(',');
                            }
                            else {
                                var radios = Array.prototype.slice.call( li.querySelectorAll('input') );
                                radios.forEach(function(radio){
                                    // We can check the value here.
                                    //if (radio.checked){
                                        // property[ currentElement ] = ( radio.value === 'true' );
                                    //}
                                });
                            }
                            break;
                        case 'Number':
                            var input = li.querySelector('input');
                            if( li.dataset.array === 'true' ){
                                var value = input.value.split(',');
                                value = value.map(function(number){
                                    if ( isNaN( number ) ) {
                                        error.push( number + ' is not a number' );
                                    }
                                    else if (number === "") {
                                        error.push( 'field can not be empty' );
                                    }
                                    return number;
                                });
                            } else {
                                if ( isNaN( input.value ) ) {
                                    error.push( input.value + ' is not a number' );
                                }
                                else if (input.value === "") {
                                    error.push( 'field can not be empty' );
                                }
                            }
                            break;
                        case 'String':
                        default:
                            var input = li.querySelector('input');
                            if( li.dataset.array === 'true' ){
                                var value = input.value.split(',');
                                // if Array is only one in length, it hasn't found a comma separator inside the value of input
                                // if ( value.length === 1 ) {
                                //     // if the Array contents are 0 characters in length, there is no input!!
                                //     if ( value[0].length === 0 ) {
                                //         error.push( 'field cannot be empty' );
                                //     }
                                //     else {
                                //         error.push( 'field contains a single value, must be Array' );
                                //     }
                                // }
                             } else {
                                // if ( input.value.length === 0 ) {
                                //     error.push( 'field cannot be empty');
                                // }
                            }
                            break;
                    }
                });

                if ( error.length > 0 ) {
                    alert( 'Errors: ' + error.join('; ') );
                }
                else {
                    jQuery($scope.$DOM.fieldEditModal.parentNode).modal("hide");
                    $scope.propertyChanged(path, fieldItems);
                }
                break;
            case 'update-template':
                var groupRadio = form.querySelector('input[name=group-or-primitive]:checked');
                var isArrayRadio = form.querySelector('input[name=is-array]:checked');
                var fieldTypeRadio = form.querySelector('input[name=field-type]:checked');
                var fieldNameInput = form.querySelector('input[name=field-name]');
                //[TODO] add validation to the form
                if ( fieldNameInput.value ) {

                    var payload = {
                        path: path,
                        isGroup: groupRadio.value === 'group'? true: false,
                        isArray: isArrayRadio.value === 'yes'? true: false,
                        fieldType: fieldTypeRadio.value,
                        fieldName: fieldNameInput.value
                    };
                    $scope.addItemToTemplate(payload);
                    jQuery($scope.$DOM.fieldEditModal.parentNode).modal("hide");

                }
                else {

                    alert("Please fill in the field/group name");

                }
                
                break;
            case 'delete-template':
                $scope.broadcast( 'item deleted', {
                    path: path.join(',')
                } );
                break;
            case 'rename-template':
                var fieldNameInput = form.querySelector('input[name=field-name]');
                var fieldNameOriginalInput = form.querySelector('input[name=field-name-original]');
                if ( fieldNameInput.value && fieldNameOriginalInput.value ) {
                    $scope.broadcast( 'item renamed', {
                        path: path,
                        fieldName: fieldNameInput.value,
                        fieldNameOriginal: fieldNameOriginalInput.value
                    } );
                }
                else {
                    alert("Please fill in the field/group name");
                }
                break;

        }
    }
};

var openRenameItemModal = function(clickedElement){
    var url = 'views/configuration-manager/rename-item.modal.html';
    var locals = {
        path: clickedElement.dataset.path.split(',')
    }
    templator.empty( $scope.$DOM.fieldEditModal )
        .then( templator.render.bind( templator, url, locals, $scope.$DOM.fieldEditModal ) )
        .then( function(){
            jQuery($scope.$DOM.fieldEditModal.parentNode).modal();
        });
};

var openDeleteItemModal = function(clickedElement){
    var url = 'views/configuration-manager/delete-item.modal.html';
    var locals = {
        path: clickedElement.dataset.path.split(',')
    }
    templator.empty( $scope.$DOM.fieldEditModal )
        .then( templator.render.bind( templator, url, locals, $scope.$DOM.fieldEditModal ) )
        .then( function(){
            jQuery($scope.$DOM.fieldEditModal.parentNode).modal();
        });
};
 
var openAddItemModal = function(clickedElement){
    var url = 'views/configuration-manager/add-item.modal.html';
    var locals = {
        path: clickedElement.dataset.path.split(',')
    }
    templator.empty( $scope.$DOM.fieldEditModal )
        .then( templator.render.bind( templator, url, locals, $scope.$DOM.fieldEditModal ) )
        .then( function(){
            jQuery($scope.$DOM.fieldEditModal.parentNode).modal();
        });
};


var openFieldEditModal = function(path){
    
    path = path.split(',');
    var locals = {
        path: path
    };

    var selectedConfiguration = $scope.$parent.$config.selectedConfiguration;
    var config = $scope.$parent.currentConfiguration[ selectedConfiguration ][ $scope.$parent.selectedApplication ].channels;
    var type = $scope.$parent.currentConfiguration.templates[ $scope.$parent.selectedApplication ][ selectedConfiguration ];

    for(var i = 0; i < path.length; i++){
        type = type[ path[i] ];
    }
    locals.type = type;
    locals.isArray = Array.isArray(type);

    //extracts the configuration for the item for every channel
    locals.config = Object.keys(config).reduce(function(a, b){
        var value = config[b];
        for(var i = 0, len = path.length; i < len; i++){
            value = value[ path[i] ];
        }
        a[ b ] = ( !isNaN( value ) && type === 'Number' ? value.toString() : value );
        return a;
    }, {} );

    templator.empty( $scope.$DOM.fieldEditModal )
        .then( templator.getTemplate.bind( null, 'views/configuration-manager/field-edit.modal.html' ) )
        //plugin all the recursive stuff
        .then( function(template){
            return templator.parse(template, locals);
        } )
        .then( function(html){
            return templator.inject($scope.$DOM.fieldEditModal, html);
        } )
        .then( function(){
            jQuery($scope.$DOM.fieldEditModal.parentNode).modal();
        }, function(err){ console.error(err.stack) });

};

var toggleSubgroup = function(clickedElement, ev, isCollapsingAll){
    var action, wasOpen;
    var ancestorLI = clickedElement.parentNode.parentNode;
    var openAnchor = ancestorLI.querySelector('i.action-open');
    var closeAnchor = ancestorLI.querySelector('i.action-close');

    if( !isCollapsingAll && ancestorLI.classList.contains('closed') ){
        ancestorLI.classList.remove('closed');
        openAnchor.classList.add('hidden');
        closeAnchor.classList.remove('hidden');
    } else {
        ancestorLI.classList.add('closed');
        openAnchor.classList.remove('hidden');
        closeAnchor.classList.add('hidden');
    }
};


// in the future, when we have more things to configure than just applications
// we need to add logic to fieldEditModalClickHandler to know which part of 
// $scope.$config to change
