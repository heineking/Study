// Higher Order Functions
var not = function (pred) { return function (n) { return !pred(n); }; };
var matches = function (regex) { return function (n) { return regex.test(n); }; };
// validators
var nullOrEmpty = function (s) { return s === "" || s === null; };
var exists = function (n) { return typeof n !== 'undefined'; };
var required = function (val) { return [
    exists,
    not(nullOrEmpty)
].every(function (pred) { return pred(val); }); };
var digits = function (n) { return matches(new RegExp("^\\d{" + n + "}$")); };
var selectors = {
    memberNumber: '#memberNumber',
    birthYear: '#birthYear',
    birthDay: '#birthDay'
};
var rules = {
    memberNumber: [required, digits(9)],
    birthDay: [required],
    birthYear: [required]
};
var runValidation = function () { return Object
    .keys(selectors)
    .every(function (key) {
    var val = $(selectors[key]).val();
    return rules[key].every(function (rule) { return rule(val); });
}); };
$("#theForm").submit(runValidation);
