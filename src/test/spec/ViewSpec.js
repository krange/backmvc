describe('View', function () {
	var view, SomeView;

	beforeEach(function () {
		SomeView = View.extend();
		SomeView.NAME = 'SomeView';
	});

	afterEach(function () {
		view = undefined;
	});

	describe('Instantiation', function () {
		it('name', function() {
			view = new SomeView(SomeView.NAME);

			expect(view.getName()).toBe(SomeView.NAME);
		});

		it('name and attributes', function() {
			SomeView = View.extend({
				initialize: function (attributes, options) {
					if (attributes.someValue) {
						this.someValueFound = true;
					}
				}
			});
			SomeView.NAME = 'SomeView';

			view = new SomeView(SomeView.NAME, {someValue: 'someValue'});

			expect(view.getName()).toBe(SomeView.NAME);
			expect(view.someValueFound).toBe(true);
		});
	});

	describe('Naming', function () {
		describe('getName', function () {
			it('should have same name property after instantiating with static name string', function() {
				view = new SomeView(SomeView.NAME);

				expect(view.name).toBe(SomeView.NAME);
				expect(view.getName()).toBe(SomeView.NAME);
			});

			it('should have same name property after instantiating with dynamic name string', function() {
				view = new SomeView(SomeView.NAME + '1');

				expect(view.name).toBe(SomeView.NAME + '1');
				expect(view.getName()).toBe(SomeView.NAME + '1');
			});
		});
	});

	describe('Facade', function () {
		var facade;

		beforeEach(function () {
			facade = new Facade();
		});

		afterEach(function () {
			facade = undefined;
		});

		describe('registerFacade', function () {
			it('should set the facade property', function() {
				view = new SomeView(SomeView.NAME);
				view.registerFacade(facade);

				expect(view.facade).toBe(facade);
			});

			it('should call onRegister()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				view = new SomeView(SomeView.NAME);
				spyOn(view, 'onRegister');

				view.registerFacade(facade);
				expect(view.onRegister).toHaveBeenCalled();
			});
		});

		describe('removeFacade', function () {
			it('should remove the facade property', function() {
				view = new SomeView(SomeView.NAME);
				view.registerFacade(facade);
				view.removeFacade();

				expect(view.facade).toBe(undefined);
			});

			it('should call onRemove()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				view = new SomeView(SomeView.NAME);
				spyOn(view, 'onRemove');

				view.removeFacade();
				expect(view.onRemove).toHaveBeenCalled();
			});
		});
	});
});
