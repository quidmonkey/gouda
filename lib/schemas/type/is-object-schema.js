/**
 * Is this AllLiteral an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             False
 */
function AllLiteral(tag) {
  return false;
}

/**
 * Is this ObjectType an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             True
 */
function ObjectType(tag) {
  return true;
}

/**
 * Is this OptionalType an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             True, if it's an object; false, otherwise.
 */
function OptionalType(tag) {
  var name = tag.type.expression.name || '';
  return name.toLowerCase() === 'object';
}

/**
 * Is this TypeApplication an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             True, if it's an object TypeApplication; false, otherwise.
 */
function TypeApplication(tag) {
  return tag.type.applications[0].name.toLowerCase() === 'object';
}

/**
 * Does this UnionType contain an object?
 * This will always return false, because a UnionType
 * will never be flagged as a Gouda object AST.
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             False
 */
function UnionType(tag) {
  return false;
}

/**
 * Is this an object?
 * @param   {Object}    tag       jsDoc tag
 * @return  {boolean}             True, if it's an object; false, otherwise.
 */
function base(tag) {
  return tag.type.name.toLowerCase() === 'object';
}

var isObjectSchema = {
  AllLiteral: AllLiteral,
  ObjectType: ObjectType,
  OptionalType: OptionalType,
  TypeApplication: TypeApplication,
  UnionType: UnionType,
  base: base
};

module.exports = isObjectSchema;
