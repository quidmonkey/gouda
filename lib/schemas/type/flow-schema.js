var coreUtils = require('../../core-utils');

/**
 * Get the human-readable string for
 * a wildcard jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable wildcard type
 */
function AllLiteral(tag) {
  return ': any';
}

/**
 * Get the human-readable string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  var str;

  // TODO recurse through getTestCheckTypeString for possible array optionals?
  str = '?: ' + tag.type.expression.name;

  if (tag.default) {
    str += ' = ' + tag.default;
  }

  return str;
}

/**
 * Serialize all of an ObjectType tag's applications.
 * This will look for documented object properties.
 * @param  {Object} tag Doctrine tag
 * @return {string}     Serialized tag
 */
function getFlowObjectString(tag) {
  var str = 'Object';

  // does jsDoc exist for individual object properties?
  if (tag.type.applications.length > 0) {
    str = tag.type.applications.reduce(function(str, application, index) {
      str += application.name + coreUtils.getTagSchemaType(application, flowSchema);

      // last element?
      if (index === tag.type.applications.length - 1) {
        str += ' }'
      } else {
        str += ', ';
      }

      return str;
    }, '{ ');
  }

  return str;
}

/**
 * Get the human-readable string for
 * an complex jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable complex type
 */
function TypeApplication(tag) {
  var str = '';

  // TODO recurse through getTestCheckTypeString for possible complex lists
  if (tag.type.expression.name.toLowerCase() === 'array') {
    str = ': Array<' + tag.type.applications[0].name + '>';
  } else if (tag.type.expression.name.toLowerCase() === 'object') {
    if (tag.type.expression.type === 'OptionalType') {
      str = '?'
    }

    str += ': ' + getFlowObjectString(tag);
  }

  return str;
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
    if (index === type.type.elements.length - 1) {
      return str + element.name;
    } else {
      return str + element.name + '| ';
    }
  }, ': ');
}

/**
 * Get the human-readable string for
 * primitive jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable primitive type
 */
function base(tag) {
  return ': ' + tag.type.name;
}

var flowSchema = {
  AllLiteral: AllLiteral,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = flowSchema;
