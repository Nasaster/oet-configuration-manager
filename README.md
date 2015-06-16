# OET - Module - Configuration Manager

## Usage

### installation
```
git clone git@github.com:albumprinter/oet-configuration-manager.git configuration-manager
cd configuration-manager
npm install
```
run the tests
```
npm install -g testem
testem
```
run development server
You need two terminal.
First terminal:
```
grunt dev
```
Second terminal:
```
cd server
node index.js
```
### developing

All the module logic goes into the src/ folder  
if you want to add specific CSS to the module start in src/css/main.scss  
all the views, including sub-module's views, should be in src/views  
##### use src/bootstrap.js to bootstrap the module 
this file won't be used when an application is requiring the module  
here you should mock some configuration if needed in src/config
```javascript
var newModule = require('./new-module/new-module.controller.js');  
var config = require('./config/mock-configuration.json');
//here we don't init the templator because we're not compiling views while developing modules

newModule.init(config)
    .then(
        function(){ console.log('module bootstrapped correctly'); },
        function(err) { console.log(err.stack) };
    );
```

#### there's a controller and view:
###### src/new-module/new-module.controller.js
responsible for any communication to the outside world  manages the view and passes itself as a $scope to the view on initiation  
only communicates through messages, knows nothing about outside scope
```javascript
var pubsub = require('oet-lib/pubsub');
var view = require('./module-name.view');

var NewModule = function(){};
NewModule.prototype.constructor = NewModule;
var newModule = module.exports = new NewModule();

NewModule.prototype.init = function(config, wrapper){
    //wrapper refers to the DOM element where the component is going to be rendered
    this.$wrapper = wrapper || document.body;
    this.$config = config;

    //some initialization logic here
    
    //returns the promise created in templator.render()
    return view.init(this);
};

NewModule.prototype.broadcast = function(message, data){
    pubsub.broadcast(message, data);
};
```
###### src/module-name/module-name.view.js
knows nothing of the outside world, only knows of the controller as $scope  
sends messages to the controller, when some action takes place  

```javascript
var templator = require('oet-lib/templator');
var $scope;

var NewModuleView = function(){};
NewModuleView.prototype.constructor = NewModuleView;
var newModuleView = module.exports = new NewModuleView();

NewModuleView.prototype.init = function(controller){
    $scope = controller;
    //returns the promise created in templator.render
    return this.render($scope.$wrapper, $scope.tabs)
        .then(registerDom)
        .then(registerEvents)
        .then(...);
};

//we expose the render method because there may come the need for the controller to render it again
NewModuleView.prototype.render = function(){
    //use the templator to render the html
    return templator.render('views/module-name/main.html', $scope.$config)
        .then(templator.inject.bind(null, $scope.$wrapper));
};

//we cache all the DOM elements we'll use later
var registerDOM = function(){
    $scope.$DOM = {};
    $scope.$DOM.element = $scope.$wrapper.querySelector('.some-element');
};

//we attach the events needed
var registerEvents = function(){
    $scope.$DOM.element.addEventListener('click', clickHandler);
};
```

### sub-modules
in some modules it will make sense to create sub-modules to manage smaller parts of the application.  
for more information on how to create and use sub-modules please refer to https://github.com/albumprinter/oet-nextgen-footer-tabs

### Steps to add product configurationss
Here are the steps to create a symlink for the each application (Calendar, Walldecor, Phonecase) folder. First step is to link them inside the "data" folder.
```
cd data/
ln -s path/to/original/folder targetPath
```
Where targetPath should be Calendar, Walldecor or Phonecase.
Eg. :
```
ln -s ../../oet-js-calendar/resources/config Calendar
ln -s ../../oet-js-walldecor/resources/config Walldecor
ln -s ../../oet-js-phonecase/resources/config Phonecase
```
This "creates" a symlink named "Calendar" and links it to the path described above.
```
ls -slah
0 drwxr-xr-x  10 atsokaktsidis  VISTAPRINTUS\Domain Users   340B Jun 11 12:06 .
0 drwxr-xr-x  19 atsokaktsidis  VISTAPRINTUS\Domain Users   646B Jun 11 12:06 ..
8 lrwxr-xr-x   1 atsokaktsidis  VISTAPRINTUS\Domain Users    39B Jun 11 11:59 Calendar -> ../../oet-js-calendar/resources/config
```
Go back to the Configuration Editor root directory:
```
cd ..
```
