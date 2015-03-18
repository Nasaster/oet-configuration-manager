var templator = require('oet-lib/templator');
var view = require('./accordions.view');

var $scope;

var Accordions = function(){};
Accordions.prototype.constructor = Accordions;
var accordions = module.exports = new Accordions();

Accordions.prototype.init = function(parent, wrapper){
    this.$parent = parent;
    this.$wrapper = wrapper || document.body;
    this.$config = parent.$config;
    return view.init(this);
};

// var Accordions = module.exports = {
//     init: function(scope){
//         $scope = scope;
//     },
//     render: function(config){
//         $config = config;console.log('config', config);
//         var locals = {
//             // we get this so we get a structure that will be the same for any channel
//             configuration: config[ Object.keys(config)[0] ], 
//             channels: Object.keys(config)
//         };
//         templator.render('views/configuration-manager/accordions.template.html', locals, $scope.$DOM.accordionsSection)
//             .then( registerDOM )
//             .then( registerBehaviour )
//             .then(
//                 function(){},
//                 function(err){console.error(err.stack); }
//             );
//     }
// };

// var registerDOM = function(){
//     Accordions.$DOM = {};
//     Accordions.$DOM.fieldEditModal = $scope.$wrapper.querySelector('.field-edit-modal .modal-dialog');
//     Accordions.$DOM.fieldGroupContainers = Array.prototype.slice( $scope.$wrapper.querySelectorAll('.group-form') );
// };

// var registerBehaviour = function(){
//     $scope.$DOM.accordionsSection.addEventListener('click', function(ev){
//         var clickedElement = ev.target;
//         var role = clickedElement.getAttribute('role');
//         if(!role){
//             return;
//         }
//         if(clickedElement.dataset.field){
//             var split = clickedElement.dataset.field.split('|');
//             var group = split[0];
//             var field = split[1];
//         }
        
//         switch( role ){
//             case 'edit':
//                 openFieldEditModal(group, field);
//                 break;
//             case 'delete': 

//                 break;
//             case 'collapse':
//                 setTimeout(function(){
//                     clickedElement.parentNode.nextElementSibling.classList.add('hidden');
//                     clickedElement.previousElementSibling.classList.remove('hidden');
//                     clickedElement.classList.add('hidden');    
//                 }, 150);
//                 break;
//             case 'expand':
//                 setTimeout(function(){
//                     clickedElement.parentNode.nextElementSibling.classList.remove('hidden');
//                     clickedElement.nextElementSibling.classList.remove('hidden');
//                     clickedElement.classList.add('hidden');    
//                 }, 150);
                
//                 break;
//         }
//     })
// };

// var openFieldEditModal = function(group, field){
//     var locals = {
//             group: group,
//             field: field
//         };
//         locals.config = Object.keys($config).reduce(function(a, b){
//            a[b] = $config[b][group][field];
//            return a;
//         }, {} );

//         templator.empty( Accordions.$DOM.fieldEditModal )
//             .then( templator.getTemplate.bind( null, 'views/configuration-manager/field-edit.modal.html' ) )
//             //plugin all the recursive stuff
//             .then( function(template){
//                 return templator.parse(template, locals);
//             } )
//             .then( function(html){
//                 return templator.inject(Accordions.$DOM.fieldEditModal, html);
//             } )
//             .then( function(){
//                 jQuery(Accordions.$DOM.fieldEditModal.parentNode).modal();
//             }, function(err){ console.error(err.stack) });

// };