describe('CommandObserver', function () {
	var observer;

	beforeEach(function () {
		observer = new BackMVC.CommandObserver();
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
		var SomeCommand;

		beforeEach(function () {
			SomeCommand = BackMVC.Command.extend({});
		});

		afterEach(function () {
			SomeCommand = undefined;
		});

		it('should register a single command', function() {
			var data;

			expect(observer.register('someMessage', SomeCommand)).toBe(true);

			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
		});

		it('should not register a command class twice to the same message', function() {
			expect(observer.register('someMessage', SomeCommand)).toBe(true);
			expect(observer.register('someMessage', SomeCommand)).toBe(false);

			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
		});

		it('should register a multiple different commands to different messages', function() {
			var data, SomeCommand1, SomeCommand2;
			SomeCommand1 = BackMVC.Command.extend({});
			SomeCommand2 = BackMVC.Command.extend({});

			observer.register('someMessage', SomeCommand);
			observer.register('someMessage1', SomeCommand1);
			observer.register('someMessage2', SomeCommand2);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(3);
		});

		it('should register a multiple different commands to the same message', function() {
			var data, SomeCommand1, SomeCommand2;
			SomeCommand1 = BackMVC.Command.extend({});
			SomeCommand2 = BackMVC.Command.extend({});

			observer.register('someMessage', SomeCommand);
			observer.register('someMessage', SomeCommand1);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
		});

		it('should register a multiple commands of the same command class to the different message', function() {
			var data;

			observer.register('someMessage', SomeCommand);
			observer.register('someMessage1', SomeCommand);
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(2);
		});
	});

	describe('remove', function () {
		var SomeCommand;

		beforeEach(function () {
			SomeCommand = BackMVC.Command.extend({});
		});

		afterEach(function () {
			SomeCommand = undefined;
		});

		it('should remove an already registered command', function() {
			var data;

			observer.register('someMessage', SomeCommand);
			observer.remove('someMessage');
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should not fail if attempting to remove a command that is not registered', function() {
			var data;

			observer.remove('someMessage');
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});

		it('should remove a single already registered command if multiple different commands have been registered', function() {
			var data, SomeCommand1, SomeCommand2;
			SomeCommand1 = BackMVC.Command.extend({});
			SomeCommand2 = BackMVC.Command.extend({});

			observer.register('someMessage', SomeCommand);
			observer.register('someMessage1', SomeCommand1);

			observer.remove('someMessage');
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(1);
		});

		it('should remove a all registered commands to a message if multiple commands have been registered to same message', function() {
			var data, SomeCommand1, SomeCommand2;
			SomeCommand1 = BackMVC.Command.extend({});
			SomeCommand2 = BackMVC.Command.extend({});

			observer.register('someMessage', SomeCommand);
			observer.register('someMessage', SomeCommand1);

			observer.remove('someMessage');
			data = observer.get();

			expect(data).toBeDefined();
			expect(_.size(data)).toBe(0);
		});
	});
});
