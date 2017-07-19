/**
 * Get the human-readable string for
 * a wildcard jsDoc type
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable wildcard type
 */
function AllLiteral(tag) {
  return false;
}

/**
 * Is this OptionalType an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable optional type
 */
function OptionalType(tag) {
  return tag.type.expression.name.toLowerCase() === 'object';
}

/**
 * Is this TypeApplication an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable complex type
 */
function TypeApplication(tag) {
  return tag.type.expression.name.toLowerCase() === 'object';
}

/**
 * Does this UnionType contain an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable combination type
 */
function UnionType(tag) {
  // TODO implement UnionType support
  return false;
}

/**
 * Is this an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {string}              Human-readable primitive type
 */
function base(tag) {
  return tag.type.name.toLowerCase() === 'object';
}

var isObjectSchema = {
  AllLiteral: AllLiteral,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = isObjectSchema;
