describe('Facade', function () {
	var facade;

	beforeEach(function () {
		facade = new BackMVC.Facade();
	});

	afterEach(function () {
		facade = undefined;
	});

	describe('Instantiation', function () {
		it('should have defined observers', function() {
			expect(facade._commandObserver).toBeDefined();
			expect(facade._modelObserver).toBeDefined();
			expect(facade._routerObserver).toBeDefined();
			expect(facade._viewObserver).toBeDefined();
		});
	});

	describe('View', function () {
		var view, SomeView;

		beforeEach(function () {
			SomeView = BackMVC.View.extend();
			SomeView.NAME = 'SomeView';
			view = new SomeView(SomeView.NAME);
		});

		afterEach(function () {
			facade = undefined;
		});

		describe('registerView', function () {
			it('should register a single view and return the stored view', function() {
				var storedView;

				storedView = facade.registerView(view);

				expect(storedView).toBe(view);
			});

			it('should register multiple views', function() {
				var storedView, SomeView1, SomeView2, storedView1, storedView2,
					view1, view2;

				SomeView1 = BackMVC.View.extend();
				SomeView1.NAME = 'SomeView1';
				SomeView2 = BackMVC.View.extend();
				SomeView2.NAME = 'SomeView2';

				view1 = new SomeView1(SomeView1.NAME);
				view2 = new SomeView2(SomeView2.NAME);

				storedView = facade.registerView(view);
				storedView1 = facade.registerView(view1);
				storedView2 = facade.registerView(view2);

				expect(storedView).toBe(view);
				expect(storedView1).toBe(view1);
				expect(storedView2).toBe(view2);
			});

			it('should register multiple views of the same class with different names', function() {
				var storedView, storedView1, storedView2, view1, view2;

				view1 = new SomeView(SomeView.NAME + '1');
				view2 = new SomeView(SomeView.NAME + '2');

				storedView = facade.registerView(view);
				storedView1 = facade.registerView(view1);
				storedView2 = facade.registerView(view2);

				expect(storedView).toBe(view);
				expect(storedView1).toBe(view1);
				expect(storedView2).toBe(view2);
			});
		});

		describe('removeView', function () {
			it('should remove an already registered view', function() {
				var viewRemoved;

				facade.registerView(view);
				viewRemoved = facade.removeView(view.getName());

				expect(viewRemoved).toBe(view);
			});

			it('should not fail if attempting to remove a view that is not registered', function() {
				var viewRemoved;

				facade.registerView(view);
				viewRemoved = facade.removeView(view.getName());
				viewRemoved = facade.removeView(view.getName());

				expect(viewRemoved).toBe(undefined);
			});

			it('should remove a single already registered view if multiple different view have been registered', function() {
				var view1, view2, viewRemoved;

				view1 = new SomeView(SomeView.NAME + '1');
				view2 = new SomeView(SomeView.NAME + '2');

				facade.registerView(view);
				facade.registerView(view1);
				facade.registerView(view2);
				viewRemoved = facade.removeView(view.getName());

				expect(viewRemoved).toBe(view);
			});
		});

		describe('retrieveView', function () {
			it('should retrieve an already registered view', function() {
				var retrievedView;

				facade.registerView(view);
				retrievedView = facade.retrieveView(view.getName());

				expect(retrievedView).toBe(view);
			});

			it('should retrieve an already registered view if multiple views are registered', function() {
				var view1, view2, retrievedView, retrievedView1, retrievedView2;

				view1 = new SomeView(SomeView.NAME + '1');
				view2 = new SomeView(SomeView.NAME + '2');

				facade.registerView(view);
				facade.registerView(view1);
				facade.registerView(view2);

				retrievedView = facade.removeView(view.getName());
				retrievedView1 = facade.removeView(view1.getName());
				retrievedView2 = facade.removeView(view2.getName());

				expect(retrievedView).toBe(view);
				expect(retrievedView1).toBe(view1);
				expect(retrievedView2).toBe(view2);
			});

			it('should not retrieve a view that has been removed', function() {
				var view1, view2, retrievedView;

				view1 = new SomeView(SomeView.NAME + '1');
				view2 = new SomeView(SomeView.NAME + '2');

				facade.registerView(view);
				facade.registerView(view1);
				facade.registerView(view2);

				facade.removeView(view1.getName());
				retrievedView = facade.retrieveView(view1.getName());

				expect(retrievedView).toBe(undefined);
			});

			it('should not retrieve any view after all have been removed', function() {
				var view1, view2, retrievedView, retrievedView1,
					retrievedView2;

				view1 = new SomeView(SomeView.NAME + '1');
				view2 = new SomeView(SomeView.NAME + '2');

				facade.registerView(view);
				facade.registerView(view1);
				facade.registerView(view2);

				facade.removeView(view.getName());
				facade.removeView(view1.getName());
				facade.removeView(view2.getName());

				retrievedView = facade.retrieveView(view.getName());
				retrievedView1 = facade.retrieveView(view1.getName());
				retrievedView2 = facade.retrieveView(view2.getName());

				expect(retrievedView).toBe(undefined);
				expect(retrievedView1).toBe(undefined);
				expect(retrievedView2).toBe(undefined);
			});
		});

		describe('sendMessage', function () {
			it('should send a message from a registered view to another registered view', function() {
				var view1, ReceivedView;

				ReceivedView = BackMVC.View.extend({
					respondToTestMessage: function (message) {
					}
				});
				ReceivedView.NAME = 'ReceivedView';

				view1 = new ReceivedView(ReceivedView.NAME);
				spyOn(view1, 'respondToTestMessage');

				facade.registerView(view);
				facade.registerView(view1);

				view.sendMessage('testMessage');

				expect(view1.respondToTestMessage).toHaveBeenCalled();
			});

			it('should send a message from a registered view but a removed view should not respond', function() {
				var view1, ReceivedView;

				ReceivedView = BackMVC.View.extend({
					respondToTestMessage: function (message) {
					}
				});
				ReceivedView.NAME = 'ReceivedView';

				view1 = new ReceivedView(ReceivedView.NAME);
				spyOn(view1, 'respondToTestMessage').andCallThrough();

				facade.registerView(view);
				facade.registerView(view1);
				facade.removeView(view1.getName());

				view.sendMessage('testMessage');

				expect(view1.respondToTestMessage).wasNotCalled();
			});

			it('should send a message from a registered view to another registered command', function() {
				var ReceivedCommand;

				ReceivedCommand = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved = message;
					}
				});

				facade.registerView(view);
				facade.registerCommand('testMessage', ReceivedCommand);
				view.sendMessage('testMessage');

				expect(window.messageReceieved).toBeDefined();
				expect(window.messageReceieved.getName()).toBe('testMessage');

				window.messageReceieved = undefined;
			});


			it('We can register and remove listeners' +
				' while a message is sent', function() {
				var view1, view2, view3, ReceivedView, ReceivedCommand;

				ReceivedCommand = BackMVC.Command.extend({
					execute: function (message) {
						// The command removes view 1
						facade.removeView(view1.getName());
					}
				});

				ReceivedView = BackMVC.View.extend({
					respondToTestMessage: function (message) {
					}
				});
				ReceivedView.NAME = 'ReceivedView';

				view1 = new ReceivedView(ReceivedView.NAME + '1');
				view2 = new ReceivedView(ReceivedView.NAME + '2');
				view3 = new ReceivedView(ReceivedView.NAME + '3');
				view4 = new ReceivedView(ReceivedView.NAME + '4');

				view1.respondToTestMessage = function () {
					//View 1 removes view 2
					facade.removeView(view2.getName());
				};

				view3.respondToTestMessage = function () {
					//View 3 registers a new view 4
					facade.registerView(view4);
				};

				// The sender, defined outside this test
				facade.registerView(view);

				facade.registerCommand('testMessage', ReceivedCommand);
				facade.registerView(view1);
				facade.registerView(view2);
				facade.registerView(view3);
				// Note view 4 is not registered here, it is registered later

				spyOn(view1, 'respondToTestMessage').andCallThrough();
				spyOn(view2, 'respondToTestMessage').andCallThrough();
				spyOn(view3, 'respondToTestMessage').andCallThrough();
				spyOn(view4, 'respondToTestMessage').andCallThrough();

				view.sendMessage('testMessage');

				// View 1 does get called even though the command
				// called remove on the view, because remove happens
				// AFTER respondTo callbacks.
				expect(view1.respondToTestMessage).toHaveBeenCalled();

				// View2 existed at the time the message was sent, so it is
				//  called even though view 1 removed it.
				expect(view2.respondToTestMessage).toHaveBeenCalled();

				expect(view3.respondToTestMessage).toHaveBeenCalled();

				// View 4 does NOT get the message, it was registered AFTER the
				// message was sent inside view 3:s responsdTo method.
				expect(view4.respondToTestMessage).not.toHaveBeenCalled();

				// Lets do it again too see that view1 and view2 are removed
				// and does not get messages
				view1.respondToTestMessage = function () {
					console.error("I am not called, I am not in the facade");
				};
				view2.respondToTestMessage = view1.respondToTestMessage;
				spyOn(view1, 'respondToTestMessage').andCallThrough();
				spyOn(view2, 'respondToTestMessage').andCallThrough();
				view.sendMessage('testMessage');

				// View1 and view2 were removed earlier
				expect(view1.respondToTestMessage).not.toHaveBeenCalled();
				expect(view2.respondToTestMessage).not.toHaveBeenCalled();
			});


		});
	});

	describe('Model', function () {
		var model, SomeModel;

		beforeEach(function () {
			SomeModel = BackMVC.Model.extend();
			SomeModel.NAME = 'SomeModel';
			model = new SomeModel(SomeModel.NAME);
		});

		afterEach(function () {
			facade = undefined;
		});

		describe('registerModel', function () {
			it('should register a single model and return the stored model', function() {
				var storedModel;

				storedModel = facade.registerModel(model);

				expect(storedModel).toBe(model);
			});

			it('should register multiple models', function() {
				var storedModel, SomeModel1, SomeModel2, storedModel1, storedModel2,
					model1, model2;

				SomeModel1 = BackMVC.Model.extend();
				SomeModel1.NAME = 'SomeModel1';
				SomeModel2 = BackMVC.Model.extend();
				SomeModel2.NAME = 'SomeModel2';

				model1 = new SomeModel1(SomeModel1.NAME);
				model2 = new SomeModel2(SomeModel2.NAME);

				storedModel = facade.registerModel(model);
				storedModel1 = facade.registerModel(model1);
				storedModel2 = facade.registerModel(model2);

				expect(storedModel).toBe(model);
				expect(storedModel1).toBe(model1);
				expect(storedModel2).toBe(model2);
			});

			it('should register multiple models of the same class with different names', function() {
				var storedModel, storedModel1, storedModel2, model1, model2;

				model1 = new SomeModel(SomeModel.NAME + '1');
				model2 = new SomeModel(SomeModel.NAME + '2');

				storedModel = facade.registerModel(model);
				storedModel1 = facade.registerModel(model1);
				storedModel2 = facade.registerModel(model2);

				expect(storedModel).toBe(model);
				expect(storedModel1).toBe(model1);
				expect(storedModel2).toBe(model2);
			});
		});

		describe('removeModel', function () {
			it('should remove an already registered model', function() {
				var modelRemoved;

				facade.registerModel(model);
				modelRemoved = facade.removeModel(model.getName());

				expect(modelRemoved).toBe(model);
			});

			it('should not fail if attempting to remove a model that is not registered', function() {
				var modelRemoved;

				facade.registerModel(model);
				modelRemoved = facade.removeModel(model.getName());
				modelRemoved = facade.removeModel(model.getName());

				expect(modelRemoved).toBe(undefined);
			});

			it('should remove a single already registered model if multiple different model have been registered', function() {
				var model1, model2, modelRemoved;

				model1 = new SomeModel(SomeModel.NAME + '1');
				model2 = new SomeModel(SomeModel.NAME + '2');

				facade.registerModel(model);
				facade.registerModel(model1);
				facade.registerModel(model2);
				modelRemoved = facade.removeModel(model.getName());

				expect(modelRemoved).toBe(model);
			});
		});

		describe('retrieveModel', function () {
			it('should retrieve an already registered model', function() {
				var retrievedModel;

				facade.registerModel(model);
				retrievedModel = facade.retrieveModel(model.getName());

				expect(retrievedModel).toBe(model);
			});

			it('should retrieve an already registered model if multiple models are registered', function() {
				var model1, model2, retrievedModel, retrievedModel1, retrievedModel2;

				model1 = new SomeModel(SomeModel.NAME + '1');
				model2 = new SomeModel(SomeModel.NAME + '2');

				facade.registerModel(model);
				facade.registerModel(model1);
				facade.registerModel(model2);

				retrievedModel = facade.removeModel(model.getName());
				retrievedModel1 = facade.removeModel(model1.getName());
				retrievedModel2 = facade.removeModel(model2.getName());

				expect(retrievedModel).toBe(model);
				expect(retrievedModel1).toBe(model1);
				expect(retrievedModel2).toBe(model2);
			});

			it('should not retrieve a model that has been removed', function() {
				var model1, model2, retrievedModel;

				model1 = new SomeModel(SomeModel.NAME + '1');
				model2 = new SomeModel(SomeModel.NAME + '2');

				facade.registerModel(model);
				facade.registerModel(model1);
				facade.registerModel(model2);

				facade.removeModel(model1.getName());
				retrievedModel = facade.retrieveModel(model1.getName());

				expect(retrievedModel).toBe(undefined);
			});

			it('should not retrieve any model after all have been removed', function() {
				var model1, model2, retrievedModel, retrievedModel1,
					retrievedModel2;

				model1 = new SomeModel(SomeModel.NAME + '1');
				model2 = new SomeModel(SomeModel.NAME + '2');

				facade.registerModel(model);
				facade.registerModel(model1);
				facade.registerModel(model2);

				facade.removeModel(model.getName());
				facade.removeModel(model1.getName());
				facade.removeModel(model2.getName());

				retrievedModel = facade.retrieveModel(model.getName());
				retrievedModel1 = facade.retrieveModel(model1.getName());
				retrievedModel2 = facade.retrieveModel(model2.getName());

				expect(retrievedModel).toBe(undefined);
				expect(retrievedModel1).toBe(undefined);
				expect(retrievedModel2).toBe(undefined);
			});
		});

		describe('sendMessage', function () {
			it('should send a message from a registered model to another registered view', function() {
				var view1, ReceivedView;

				ReceivedView = BackMVC.View.extend({
					respondToTestMessage: function (message) {
					}
				});
				ReceivedView.NAME = 'ReceivedView';

				view1 = new ReceivedView(ReceivedView.NAME);
				spyOn(view1, 'respondToTestMessage');

				facade.registerModel(model);
				facade.registerView(view1);

				model.sendMessage('testMessage');

				expect(view1.respondToTestMessage).toHaveBeenCalled();
			});

			it('should send a message from a registered model to another registered command', function() {
				var view1, ReceivedCommand;

				ReceivedCommand = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved = message;
					}
				});

				facade.registerModel(model);
				facade.registerCommand('testMessage', ReceivedCommand);
				model.sendMessage('testMessage');

				expect(window.messageReceieved).toBeDefined();
				expect(window.messageReceieved.getName()).toBe('testMessage');

				window.messageReceieved = undefined;
			});
		});
	});

	describe('Command', function () {
		var model, SomeCommand;

		beforeEach(function () {
			window.messageReceieved = 0;
			SomeCommand = BackMVC.Command.extend({
				execute: function (message) {
					window.messageReceieved++;
				}
			});
		});

		afterEach(function () {
			window.messageReceieved = undefined;
			facade = undefined;
		});

		describe('registerCommand', function () {
			it('should register a single command and return that it was registered', function() {
				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(1);
			});

			it('should not register a command class twice to the same message', function() {
				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(true);
				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(false);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(1);
			});

			it('should register multiple different commands to the same message', function() {
				var SomeCommand1;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved++;
					}
				});

				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(true);
				expect(facade.registerCommand('someMessage', SomeCommand1)).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(2);
			});

			it('should register different command classes to the different messages', function() {
				var SomeCommand1, SomeCommand2;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved++;
					}
				});
				SomeCommand2 = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved++;
					}
				});

				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(true);
				expect(facade.registerCommand('someMessage1', SomeCommand1)).toBe(true);
				expect(facade.registerCommand('someMessage2', SomeCommand2)).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(1);

				facade.sendMessage('someMessage1');
				expect(window.messageReceieved).toBe(2);

				facade.sendMessage('someMessage2');
				expect(window.messageReceieved).toBe(3);
			});

			it('should register multiple commands of the same command class to different messages', function() {
				expect(facade.registerCommand('someMessage', SomeCommand)).toBe(true);
				expect(facade.registerCommand('someMessage1', SomeCommand)).toBe(true);
				expect(facade.registerCommand('someMessage2', SomeCommand)).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(1);

				facade.sendMessage('someMessage1');
				expect(window.messageReceieved).toBe(2);

				facade.sendMessage('someMessage2');
				expect(window.messageReceieved).toBe(3);
			});
		});

		describe('removeCommand', function () {
			it('should remove an already registered command', function() {
				facade.registerCommand('someMessage', SomeCommand);
				expect(facade.removeCommand('someMessage')).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(0);
			});

			it('should not fail if attempting to remove a command that is not registered', function() {
				expect(facade.removeCommand('someMessage')).toBe(false);
			});

			it('should remove a single already registered command if multiple different commands have been registered', function () {
				var SomeCommand1;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved++;
					}
				});

				facade.registerCommand('someMessage', SomeCommand);
				facade.registerCommand('someMessage1', SomeCommand1);
				expect(facade.removeCommand('someMessage')).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(0);

				facade.sendMessage('someMessage1');
				expect(window.messageReceieved).toBe(1);
			});

			it('should remove a all registered commands to a message if multiple commands have been registered to same message', function () {
				var SomeCommand1;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						window.messageReceieved++;
					}
				});

				facade.registerCommand('someMessage', SomeCommand);
				facade.registerCommand('someMessage', SomeCommand1);
				expect(facade.removeCommand('someMessage')).toBe(true);

				facade.sendMessage('someMessage');
				expect(window.messageReceieved).toBe(0);
			});
		});

		describe('sendMessage', function () {
			it('should send a message from a registered command to another registered command', function() {
				var SomeCommand1;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						this.sendMessage('end');
					}
				});

				facade.registerCommand('end', SomeCommand);
				facade.registerCommand('start', SomeCommand1);

				facade.sendMessage('start');
				expect(window.messageReceieved).toBe(1);
			});

			it('should send a message from a registered command to another registered view', function() {
				var SomeCommand1, SomeView;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						this.sendMessage('end');
					}
				});

				SomeView = BackMVC.View.extend({
					respondToEnd: function (message) {
						window.messageReceieved++;
					}
				});
				SomeView.NAME = 'SomeView';

				facade.registerCommand('start', SomeCommand1);

				view = new SomeView(SomeView.NAME);
				facade.registerView(view);

				facade.sendMessage('start');
				expect(window.messageReceieved).toBe(1);
			});

			it('should send a message from a registered command to another registered view and registered command', function() {
				var SomeCommand1, SomeView;

				SomeCommand1 = BackMVC.Command.extend({
					execute: function (message) {
						this.sendMessage('end');
					}
				});

				SomeView = BackMVC.View.extend({
					respondToEnd: function (message) {
						window.messageReceieved++;
					}
				});
				SomeView.NAME = 'SomeView';

				facade.registerCommand('start', SomeCommand1);
				facade.registerCommand('end', SomeCommand);

				view = new SomeView(SomeView.NAME);
				facade.registerView(view);

				facade.sendMessage('start');
				expect(window.messageReceieved).toBe(2);
			});
		});
	});
});
