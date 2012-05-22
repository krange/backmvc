describe('ViewObserver', function () {
	var observer;

	beforeEach(function () {
		observer = new ViewObserver();
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
		var view, SomeView;

		beforeEach(function () {
			SomeView = View.extend({});
			SomeView.NAME = 'SomeView';

			view = new SomeView(SomeView.NAME);
		});

		afterEach(function () {
			SomeView = undefined;
			view = undefined;
		});

		it('should register a single view and return the stored view', function() {
			var data, storedView;

			storedView = observer.register(view);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
			expect(storedView).toBeDefined();
			expect(storedView).toBe(view);
		});

		it('should be able to register multiple views', function() {
			var data, SomeView1, view1, SomeView2, view2, storedView,
				storedView1, storedView2;

			SomeView1 = View.extend({});
			SomeView1.NAME = 'SomeView1';
			view1 = new SomeView1(SomeView1.NAME);

			SomeView2 = View.extend({});
			SomeView2.NAME = 'SomeView2';
			view2 = new SomeView2(SomeView2.NAME);

			storedView = observer.register(view);
			storedView1 = observer.register(view1);
			storedView2 = observer.register(view2);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(3);
			expect(storedView).toBeDefined();
			expect(storedView).toBe(view);
			expect(storedView1).toBeDefined();
			expect(storedView1).toBe(view1);
			expect(storedView2).toBeDefined();
			expect(storedView2).toBe(view2);
		});

		it('should be able to register multiple views of the same class with different names', function() {
			var data, view1, view2, storedView, storedView1, storedView2;

			view1 = new SomeView(SomeView.NAME + '1');
			view2 = new SomeView(SomeView.NAME + '2');

			storedView = observer.register(view);
			storedView1 = observer.register(view1);
			storedView2 = observer.register(view2);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(3);
			expect(storedView).toBeDefined();
			expect(storedView).toBe(view);
			expect(storedView1).toBeDefined();
			expect(storedView1).toBe(view1);
			expect(storedView2).toBeDefined();
			expect(storedView2).toBe(view2);
		});
	});

	describe('remove', function () {
		var view, SomeView;

		beforeEach(function () {
			SomeView = View.extend({});
			SomeView.NAME = 'SomeView';

			view = new SomeView(SomeView.NAME);
		});

		afterEach(function () {
			SomeView = undefined;
			view = undefined;
		});

		it('should remove an already registered view', function() {
			var data;

			observer.register(view);
			observer.remove(view.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should not fail if attempting to remove a view that is not registered', function() {
			var data;

			observer.remove(view.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should remove a single already registered view if multiple different view have been registered', function() {
			var data, view1, view2;

			view1 = new SomeView(SomeView.NAME + '1');
			view2 = new SomeView(SomeView.NAME + '2');

			observer.register(view);
			observer.register(view1);
			observer.register(view2);

			observer.remove(view1.getName());
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(2);
		});
	});

	describe('retrieve', function () {
		var view, SomeView;

		beforeEach(function () {
			SomeView = View.extend({});
			SomeView.NAME = 'SomeView';

			view = new SomeView(SomeView.NAME);
		});

		afterEach(function () {
			SomeView = undefined;
			view = undefined;
		});

		it('should retrieve an already registered view', function() {
			var retrievedView;

			observer.register(view);
			retrievedView = observer.retrieve(view.getName());

			expect(retrievedView).toBe(view);
		});

		it('should retrieve an already registered view if multiple views are registered', function() {
			var view1, view2, retrievedView, retrievedView1, retrievedView2;

			view1 = new SomeView(SomeView.NAME + '1');
			view2 = new SomeView(SomeView.NAME + '2');

			observer.register(view);
			observer.register(view1);
			observer.register(view2);

			retrievedView = observer.retrieve(view.getName());
			retrievedView1 = observer.retrieve(view1.getName());
			retrievedView2 = observer.retrieve(view2.getName());

			expect(retrievedView).toBe(view);
			expect(retrievedView1).toBe(view1);
			expect(retrievedView2).toBe(view2);
		});

		it('should not be able to retrieve a view that has been removed', function() {
			var view1, view2, retrievedView;

			view1 = new SomeView(SomeView.NAME + '1');
			view2 = new SomeView(SomeView.NAME + '2');

			observer.register(view);
			observer.register(view1);
			observer.register(view2);

			observer.remove(view1.getName());
			retrievedView = observer.retrieve(view1.getName());

			expect(retrievedView).toBe(undefined);
		});

		it('should not be able to retrieve any view after all have been removed', function() {
			var data, view1, view2, retrievedView, retrievedView1,
				retrievedView2;

			view1 = new SomeView(SomeView.NAME + '1');
			view2 = new SomeView(SomeView.NAME + '2');

			observer.register(view);
			observer.register(view1);
			observer.register(view2);

			observer.remove(view.getName());
			observer.remove(view1.getName());
			observer.remove(view2.getName());

			retrievedView = observer.retrieve(view.getName());
			retrievedView1 = observer.retrieve(view1.getName());
			retrievedView2 = observer.retrieve(view2.getName());

			expect(retrievedView).toBe(undefined);
			expect(retrievedView1).toBe(undefined);
			expect(retrievedView2).toBe(undefined);

			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});
	});
});
