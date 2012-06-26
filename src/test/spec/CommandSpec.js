describe('Command', function () {
	var command, SomeCommand;

	beforeEach(function () {
		SomeCommand = BackMVC.Command.extend();
	});

	afterEach(function () {
		command = undefined;
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
				command = new SomeCommand();
				command.registerFacade(facade);

				expect(command.facade).toBe(facade);
			});

			it('should call onRegister()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				command = new SomeCommand();
				spyOn(command, 'onRegister');

				command.registerFacade(facade);
				expect(command.onRegister).toHaveBeenCalled();
			});
		});

		describe('removeFacade', function () {
			it('should remove the facade property', function() {
				command = new SomeCommand();
				command.registerFacade(facade);
				command.removeFacade();

				expect(command.facade).toBe(undefined);
			});

			it('should call onRemove()', function() {
				var stub = jasmine.createSpy('facadeSpy');

				command = new SomeCommand();
				spyOn(command, 'onRemove');

				command.removeFacade();
				expect(command.onRemove).toHaveBeenCalled();
			});
		});
	});
});
