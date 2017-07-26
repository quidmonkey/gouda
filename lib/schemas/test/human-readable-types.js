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
 * a jsDoc ObjectType
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable ObjectType
 */
function ObjectType(tag) {
  return 'object';
}

/**
 * Get the human-readable string for
 * an optional jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex optionals
  return tag.type.expression.name.toLowerCase();
}

/**
 * Get the human-readable string for
 * an TypeApplication (array) jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable TypeApplication (array) type
 */
function TypeApplication(tag) {
  // TODO recurse through getTestCheckTypeString for possible complex lists
  return 'array of ' + tag.type.applications[0].name.toLowerCase();
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
    } else if (index === tag.type.elements.length - 2) {
      return str + element.name + ' or ';
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
  return tag.type.name.toLowerCase();
}

var humanReadableSchema = {
  AllLiteral: AllLiteral,
  ObjectType: ObjectType,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = humanReadableSchema;
