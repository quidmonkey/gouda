/**
 * Adds two numbers
 * @param  {number} x Any number
 * @param  {number} y Any number
 * @return {number}   Sum
 */
module.exports.add = function add(x, y) {
  return x + y;
}

/**
 * Concat two strings
 * @param  {*}      str1         First string
 * @param  {string} [str2 = '']  Second string
 * @return {string}              Concated string
 */
module.exports.concat = function concat(str1, str2) {
  return str1 + str2;
}

/**
 * Multiply two numbers
 * @param  {number} x Any number
 * @param  {number} y Any number
 * @return {number}   Product
 */
module.exports.multiply = function multiply(x, y) {
  return x * y;
}

/**
 * Logs out a friendly greeting
 * @param  {Object} person Person
 * @param  {string} person.firstName First name of the person
 * @param  {string} person.lastName  Last name of the person
 */
module.exports.sayHi = function sayHi(person) {
  console.log('Hello ' + person.firstName + ' ' + person.lastName);
}

/**
 * Add all the numbers in a list
 * @param  {number[]} numbers List of numbers
 * @return {number}           Sum
 */
module.exports.sum = function sum(numbers) {
  return numbers.reduce(function(sum, number) { return sum + number; }, 0);
}

// intentionally missing jsdoc
function log(foo) {
  console.log('~~~ foo', foo);
}

/**
 * Takes an object with an x and y coordinates
 * @param {Object} vec2             xCoordinate object
 * @param {number} vec2.x           x-coordinate
 * @param {number} vec2.y           y-coordinate
 * @param {number} [vec2.magnitude] Length of vector
 * @return {Object}                 Vec2 with magnitude
 */
module.exports.addMagnitudeProperty = function addMagnitudeProperty(vec2) {
  var clone = Object.assign(vec2);

  clone.magnitude = Math.sqrt(Math.pow(vec2.x, 2) + Math.pow(vec2.y, 2));

  return clone;
}

/**
 * Log an optional string
 * @param  {Object} [foo]       Foo
 * @param  {string} [foo.str]   Foo name
 */
module.exports.logOptional = function logOptional(foo) {
  foo = foo || {};
  console.log(foo.str || '');
}
