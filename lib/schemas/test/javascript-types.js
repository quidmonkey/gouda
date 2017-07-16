var coreUtils = require('../../core-utils');

/**
 * Get the human-readable string for
 * a wildcard jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable wildcard type
 */
function AllLiteral(tag) {
  return 'any';
}

/**
 * Get the human-readable string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex optionals
  return coreUtils.capitalize(tag.type.expression.name);
}

/**
 * Get the human-readable string for
 * an complex jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable complex type
 */
function TypeApplication(tag) {
  return coreUtils.capitalize(tag.type.expression.name);
}

/**
 * Get the human-readable string for
 * a combination of jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable combination type
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
 * Get the human-readable string for
 * primitive jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable primitive type
 */
function base(tag) {
  return tag.type.name;
}

var javaScriptSchema = {
  AllLiteral: AllLiteral,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = javaScriptSchema;
