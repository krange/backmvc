describe('Collection', function () {
	var collection, SomeCollection, SomeModel;

	beforeEach(function () {
		SomeModel = Backbone.Model.extend({
		});

		SomeBackMVCModel = BackMVC.Model.extend({
		});
		SomeBackMVCModel.NAME = 'SomeBackMVCModel';

		SomeCollection = BackMVC.Collection.extend({
			model: SomeModel
		});
		SomeCollection.NAME = 'SomeCollection';
	});

	afterEach(function () {
		collection = undefined;
	});

	describe('Instantiation', function () {
		it('name', function() {
			collection = new SomeCollection(SomeCollection.NAME);
			expect(collection.getName()).toBe(SomeCollection.NAME);
		});
	});

	describe('Naming', function () {
		describe('getName', function () {
			it('should have same name property after instantiating with static name string', function() {
				collection = new SomeCollection(SomeCollection.NAME);

				expect(collection.name).toBe(SomeCollection.NAME);
				expect(collection.getName()).toBe(SomeCollection.NAME);
			});

			it('should have same name property after instantiating with dynamic name string', function() {
				collection = new SomeCollection(SomeCollection.NAME + '1');

				expect(collection.name).toBe(SomeCollection.NAME + '1');
				expect(collection.getName()).toBe(SomeCollection.NAME + '1');
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
				collection = new SomeCollection(SomeCollection.NAME);
				collection.registerFacade(facade);

				expect(collection.facade).toBe(facade);
			});

			it('should call onRegister()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				collection = new SomeCollection(SomeCollection.NAME);
				spyOn(collection, 'onRegister');

				collection.registerFacade(facade);
				expect(collection.onRegister).toHaveBeenCalled();
			});
		});

		describe('removeFacade', function () {
			it('should remove the facade property', function() {
				collection = new SomeCollection(SomeCollection.NAME);
				collection.registerFacade(facade);
				collection.removeFacade();

				expect(collection.facade).toBe(undefined);
			});

			it('should call onRemove()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				collection = new SomeCollection(SomeCollection.NAME);
				spyOn(collection, 'onRemove');

				collection.removeFacade();
				expect(collection.onRemove).toHaveBeenCalled();
			});
		});
	});

	describe('Model', function () {
		describe('Backbone.Model', function () {
			it('should add a single pre-defined Model in the constructor correctly', function () {
				var model = new SomeModel();
				collection = new SomeCollection(SomeCollection.NAME, [model]);
				expect(collection.get(model.id)).toBe(model.id);
			});

			it('should add multiple pre-defined Models in the constructor correctly', function () {
				var model, model1, model2;
				model = new SomeModel();
				model1 = new SomeModel();
				model2 = new SomeModel();

				collection = new SomeCollection(SomeCollection.NAME, [model, model1, model2]);

				expect(collection.get(model.id)).toBe(model.id);
				expect(collection.get(model1.id)).toBe(model1.id);
				expect(collection.get(model2.id)).toBe(model2.id);
			});
		});

		describe('BackMVC.Model', function () {
			it('should add a single pre-defined Model in the constructor correctly', function () {
				var model = new SomeBackMVCModel(SomeBackMVCModel.NAME);
				collection = new SomeCollection(SomeCollection.NAME, [model]);
				expect(collection.get(model.id)).toBe(model.id);
			});

			it('should add multiple pre-defined Models in the constructor correctly', function () {
				var model, model1, model2;
				model = new SomeBackMVCModel(SomeBackMVCModel.NAME);
				model1 = new SomeBackMVCModel(SomeBackMVCModel.NAME + '1');
				model2 = new SomeBackMVCModel(SomeBackMVCModel.NAME + '2');

				collection = new SomeCollection(SomeCollection.NAME, [model, model1, model2]);

				expect(collection.get(model.id)).toBe(model.id);
				expect(collection.get(model1.id)).toBe(model1.id);
				expect(collection.get(model2.id)).toBe(model2.id);
			});
		});
	});
});
