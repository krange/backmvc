describe('ModelObserver', function () {
	var observer;

	beforeEach(function () {
		observer = new ModelObserver();
	});

	afterEach(function () {
		observer = undefined;
	});

	describe('get', function () {
		it('should be defined after instantiation', function() {
			var data = observer.get();
			expect(data).toBeDefined();
		});
	});

	describe('register', function () {
		var model, SomeModel;

		beforeEach(function () {
			SomeModel = Model.extend({});
			SomeModel.NAME = 'SomeModel';

			model = new SomeModel(SomeModel.NAME);
		});

		afterEach(function () {
			SomeModel = undefined;
			model = undefined;
		});

		it('should register a single model and return the stored model', function() {
			var data, storedModel;

			storedModel = observer.register(model);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
			expect(storedModel).toBeDefined();
			expect(storedModel).toBe(model);
		});

		it('should be able to register multiple models', function() {
			var data, SomeModel1, model1, SomeModel2, model2, storedModel,
				storedModel1, storedModel2;

			SomeModel1 = Model.extend({});
			SomeModel1.NAME = 'SomeModel1';
			model1 = new SomeModel1(SomeModel1.NAME);

			SomeModel2 = Model.extend({});
			SomeModel2.NAME = 'SomeModel2';
			model2 = new SomeModel2(SomeModel2.NAME);

			storedModel = observer.register(model);
			storedModel1 = observer.register(model1);
			storedModel2 = observer.register(model2);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(3);
			expect(storedModel).toBeDefined();
			expect(storedModel).toBe(model);
			expect(storedModel1).toBeDefined();
			expect(storedModel1).toBe(model1);
			expect(storedModel2).toBeDefined();
			expect(storedModel2).toBe(model2);
		});

		it('should be able to register multiple models of the same class with different names', function() {
			var data, model1, model2, storedModel, storedModel1, storedModel2;

			model1 = new SomeModel(SomeModel.NAME + '1');
			model2 = new SomeModel(SomeModel.NAME + '2');

			storedModel = observer.register(model);
			storedModel1 = observer.register(model1);
			storedModel2 = observer.register(model2);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(3);
			expect(storedModel).toBeDefined();
			expect(storedModel).toBe(model);
			expect(storedModel1).toBeDefined();
			expect(storedModel1).toBe(model1);
			expect(storedModel2).toBeDefined();
			expect(storedModel2).toBe(model2);
		});
	});

	describe('remove', function () {
		var model, SomeModel;

		beforeEach(function () {
			SomeModel = Model.extend({});
			SomeModel.NAME = 'SomeModel';

			model = new SomeModel(SomeModel.NAME);
		});

		afterEach(function () {
			SomeModel = undefined;
			model = undefined;
		});

		it('should remove an already registered model', function() {
			var data;

			observer.register(model);
			observer.remove(model.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should not fail if attempting to remove a model that is not registered', function() {
			var data;

			observer.remove(model.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should remove a single already registered model if multiple different model have been registered', function() {
			var data, model1, model2;

			model1 = new SomeModel(SomeModel.NAME + '1');
			model2 = new SomeModel(SomeModel.NAME + '2');

			observer.register(model);
			observer.register(model1);
			observer.register(model2);

			observer.remove(model1.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(2);
		});
	});

	describe('retrieve', function () {
		var model, SomeModel;

		beforeEach(function () {
			SomeModel = Model.extend({});
			SomeModel.NAME = 'SomeModel';

			model = new SomeModel(SomeModel.NAME);
		});

		afterEach(function () {
			SomeModel = undefined;
			model = undefined;
		});

		it('should retrieve an already registered model', function() {
			var retrievedModel;

			observer.register(model);
			retrievedModel = observer.retrieve(model.getName());

			expect(retrievedModel).toBe(model);
		});

		it('should retrieve an already registered model if multiple models are registered', function() {
			var model1, model2, retrievedModel, retrievedModel1, retrievedModel2;

			model1 = new SomeModel(SomeModel.NAME + '1');
			model2 = new SomeModel(SomeModel.NAME + '2');

			observer.register(model);
			observer.register(model1);
			observer.register(model2);

			retrievedModel = observer.retrieve(model.getName());
			retrievedModel1 = observer.retrieve(model1.getName());
			retrievedModel2 = observer.retrieve(model2.getName());

			expect(retrievedModel).toBe(model);
			expect(retrievedModel1).toBe(model1);
			expect(retrievedModel2).toBe(model2);
		});

		it('should not be able to retrieve a model that has been removed', function() {
			var model1, model2, retrievedModel;

			model1 = new SomeModel(SomeModel.NAME + '1');
			model2 = new SomeModel(SomeModel.NAME + '2');

			observer.register(model);
			observer.register(model1);
			observer.register(model2);

			observer.remove(model1.getName());
			retrievedModel = observer.retrieve(model1.getName());

			expect(retrievedModel).toBe(undefined);
		});

		it('should not be able to retrieve any model after all have been removed', function() {
			var data, model1, model2, retrievedModel, retrievedModel1,
				retrievedModel2;

			model1 = new SomeModel(SomeModel.NAME + '1');
			model2 = new SomeModel(SomeModel.NAME + '2');

			observer.register(model);
			observer.register(model1);
			observer.register(model2);

			observer.remove(model.getName());
			observer.remove(model1.getName());
			observer.remove(model2.getName());

			retrievedModel = observer.retrieve(model.getName());
			retrievedModel1 = observer.retrieve(model1.getName());
			retrievedModel2 = observer.retrieve(model2.getName());

			expect(retrievedModel).toBe(undefined);
			expect(retrievedModel1).toBe(undefined);
			expect(retrievedModel2).toBe(undefined);

			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});
	});
});
