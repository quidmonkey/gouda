var coreUtils = require('../../core-utils');

/**
 * Get the human-readable string for
 * a wildcard jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable wildcard type
 */
function AllLiteral(tag) {
  return 'gen.any';
}

/**
 * Get the human-readable string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex optionals
  return 'gen.oneOf([gen.undefined, gen.' + tag.type.expression.name.toLowerCase() + '])';
}

/**
 * Get the human-readable string for
 * an complex jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable complex type
 */
function TypeApplication(tag) {
  var str = '';

  if (tag.type.expression.name.toLowerCase() === 'array') {
    // TODO recurse through getTestCheckTypeString for possible complex lists
    str = 'gen.array(gen.' + tag.type.applications[0].name.toLowerCase() + ')';
  } else if (tag.type.expression.name.toLowerCase() === 'object') {
    str = 'gen.object({' + getObjectString(tag) + '})';
  }

  return str;
}


/**
 * Get the TestCheck Object type as a string for
 * a jsDoc Object tag
 * @param  {Object}    tag       jsDoc Object tag
 * @return {string}              TestCheck object type string
 */
function getObjectString(tag) {
  var str = '';

  // does jsDoc exist for individual object properties?
  if (tag.type.applications.length > 0) {
    str = tag.type.applications.reduce(function(str, application, index) {
      // str += application.name + ': ' + getTestCheckTypeString(application);
      str += application.name + ': ' + coreUtils.getTagSchemaType(application, testCheckSchema);

      // last element?
      if (index !== tag.type.applications.length - 1) {
        str += ', ';
      }

      return str;
    }, '');
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
    if (index === tag.type.elements.length - 1) {
      return str + element.name + '])';
    } else {
      return str + element.name + ', ';
    }
  }, 'gen.oneOf([');
}

/**
 * Get the human-readable string for
 * primitive jsDoc types
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable primitive type
 */
function base(tag) {
  return 'gen.' + tag.type.name.toLowerCase();
}

var testCheckSchema = {
  AllLiteral: AllLiteral,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = testCheckSchema;
