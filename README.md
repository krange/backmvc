Back-MVC
=======

# Introduction

Back-MVC acts as the glue to bind a Backbone.js application is a more traditional MVC framework. Back-MVC is an extension of a previous [JS-MVC experiment](https://github.com/krange/JS-MVC). Just like JS-MVC, Back-MVC is loosely based on [PureMVC](http://puremvc.org) and [Fabrication](http://code.google.com/p/fabrication/)

Unit-tested through Jasmine.
Own namespace (BackMVC).
AMD support.
Release version in Downloads. 6kb minified.

# Usage

### Facade

First step is to create and extend the Facade class. This provides the entrance into the framework and starts everything up. To start, override and implement the stub method 'startup'. You could also provide arguments to make it more dynamic. You can then either create an view to hold this element or pass it to some sort of startup command.

Commands, Models, Views and Routers are provided access to the facade directly by accessing the variable *this.facade*. This enables any actor in the framework access to register, retrieve or remove any other actor.

#### ApplicationFacade.js

```js
ApplicationFacade = BackMVC.Facade.extend({
	startup: function () {
		this.registerCommand('startup', StartupCommand);
		this.sendMessage('startup', $('#container'));
	}
});
```

### Commands

Commands execute your user interactions and interact with the models/collections. To create a command, extend the Command class and override the execute method

#### StartupCommand.js

```js
StartupCommand = BackMVC.Command.extend({
	execute: function (message) {
		var element = message.getBody();
		// Register main view
		var applicationView = new ApplicationView(ApplicationView.NAME, {el: element});
		this.registerView(applicationView);
	}
});
```

### Models/Collections

Models and Collections store your data and your business/domain logic to interact with them. To create one, extend the Model or Collection class.

In order for the application to find the model/collection when requested, you can either create a static *NAME* variable which you pass in on instantiation or override the *getName* method and return your own name structure that could be a bit more dynamic.

The data of a model/collection is provided through Backbone.js functionality

#### SomeModel.js

```js
SomeModel = BackMVC.Model.extend({
	getSomeValue: function () {
		return this.get('someValue');
	}
});
SomeModel.NAME = 'SomeModel';

var model = new SomeModel(SomeModel.NAME, {someValue: 'this is model 1'});
var model1 = new SomeModel(SomeModel.NAME + '1', {someValue: 'this is model 2'}, {silent: true});
```

### Views

Views are the interface between your views and the application framework. You should only listen for events/signals in views from your views which then interact directly with the dom.

In order for the application to find the view when requested, you can either create a static *NAME* variable which you pass in on instantiation or override the *getName* method and return your own name structure that could be a bit more dynamic.

When a message is sent out in the framework, views can listen to them directly by adding a function named *respondTo[MessageName]*. For example, if you are sending out a mesage named *applicationLoadComplete*, a medaitor could listen to that command by adding the prefix **respondTo** and the mesasge (first letter capitalized). The full function would then be named **respondToApplicationLoadComplete**. The function will always be passed 1 argument which is a *Message*

#### ApplicationView.js

```js
ApplicationView = BackMVC.View.extend({
	onRegister: function () {
		// Do something
	},

	respondToSomeMessage: function (message) {
		var model = this.retrieveModel(SomeModel.NAME);
		console.log(model.getSomeValue());
	}
});
ApplicationView.NAME = 'ApplicationView';
```

### Messages

Notification is such a long word to write. Message is much easier and faster. Same basic principle, an actor sends out a mesasge that other actors are listening and can respond to. A *Message* takes 3 parameters (name, body, type) but only *name* is required.

```js
StartupCommand = BackMVC.Command.extend({
	execute: function (message) {
		this.sendMessage('applicationLoadComplete', message.getBody(), message.getType());
	}
});
```

### Tying it all together

Create a 'main' style class and instantiate your facade with your provided application level dom element you would like to work with. If everything else is set up, you should be on your way.

#### main.js

```js
var facade = new ApplicationFacade();
facade.startup();
```