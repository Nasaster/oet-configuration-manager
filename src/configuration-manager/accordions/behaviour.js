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
            case 'delete-item':
                $scope.broadcast( 'item deleted', {
                    path: clickedElement.dataset.path
                } );
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
        switch(clickedElement.dataset.role){
            case 'update':
                var form = document.getElementById('configuration-property-form');
                var path = form.name.split(',');
                var fieldItems = Array.prototype.slice.call( form.querySelectorAll('.field-item') );

                $scope.propertyChanged(path, fieldItems);
                break;
        }
    }
};


var openFieldEditModal = function(path){
    
    path = path.split(',');
    var locals = {
        path: path
    };

    var config = $scope.$parent.currentConfiguration["application.json"][ $scope.$parent.selectedApplication ].channels;
    var type = $scope.$parent.currentConfiguration.templates[ $scope.$parent.selectedApplication ][ "application.json" ];

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
        a[ b ] = value;
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
