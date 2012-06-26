describe('Actor', function () {
	var actor, facade;

	beforeEach(function () {
		facade = new BackMVC.Facade();
		actor = _.extend({}, BackMVC.Actor);
		actor.registerFacade(facade);
	});

	afterEach(function () {
		actor.removeFacade(facade);
		actor = undefined;
		collection = undefined;
		facade = undefined;
	});

	it('should call the facade.registerModel when this.registerModel is called', function() {
		spyOn(actor.facade, 'registerModel');

		actor.registerModel();

		expect(actor.facade.registerModel).toHaveBeenCalled();
	});

	it('should call the facade.removeModel when this.removeModel is called', function() {
		spyOn(actor.facade, 'removeModel');

		actor.removeModel();

		expect(actor.facade.removeModel).toHaveBeenCalled();
	});

	it('should call the facade.retrieveModel when this.retrieveModel is called', function() {
		spyOn(actor.facade, 'retrieveModel');

		actor.retrieveModel();

		expect(actor.facade.retrieveModel).toHaveBeenCalled();
	});

	it('should call the facade.registerView when this.registerView is called', function() {
		spyOn(actor.facade, 'registerView');

		actor.registerView();

		expect(actor.facade.registerView).toHaveBeenCalled();
	});

	it('should call the facade.removeView when this.removeView is called', function() {
		spyOn(actor.facade, 'removeView');

		actor.removeView();

		expect(actor.facade.removeView).toHaveBeenCalled();
	});

	it('should call the facade.retrieveView when this.retrieveView is called', function() {
		spyOn(actor.facade, 'retrieveView');

		actor.retrieveView();

		expect(actor.facade.retrieveView).toHaveBeenCalled();
	});

	it('should call the facade.registerCommand when this.registerCommand is called', function() {
		spyOn(actor.facade, 'registerCommand');

		actor.registerCommand();

		expect(actor.facade.registerCommand).toHaveBeenCalled();
	});

	it('should call the facade.removeCommand when this.removeCommand is called', function() {
		spyOn(actor.facade, 'removeCommand');

		actor.removeCommand();

		expect(actor.facade.removeCommand).toHaveBeenCalled();
	});
});
