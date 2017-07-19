
/**
 * Concat two strings
 * @param  {Object} [foo]       Foo
 * @param  {string} [foo.str]   Foo name
 */
module.exports.logTwo = function logTwo(foo) {
  foo = foo || {};
  console.log(foo.str || '');
}
