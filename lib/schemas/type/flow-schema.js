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
 * a jsDoc ObjectType
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable ObjectType
 */
function ObjectType(tag) {
  var str = '';

  if (tag.type.expression.type === 'OptionalType') {
    str = '?'
  }

  str += ': ' + getFlowObjectString(tag);

  return str;
}

/**
 * Get the human-readable string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  var str = '';

  // array optional?
  // this will never be an object because Gouda creates
  // the object AST, and will flag object OptionalTypes
  // to be handled as a TypeApplication
  if (tag.type.expression.type === 'TypeApplication') {
    str = '?: Array<' + tag.type.expression.applications[0].name + '>';
  } else {
    str = '?: ' + tag.type.expression.name;
  }

  if (tag.default) {
    str += ' = ' + tag.default;
  }

  return str;
}

/**
 * Get the human-readable string for
 * an TypeApplication (array) jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable TypeApplication (array) type
 */
function TypeApplication(tag) {
  return ': Array<' + tag.type.applications[0].name + '>';
}

/**
 * Get the human-readable string for
 * a combination of jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable combination type
 */
function UnionType(tag) {
  return tag.type.elements.reduce(function(str, element, index) {
    var name = '';

    if (element.type === 'TypeApplication') {
      // bit of a hack - re-use the TypeApplication function
      // for complex UnionTypes, but remove the unwanted bits
      name = TypeApplication({ type: element }).replace(': ', '');
    } else {
      name = element.name;
    }

    if (index === tag.type.elements.length - 1) {
      return str + name;
    } else {
      return str + name + ' | ';
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
  ObjectType: ObjectType,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = flowSchema;
