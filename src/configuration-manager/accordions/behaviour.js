var templator = require('oet-lib/templator');

var $scope;

var Behaviour = module.exports = {
    init: function(scope){
        $scope = scope;
    },

    configTreeClickHandler: function(ev){
        var clickedElement = ev.nodeName? ev : ev.target;
        switch(clickedElement.dataset.role){
            case 'toggle-sub-group':
                ev.prevetDefault && ev.preventDefault();
                var ancestorLI = clickedElement.parentNode.parentNode;
                var wasClosed = ancestorLI.classList.contains('closed');
                ancestorLI.classList[ wasClosed? 'remove' : 'add' ]('closed');
                ancestorLI.querySelector('i.action-open').classList[ wasClosed? 'add' : 'remove' ]('hidden');
                ancestorLI.querySelector('i.action-close').classList[ wasClosed? 'remove' : 'add' ]('hidden');
                break;

            case 'edit-item':
                openFieldEditModal( clickedElement.dataset.path );
                break;
        }
    },

    expandCollapseClickHandler: function(ev){
        var method;
        var  clickedElement = ev.target;
        var action = clickedElement.dataset.role;
        if(!action){
            return;
        }

        switch(action){
            case 'collapse-all':
                method = 'add';
                clickedElement.parentNode.nextElementSibling.classList.remove('hidden');
                break;
            case 'expand-all': 
                method = 'remove';
                clickedElement.parentNode.previousElementSibling.classList.remove('hidden');
                break;
        }
        clickedElement.parentNode.classList.add('hidden');

        $scope.$DOM.subGroupULs.forEach(function(ul){
            ul.classList[method]('hidden');
            var togglerAnchor = ul.parentNode.querySelector('label a');
            Behaviour.configTreeClickHandler.call(null, togglerAnchor);
        });
    }
};


var openFieldEditModal = function(path){
    //config,previewIncludingMargins,canvas
    path = path.split(',');
    var locals = {
        //'albelli.be' : config.channels['albelli.be'].
    };

    var config = $scope.$config.applications[ $scope.selectedApplication ].channels;

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
