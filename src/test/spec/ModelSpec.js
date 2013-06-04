describe('Model', function () {
	var model, SomeModel;

	beforeEach(function () {
		SomeModel = BackMVC.Model.extend({
		});
		SomeModel.NAME = 'SomeModel';
	});

	afterEach(function () {
		model = undefined;
	});

	describe('Instantiation', function () {
		it('name', function() {
			model = new SomeModel(SomeModel.NAME);

			expect(model.getName()).toBe(SomeModel.NAME);
		});

		it('name and attributes', function() {
			model = new SomeModel(SomeModel.NAME, {someValue: 'someValue'});

			expect(model.getName()).toBe(SomeModel.NAME);
			expect(model.get('someValue')).toBe('someValue');
		});

		xit('name, attributes and options', function() {
			model = new SomeModel(SomeModel.NAME, {someValue: 'someValue'});

			expect(model.getName()).toBe(SomeModel.NAME);
			expect(model.get('someValue')).toBe('someValue');
		});
	});

	describe('Naming', function () {
		describe('getName', function () {
			it('should have same name property after instantiating with static name string', function() {
				model = new SomeModel(SomeModel.NAME);

				expect(model.name).toBe(SomeModel.NAME);
				expect(model.getName()).toBe(SomeModel.NAME);
			});

			it('should have same name property after instantiating with dynamic name string', function() {
				model = new SomeModel(SomeModel.NAME + '1');

				expect(model.name).toBe(SomeModel.NAME + '1');
				expect(model.getName()).toBe(SomeModel.NAME + '1');
			});
		});
	});

	describe('Facade', function () {
		var facade;

		beforeEach(function () {
			facade = new BackMVC.Facade();
		});

		afterEach(function () {
			facade = undefined;
		});

		describe('registerFacade', function () {
			it('should set the facade property', function() {
				model = new SomeModel(SomeModel.NAME);
				model.registerFacade(facade);

				expect(model.facade).toBe(facade);
			});

			it('should call onRegister()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				model = new SomeModel(SomeModel.NAME);
				spyOn(model, 'onRegister');

				model.registerFacade(facade);
				expect(model.onRegister).toHaveBeenCalled();
			});
		});

		describe('removeFacade', function () {
			it('should remove the facade property', function() {
				model = new SomeModel(SomeModel.NAME);
				model.registerFacade(facade);
				model.removeFacade();

				expect(model.facade).toBe(undefined);
			});

			it('should call onRemove()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				model = new SomeModel(SomeModel.NAME);
				spyOn(model, 'onRemove');

				model.removeFacade();
				expect(model.onRemove).toHaveBeenCalled();
			});
		});

		describe('registerModel', function () {
			it('should register a model', function () {
				var registeredModel;
				model = new SomeModel(SomeModel.NAME);
				registeredModel = facade.registerModel(model);

				expect(registeredModel).toBe(model);
			});
		});
	});
});
