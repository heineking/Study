// src: https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3

function test(component, fn, count = 1) {
	console.log(`# ${component}`);
	fn({
		same(actual, expected, msg) {
			if (actual == expected) {
				console.log(`ok ${count} - ${msg}`);
			} else {
				throw new Error(
				`not ok ${count} - ${msg}
					expected:
						${expected}	
					actual:
						${actual}
				`);
			}
			++count;
		}
	});
};