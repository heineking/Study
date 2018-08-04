/**
 * Entity Validation
 * https://lostechies.com/jimmybogard/2007/10/24/entity-validation-with-visitors-and-extension-methods/
 * Ported to JavaScript
 */
{
	class Order {
		constructor(id, customer) {
			this.id = id;
			this.customer = customer;
		}

		validate(out) {
			throw Error("validate not implemented");
		}
	}

	class OrderPersistenceValidator {
		isValid(entity) {
			return [...this.brokenRules(entity)].length > 0
		}
		*brokenRules(entity) {
			if (entity.id < 0)
				yield "id cannot be less than 0.";

			if (entity.customer === "")
				yield "must include a customer.";
		}
	}

	const Validator = {
		validators: {},
		registerFor(entity, validator) {
			Validator.validators[entity.name] = validator;
		}
	}

	Validator.registerFor(Order, new OrderPersistenceValidator());

	const validationMixin = {
		validate(out) {
			const name = this.constructor.name;
			const validator = Validator.validators[name];
			out.errors = [...validator.brokenRules(this)];
			return validator.isValid(this);
		}
	};

	Object.assign(Order.prototype, validationMixin);

	const order = new Order(-1, "");
	const out = { errors: null };

	if (order.validate(out)) {
		console.log(JSON.stringify(out));
		// => {"errors":["id cannot be less than 0.","must include a customer."]}
	}
}

/**
 * A more "functional" port of the order / entity validation approach. The code
 * here is longer but I think there is greater separation of concerns which makes
 * it easier to understand and reason about. I also think there is greater chance
 * for reusability because the validation has been lifted out of the  
 */
{

	const curry = (f, arity = f.length, received = []) => {
		return (...args) => {
			const combined = [...received, ...args];
			const argsLeft = arity - combined.length;
			return argsLeft > 0
				? curry(f, argsLeft, combined)
				: f.apply(null, combined);
		};
	};

	const makeValidator = (message, fn) => {
		const v = (...args) => fn(...args);
		v.message = message;
		return v;
	};

	const isValid = (...validators) => (
		(...args) => validators.reduce((errors, validator) =>
			validator(...args) ? errors : [...errors, validator.message]
		,[])
	);

	const entityValidator = curry((validator, object) => (
		Object.keys(object).reduce((results, key) => ({
			...results,
			[key]: isValid(...(validator[key] || []))(object[key]),
		}), {})
	));

	const not = (fn) => (...args) => !fn(...args);
	const ofType = curry((type, x) => typeof x === type);	
	const greaterThan = curry((n, x) => x > n);
	const defined = (x) => x == null;
	const empty = (x) => x === "";
	const whiteSpace = (x) => x.replace(/\s/g, "") === "";
	const nullOrEmpty = (x) => defined(x) || not(whiteSpace(""));

	const isNumber = makeValidator("must be a number", ofType("number"));
	const isString = makeValidator("must be a string", ofType("string"));	
	const greaterThanZero = makeValidator("must be greater than zero", greaterThan(0));
	const isNotNullOrEmpty = makeValidator("string cannot be null or empty", not(nullOrEmpty));

	const orderValidator = entityValidator({
		id: [isNumber, greaterThanZero],
		customer: [isString, isNotNullOrEmpty]
	});

	const order = {
		id: 0,
		customer: ""
	};

	const validation = orderValidator(order);
	console.log(JSON.stringify(validation, null, 2));
	/*=>
			{
				"id": [
					"must be greater than zero"
				],
				"customer": [
					"string cannot be null or empty"
				]
			}
	*/
}