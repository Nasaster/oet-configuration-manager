var Q = require('q');
var templator = require('oet-lib/templator');
// promise to make sure our templates are cached in the templates
var renderTemplates; 
var templates = {};

var $DOM = {};

var FormHelper = module.exports = {
    populateForms: function(wrapper, config){
        renderTemplates.then(function(){
            $DOM.formGroups = {};
            var promises = [];
            Object.keys(config.application).forEach(function(key){
                var formGroup = $DOM.formGroups[key] = document.getElementById('form-group-' + key);
                promises.push (renderForm( formGroup, config.application[key] ) );
            });

            Q.all(promises).then(
                // function(){console.log('success')},
                // function(err){console.error(err.stack);}
            )
        });
    }
};

function renderForm(formElement, config){
    var mainPath = ['main'];
    var currentPath;

    function traverse(rootNode, path, level){
        currentPath = path;
        var html = '';
        var parents = Object.keys(rootNode);

        parents.forEach(function(parentName){
            currentPath = currentPath.splice(0, level);
            
            currentPath.push(parentName);

            if(typeof rootNode[parentName] === 'object') {
                if(rootNode[parentName] !== null && Object.keys(rootNode[parentName]).length > 0){
                    html += templator.parse(templates['group-item'], {
                        label: parentName,
                        content: traverse(rootNode[parentName], currentPath, level+1)
                    });
                }
            }
            else if(typeof rootNode[parentName] === 'boolean'){
                html += templator.parse(templates['boolean-item'], {
                    label: parentName,
                    path: currentPath.join('|'),
                    checkedTrue: rootNode[parentName]? 'checked' : '',
                    checkedFalse: rootNode[parentName]? '' : 'checked'
                })
            }
            else if(typeof rootNode[parentName] === 'string'){
                var value = rootNode[parentName] === null? 'null' : rootNode[parentName];
                html += templator.parse(templates['text-item'], {
                    label: parentName,
                    path: currentPath.join('|'),
                    value: rootNode[parentName] || 'null'
                });
            }
            else if(typeof rootNode[parentName] === 'number'){
                var value = rootNode[parentName] === null? 'null' : rootNode[parentName];
                html += templator.parse(templates['number-item'], {
                    label: parentName,
                    path: currentPath.join('|'),
                    value: rootNode[parentName] || 'null'
                });
            }
        });
        return html;
    }

    var content = traverse(config, mainPath, 0); 
    var html = templator.parse(templates.form, {
        content: content
    });

    return templator.inject( formElement.querySelector('.group-form'), html )
        //.then(function(){console.log('success')});
};

renderTemplates = (function formHelperInit(){
    var templateNames = [
        'form',
        'boolean-item',
        'group-item',
        'number-item',
        'text-item'
    ];

    var promises = [];

    templateNames.forEach(function(templateName){
        var url = 'views/configuration-manager/form-templates/' + templateName + '.template.html';
        promises.push( templator.getTemplate(url) );
    });

    return Q.all(promises)
        .then(function(result){
            templateNames.forEach(function(templateName, index){
                templates[templateName] = result[index];
            });
        });
})();
