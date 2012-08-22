/*!
 * BackMVC.js 0.4.0
 * May be freely distributed under the MIT license
 * https://github.com/krange/backmvc
 */
(function (global) {
	var BaseFacadable, Actor, Message, BaseObserver, CommandObserver, ModelObserver,
		RouterObserver, ViewObserver, Model, Collection, View, Command, Router,
		Facade, BackMVC;

	BackMVC = {};

	/**
	 * Base object that can register and remove a facade object. Each actor in
	 * the framework extends this at its very base.
	 */
	BackMVC.BaseFacadable = BaseFacadable = {};
	_.extend(BaseFacadable, {
		/**
		 * Register a facade instance. Only called via the Facade to register
		 * itself to the actor
		 *
		 * @param {Facade} facade The instance to register
		 */
		registerFacade: function (facade) {
			this.facade = facade;
			this.onRegister();
		},

		/**
		 * Remove the facade instance. Only called via the Facade to remove
		 * itself from the actor
		 */
		removeFacade: function () {
			this.facade = undefined;
			this.onRemove();
		},

		/**
		 * Callback for when a facade is registered
		 */
		onRegister: function () {
		},

		/**
		 * Callback for when a facade is removed
		 */
		onRemove: function () {
		}
	});

	/**
	 * Base framework actor which can interact with the facade.
	 *
	 * @extends {BaseFacadable}
	 */
	BackMVC.Actor = Actor = {};
	_.extend(Actor, BaseFacadable, {
		/**
		 * Get the actors name
		 *
		 * @return {String} The actors name
		 */
		getName: function () {
			return this.name;
		},

		/**
		 * Registers the command class and associates it to
		 * the message
		 *
		 * @param {String} messageName The message the command should respond to
		 * @param {Command} className The command class
		 * @see Facade
		 * @return {Boolean} True if successful
		 */
		registerCommand: function (messageName, className) {
			if (this.facade) {
				return this.facade.registerCommand(messageName, className);
			}
		},

		/**
		 * Removes all registered commands associated to the specified message
		 *
		 * @param {String} messageName The message to remove
		 * @see Facade
		 * @return {Boolean} True if successful
		 */
		removeCommand: function (messageName) {
			if (this.facade) {
				return this.facade.removeCommand(messageName);
			}
		},

		/**
		 * Registers a model to the facade
		 *
		 * @param {Model} model The model instance
		 * @see Facade
		 * @return {Model} The model if successfully registered
		 */
		registerModel: function (model) {
			if (this.facade) {
				return this.facade.registerModel(model);
			}
		},

		/**
		 * Retrieve an already registered model from the facade
		 *
		 * @param {String} name The name of the model instance
		 * @see Facade
		 * @return {Model} The model that was retrieved
		 */
		retrieveModel: function (name) {
			if (this.facade) {
				return this.facade.retrieveModel(name);
			}
		},

		/**
		 * Removes a registered model with the provided name from the facade
		 *
		 * @param {String} name The name of the model instance
		 * @see Facade
		 * @return {Model} The model instance if succesfully removed
		 */
		removeModel: function (name) {
			if (this.facade) {
				return this.facade.removeModel(name);
			}
		},

		/**
		 * Registers a view to the facade
		 *
		 * @param {View} view The view instance
		 * @see Facade
		 * @return {View} The view instance if successfully registered
		 */
		registerView: function (view) {
			if (this.facade) {
				return this.facade.registerView(view);
			}
		},

		/**
		 * Retrieves a view from the facade
		 *
		 * @param {String} name The name of the view instance
		 * @see Facade
		 * @return {View} The view instance if successfully retrieved
		 */
		retrieveView: function (name) {
			if (this.facade) {
				return this.facade.retrieveView(name);
			}
		},

		/**
		 * Removes a registered view with the provided name from the facade
		 *
		 * @param {String} name The name of the view instance
		 * @see Facade
		 * @return {View} The view instance if successfully removed
		 */
		removeView: function (name) {
			if (this.facade) {
				return this.facade.removeView(name);
			}
		},

		/**
		 * Registers a router to the facade
		 *
		 * @param {Router} router The router instance
		 * @see Facade
		 * @return {Router} The router instance if successfully registered
		 */
		registerRouter: function (router) {
			if (this.facade) {
				return this.facade.registerRouter(router);
			}
		},

		/**
		 * Retrieves a router from the facade
		 *
		 * @param {String} name The name of the router instance
		 * @see Facade
		 * @return {Router} The router instance if successfully retrieved
		 */
		retrieveRouter: function (name) {
			if (this.facade) {
				return this.facade.retrieveRouter(name);
			}
		},

		/**
		 * Removes a router from the facade
		 *
		 * @param {String} name The name of the router instance
		 * @see Facade
		 * @return {Router} The router instance if successfully removed
		 */
		removeRouter: function (name) {
			if (this.facade) {
				return this.facade.removeRouter(name);
			}
		},

		/**
		 * Sends a message to the facade
		 *
		 * @param {String} name The name of the message
		 * @param {Object} body The optional body of the message
		 * @param {String} type The optional type of the message
		 * @see Facade or Message
		 * @return {Boolean} True
		 */
		sendMessage: function (name, body, type) {
			if (this.facade) {
				this.facade.sendMessage(name, body, type);
			}
		}
	});

	/**
	 * A message that actors registered in the framework can respond to
	 *
	 * @param {String} name The name of the message
	 * @param {Object} body The optional body of the message
	 * @param {String} type The optional type of the message
	 */
	Message = function (name, body, type) {
		this.name = name;
		this.body = body;
		this.type = type;
	};
	BackMVC.Message = Message;
	_.extend(Message.prototype, {
		/**
		 * Retrieve the name of the message
		 *
		 * @return {String} Message name
		 */
		getName: function () {
			return this.name;
		},

		/**
		 * Retrieve the optional body of the message
		 *
		 * @return {Object} Message body
		 */
		getBody: function () {
			return this.body;
		},

		/**
		 * Retrieve the optional type of the message
		 *
		 * @return {[type]} [description]
		 */
		getType: function () {
			return this.type;
		}
	});

	/**
	 * A base observer class to be overriden and registered to the facade
	 *
	 * @extends {BaseFacadable}
	 */
	BaseObserver = function () {
		this._data = {};
	};
	BackMVC.BaseObserver = BaseObserver;
	_.extend(BaseObserver.prototype, BaseFacadable, {
		/**
		 * Register
		 */
		register: function () {
		},

		/**
		 * Remove
		 */
		remove: function () {
		},

		/**
		 * Retrieve
		 */
		retrieve: function () {
		},

		/**
		 * Get the registered data
		 *
		 * @return {Object} The data
		 */
		get: function () {
			return this._data;
		}
	});

	/**
	 * The observer for all registered commands in the framework
	 *
	 * @extends {BaseObserver}
	 */
	CommandObserver = function () {
		BaseObserver.apply(this, arguments);
	};
	BackMVC.CommandObserver = CommandObserver;
	_.extend(CommandObserver.prototype, BaseObserver.prototype, {
		/**
		 * Registers the command class and associates it to the message
		 *
		 * @param {String} messageName The message the command should respond to
		 * @param {Command} className The command class
		 * @return {Boolean} True if successful
		 */
		register: function (messageName, classReference) {
			var messages, found;

			if (messageName && classReference) {
				messages = [];

				if (this._data[messageName]) {
					messages = this._data[messageName];
				}

				found = _.find(messages, function (storedClass, index, messages) {
					if (classReference === storedClass) {
						return true;
					}
				});

				if (!found) {
					messages[messages.length] = classReference;
					this._data[messageName] = messages;
					return true;
				}
			}

			return false;
		},

		/**
		 * Removes all registered commands associated to the specified message
		 *
		 * @param {String} messageName The message to remove
		 * @return {Boolean} True if successful
		 */
		remove: function (messageName) {
			if (messageName && this._data[messageName]) {
				delete this._data[messageName];
				return true;
			}

			return false;
		}
	});

	/**
	 * The observer for all registered models in the framework. This includes
	 * extended MVC {Model} and {Collection} instances
	 *
	 * @extends {BaseObserver}
	 */
	ModelObserver = function () {
		BaseObserver.apply(this, arguments);
	}
	BackMVC.ModelObserver = ModelObserver;
	_.extend(ModelObserver.prototype, BaseObserver.prototype, {
		/**
		 * Registers a model or collection
		 *
		 * @param {Model} model The model instance
		 * @return {Model} The model if successfully registered
		 */
		register: function (model) {
			var modelName;

			if (model && model instanceof Model) {
				modelName = model.getName();

				if (modelName && modelName.length > 0 && !this._data[modelName]) {
					this._data[modelName] = model
					model.registerFacade(this.facade);
					return model;
				}
			}
		},

		/**
		 * Retrieve an already registered model or collection
		 *
		 * @param {String} name The name of the model instance
		 * @return {Model} The model that was retrieved
		 */
		retrieve: function (name) {
			if (name && this._data[name]) {
				return this._data[name];
			}
		},

		/**
		 * Removes a registered model or collection with the provided name
		 *
		 * @param {String} name The name of the model instance
		 * @return {Model} The model instance if succesfully removed
		 */
		remove: function (name) {
			var model = this.retrieve(name);

			if (model) {
				model.removeFacade();
				delete this._data[model.getName()];
				return model;
			}
		}
	});

	/**
	 * The observer for all registered models in the framework
	 *
	 * @extends {BaseObserver}
	 */
	ViewObserver = function () {
		BaseObserver.apply(this, arguments);
	};
	BackMVC.ViewObserver = ViewObserver;
	_.extend(ViewObserver.prototype, BaseObserver.prototype, {
		/**
		 * Registers a view
		 *
		 * @param {View} view The view instance
		 * @return {View} The view if successfully registered
		 */
		register: function (view) {
			var viewName;

			if (view && view instanceof View) {
				viewName = view.getName();

				if (viewName && viewName.length > 0 && !this._data[viewName]) {
					this._data[viewName] = view
					view.registerFacade(this.facade);
					return view;
				}
			}
		},

		/**
		 * Retrieve an already registered view
		 *
		 * @param {String} name The name of the view instance
		 * @return {View} The view that was retrieved
		 */
		retrieve: function (name) {
			if (name &&
				this._data[name]) {
				return this._data[name];
			}
		},

		/**
		 * Removes a registered view with the provided name
		 *
		 * @param {String} name The view of the model instance
		 * @return {View} The view instance if succesfully removed
		 */
		remove: function (name) {
			var view = this.retrieve(name);

			if (view) {
				view.removeFacade();
				delete this._data[view.getName()];
				return view;
			}
		}
	});

	/**
	 * The observer for all registered models in the framework
	 *
	 * @extends {BaseObserver}
	 */
	RouterObserver = function () {
		BaseObserver.apply(this, arguments);
	};
	BackMVC.RouterObserver = RouterObserver;
	_.extend(RouterObserver.prototype, BaseObserver.prototype, {
		/**
		 * Registers a router
		 *
		 * @param {Router} router The router instance
		 * @return {Router} The router if successfully registered
		 */
		register: function (router) {
			var routerName;
			if (router && router instanceof Router) {
				routerName = router.getName();
				if (routerName && routerName.length > 0 && !this._data[routerName]) {
					this._data[routerName] = router
					router.registerFacade(this.facade);
					return router;
				}
			}
		},

		/**
		 * Retrieve an already registered router
		 *
		 * @param {String} name The name of the router instance
		 * @return {Router} The router that was retrieved
		 */
		retrieve: function (name) {
			if (name &&
				this._data[name]) {
				return this._data[name];
			}
		},

		/**
		 * Removes a registered router with the provided name
		 *
		 * @param {String} name The view of the router instance
		 * @return {Router} The router instance if succesfully removed
		 */
		remove: function (name) {
			var router = this.retrieve(name);
			if (router) {
				router.remove();
				delete this._data[router.getName()];
				return router;
			}
		},
	});

	/**
	 * The facade class encapsulates the complexity of binding the different
	 * elements of the framework together. Provides access to startup the
	 * application and seamlessly registers/retrieves/removes framework actors
	 */
	Facade = function () {
			this._commandObserver = new CommandObserver();
			this._modelObserver = new ModelObserver();
			this._routerObserver = new RouterObserver();
			this._viewObserver = new ViewObserver();

			this._commandObserver.registerFacade(this);
			this._modelObserver.registerFacade(this);
			this._routerObserver.registerFacade(this);
			this._viewObserver.registerFacade(this);
	};
	BackMVC.Facade = Facade;
	Facade.extend = Backbone.Model.extend;
	_.extend(Facade.prototype, {
		/**
		 * A stub method which allows the user to start up the application.
		 * Provides no functionality and allows the user to implement their own
		 * start up
		 */
		startup: function () {
		},

		/**
		 * Registers the command class and associates it to the message
		 * @see {CommandObserver}
		 *
		 * @param {String} messageName The message the command should respond to
		 * @param {Command} className The command class
		 * @return {Boolean} True if successful
		 */
		registerCommand: function (messageName, className) {
			return this._commandObserver.register(messageName, className);
		},

		/**
		 * Removes all registered commands associated to the specified message
		 * @see {CommandObserver}
		 *
		 * @param {String} messageName The message to remove
		 * @return {Boolean} True if successful
		 */
		removeCommand: function (messageName) {
			return this._commandObserver.remove(messageName);
		},

		/**
		 * Registers a model or collection
		 *
		 * @param {Model} model The model instance
		 * @return {Model} The model if successfully registered
		 */
		registerModel: function (model) {
			return this._modelObserver.register(model);
		},

		/**
		 * Retrieve an already registered model or collection
		 *
		 * @param {String} name The name of the model instance
		 * @return {Model} The model that was retrieved
		 */
		retrieveModel: function (name) {
			return this._modelObserver.retrieve(name);
		},

		/**
		 * Removes a registered model or collection with the provided name
		 *
		 * @param {String} name The name of the model instance
		 * @return {Model} The model instance if succesfully removed
		 */
		removeModel: function (name) {
			return this._modelObserver.remove(name);
		},

		/**
		 * Registers a view
		 *
		 * @param {View} view The view instance
		 * @return {View} The view if successfully registered
		 */
		registerView: function (view) {
			return this._viewObserver.register(view);
		},

		/**
		 * Retrieve an already registered view
		 *
		 * @param {String} name The name of the view instance
		 * @return {View} The view that was retrieved
		 */
		retrieveView: function (name) {
			return this._viewObserver.retrieve(name);
		},

		/**
		 * Removes a registered view with the provided name
		 *
		 * @param {String} name The view of the model instance
		 * @return {View} The view instance if succesfully removed
		 */
		removeView: function (name) {
			return this._viewObserver.remove(name);
		},

		/**
		 * Registers a router
		 *
		 * @param {Router} router The router instance
		 * @return {Router} The router if successfully registered
		 */
		registerRouter: function (router) {
			return this._routerObserver.register(router);
		},

		/**
		 * Retrieve an already registered router
		 *
		 * @param {String} name The name of the router instance
		 * @return {Router} The router that was retrieved
		 */
		retrieveRouter: function (name) {
			return this._routerObserver.retrieve(name);
		},

		/**
		 * Removes a registered router with the provided name
		 *
		 * @param {String} name The view of the router instance
		 * @return {Router} The router instance if succesfully removed
		 */
		removeRouter: function (name) {
			return this._routerObserver.remove(name);
		},

		/**
		 * Send a message to interested actors registered in the framework. This
		 * method creates a {Message} instance via the arguments and dispatches
		 * it to actors that are enabled to respond to messages. This currently
		 * includes only {Command} and {View} instances.
		 *
		 * @param {String} name The required name of the message
		 * @param {Object} body An optional body
		 * @param {String} type An optional type string
		 */
		sendMessage: function (name, body, type) {
			var message, views, facade;
			facade = this;
			message = new Message(name, body, type);

			_.each(this._commandObserver.get(), function (items, messageName, commandsObj) {
				if (name === messageName) {
					_.each(items, function (item, itemIndex, itemsArr) {
						var command = new itemsArr[itemIndex]();
						if (command instanceof Command) {
							command.registerFacade(facade);
							command.execute(message);
						}
					});
				}
			});

			views = this._viewObserver.get();
			_.each(views, function (view, viewName, views) {
				var interests = view.getMessageInterests();

				_.each(interests, function (interest, interestIndex, interests) {
					var interestName;

					if (name === interest) {
						interestName = interests[interestIndex].charAt(0).toUpperCase() + interest.slice(1);
						view['respondTo' + interestName](message);
					}
				});
			});
		}
	});

	/**
	 * A registerable actor in the framework which inherits from the
	 * {Backbone.Model} class. A model has similar functionality to other actors
	 * in the framework except that it can not register/retrieve/remove a view
	 * or respond to messages dispatched.
	 *
	 * @extends {Backbone.Model}
	 *
	 * @param {String} name A required name for the model instance
	 * @param {Object} attributes An optional parameter inherited from {Backbone.Model}
	 * @param {Object} options An optional paramter inherited from {Backbone.Model}
	 */
	Model = function (name, attributes, options) {
		this.name = name;
		Backbone.Model.call(this, attributes, options);
	};
	BackMVC.Model = Model;
	Model.extend = Backbone.Model.extend;
	_.extend(Model.prototype, Actor, Backbone.Model.prototype);
	delete Model.prototype.registerView;
	delete Model.prototype.retrieveView;
	delete Model.prototype.removeView;

	/**
	 * A registerable actor in the framework which inherits from the
	 * {Backbone.Router} class.
	 *
	 * @extends {Backbone.Router}
	 *
	 * @param {String} name A required name for the model instance
	 * @param {Object} attributes An optional parameter inherited from {Backbone.Model}
	 * @param {Object} options An optional paramter inherited from {Backbone.Model}
	 */
	Router = function (name, options) {
		this.name = name;
		Backbone.Router.call(this, options);
	};
	BackMVC.Router = Router;
	Router.extend = Backbone.Router.extend;
	_.extend(Router.prototype, Actor, Backbone.Router.prototype);

	/**
	 * A registerable actor in the framework which inherits from the
	 * {Backbone.Collection} class. A collection has similar functionality to
	 * other actors in the framework except that it can not
	 * register/retrieve/remove a view or respond to messages dispatched.
	 *
	 * @extends {Backbone.Collection}
	 *
	 * @param {String} name A required name for the model instance
	 * @param {Object} attributes An optional parameter inherited from {Backbone.Model}
	 * @param {Object} options An optional paramter inherited from {Backbone.Model}
	 */
	Collection = function (name, attributes, options) {
		this.name = name;
		Backbone.Collection.call(this, attributes, options);
	};

	BackMVC.Collection = Collection;
	Collection.extend = Backbone.Collection.extend;
	_.extend(Collection.prototype, Actor, Backbone.Collection.prototype);
	delete Collection.prototype.registerView;
	delete Collection.prototype.retrieveView;
	delete Collection.prototype.removeView;

	/**
	 * A registerable actor in the framework which inherits from the base
	 * {Actor} class. A command is the controller in the framework and has
	 * similiar functionality to other actors except that it has no name to
	 * retrieve.
	 */
	Command = function () {
		this.facade = undefined;
	};
	BackMVC.Command = Command;
	Command.extend = Backbone.Model.extend;
	_.extend(Command.prototype, Actor, {
		/**
		 * When a message is dispatched in the framework that matches a {String}
		 * that this {Command} is registered to, the execute method is
		 * automatically run. The only argument to this method is the {Message}
		 * instance dispatched from the Facade
		 *
		 * @param {Message} message The message disptached
		 */
		execute: function (message) {
		}
	});
	delete Command.prototype.getName();

	/**
	 * A registerable actor in the framework which inherits from the
	 * {Backbone.View} class. A view has similar functionality to other actors
	 * in the framework except that it responds to methods via a "respondTo[message]"
	 * hook. It is a simplification of PureMVC view notification interests and
	 * a similar concept to an AS3 plugin to PureMVC called Fabrication.
	 *
	 * To respond to a dispatched message from the framework, create a method
	 * with the prefix "respondTo". If the message being dispatched is a {String}
	 * with the value "someValue" then the method defined in the view would be
	 * named "respondToSomeValue: function (message)" where the message's first
	 * character is always capitalized.
	 *
	 * @extends {Backbone.Model}
	 *
	 * @param {String} name A required name for the model instance
	 * @param {Object} attributes An optional parameter inherited from {Backbone.Model}
	 * @param {Object} options An optional paramter inherited from {Backbone.Model}
	 */
	View = function (name, attributes, options) {
		var func, interest;

		this.name = name;
		this.messageInterests = [];

		for (func in this) {
			if (func.indexOf('respondTo') === 0) {
				interest = func.substring(9);
				interest = interest.charAt(0).toLowerCase() + interest.slice(1);
				this.messageInterests[this.messageInterests.length] = interest;
			}
		}

		Backbone.View.call(this, attributes, options);
	};
	BackMVC.View = View;
	View.extend = Backbone.View.extend;
	_.extend(View.prototype, Actor, Backbone.View.prototype, {
		/**
		 * Retrieve the message interests of this view. See the constructor of
		 * this class for a detailed description of how views respond to messages.
		 * Within the framework this method is only used by the Facade to
		 * determine if a specified message should be dispatched and responded
		 * to by a {View}
		 *
		 * @return {Array} An array of messages the view responds to.
		 */
		getMessageInterests: function () {
			return this.messageInterests;
		}
	});

	if (typeof define === 'function' && define.amd) {
		define(BackMVC);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = BackMVC;
	} else {
		global['BackMVC'] = BackMVC;
	}
}(window));
