var coreUtils = require('../../core-utils');

/**
 * Get the JavaScript type string for
 * a wildcard jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript wildcard type
 */
function AllLiteral(tag) {
  return 'any';
}

/**
 * Get the JavaScript type string for
 * a jsDoc ObjectType
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript ObjectType string
 */
function ObjectType(tag) {
  var str = 'Object';

  if (tag.type.expression.type === 'TypeApplication') {
    str = 'Array';
  }

  return str;
}

/**
 * Get the JavaScript type string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript optional type
 */
function OptionalType(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex optionals
  return coreUtils.capitalize(tag.type.expression.name);
}

/**
 * Get the JavaScript type string for
 * an TypeApplication (array) jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript TypeApplication (array) type
 */
function TypeApplication(tag) {
  return coreUtils.capitalize(tag.type.expression.name);
}

/**
 * Get the JavaScript type string for
 * a combination of jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript combination type
 */
function UnionType(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex unions
  return tag.type.elements.reduce(function(str, element, index) {
    if (index === tag.type.elements.length - 1) {
      return str + element.name;
    } else {
      return str + element.name + ', ';
    }
  }, '');
}

/**
 * Get the JavaScript type string for
 * primitive jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              JavaScript primitive type
 */
function base(tag) {
  return coreUtils.capitalize(tag.type.name);
}

var javaScriptSchema = {
  AllLiteral: AllLiteral,
  ObjectType: ObjectType,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = javaScriptSchema;
