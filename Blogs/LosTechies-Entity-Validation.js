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
	}
}
