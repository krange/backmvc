describe('Collection', function () {
	var collection, SomeCollection;

	beforeEach(function () {
		SomeCollection = BackMVC.Collection.extend({
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
});
