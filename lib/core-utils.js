// dependencies
var _ = require('lodash');
var acorn = require('acorn');
var doctrine = require('doctrine');
var fs = require('fs');
var path = require('path');

// schemas
var isObjectSchema = require('./schemas/type/is-object-schema');

// constants
var ALLOWED_NODE_TYPES = ['FunctionDeclaration', 'FunctionExpression'];
var ALLOWED_TAGS = ['arg', 'argument', 'param', 'return', 'returns'];
var GOUDA_DIR = '.gouda';
var GOUDA_TEST_DIR = '.gouda-test';
var PRIMITIVE_TYPES = ['boolean', 'number', 'string', 'undefined', 'symbol'];

/**
 * Augment an Acorn AST with Acorn block comments
 * @param {Object}    ast      Acorn AST
 * @param {Object[]}  comments Acorn comments
 * @return {Object}            Augmented AST
 */
function addBlockComments(ast, comments) {
  var astClone = _.cloneDeep(ast);
  var blockComments = comments.filter(function(comment) { return comment.type === 'Block'; });

  // TODO add class and method support
  astClone.body = astClone.body
    // handle function expressions i.e. module.exports = function() {}
    .map(function(node) {
      if (
        node.type === 'ExpressionStatement' &&
        ALLOWED_NODE_TYPES.indexOf(node.expression.right.type) !== -1
      ) {
        // update code markers to tie
        // Doctrine AST to Acorn AST
        node.expression.right.start = node.start;
        node.expression.right.end = node.end;

        node = node.expression.right;
      }

      return node;
    })
    // filter out unwanted types from Acorn AST
    .filter(function(node) {
      return ALLOWED_NODE_TYPES.indexOf(node.type) !== -1;
    })
    // filter out any types missing jsDoc
    .filter(function(node) {
      var jsDoc = _.find(blockComments, function(comment) {
        return comment.end === node.start - 1;
      });

      if (jsDoc) {
        jsDoc.ast = parseComments(jsDoc);

        node.comment = jsDoc;

        return true;
      }

      return false;
    });

  return astClone;
}

/**
 * Capitalize a string
 * @param  {string} str Any string
 * @return {str}        Capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reads a file in UTF-8 and returns an object
 * containing the file, an Acorn AST, and a
 * Gouda AST, which is an Acorn AST augmented
 * with a Doctrine AST of jsDoc blocks.
 * @param  {string} filePath File path
 * @return {object}          Augmented Acorn AST
 */
function getGoudaData(filePath) {
  var file = fs.readFileSync(filePath, 'utf-8');
  var comments = [];
  var ast = acorn.parse(file, { onComment: comments });
  var goudaAst = addBlockComments(ast, comments);

  return {
    file: file,
    ast: ast,
    goudaAst: goudaAst
  };
}

/**
 * Get the jsDoc tag type string from a Gouda schema
 * @param  {Object} tag    jsDoc tag
 * @param  {Object} schema Gouda schema
 * @return {string}        Tag type
 */
function getTagSchemaType(tag, schema) {
  var type;

  if (_.isUndefined(schema[tag.type.type])) {
    type = schema.base(tag, getTagSchemaType);
  } else {
    type = schema[tag.type.type](tag);
  }

  return type;
}

/**
 * Parse out an Acorn comment using Doctrine.
 * Custom objects with property documentation
 * are parsed out manually and given their own
 * unique TypeApplication that is similar to
 * Doctrine's Array TypeApplication.
 * @param  {Object} comment Acorn comment
 * @return {Object}         Doctrine AST
 */
function parseComments(comment) {
  var ast = doctrine.parse(comment.value, {
    sloppy: true,
    tags: ALLOWED_TAGS,
    unwrap: true
  });

  // grab all jsDoc object params
  var objects = ast.tags.filter(function(tag) {
    return getTagSchemaType(tag, isObjectSchema);
  });

  objects.forEach(function(object) {
    // grab all jsDoc object params with property params
    var props = ast.tags.filter(function(tag) {
      return tag.name && tag.name.indexOf(object.name + '.') !== -1;
    });

    ast.tags = _.difference(ast.tags, props);

    // remove object name and dot from the @param name
    props = props.map(function(tag) {
      tag.name = tag.name.replace(object.name + '.', '');
      return tag;
    });

    // normalize the object property AST
    object.type = {
      type: 'ObjectType',
      expression: {
        type: object.type.type,
        name: 'object'
      },
      applications: props
    };
  });

  return ast;
}

/**
 * Write a UTF-8 file synchronously and create
 * all sub-directories that don't exist.
 * @param  {string} filePath                File path
 * @param  {string} fileStr                 File string blob
 */
function writeFile(filePath, fileStr) {
  var dirPath = '';

  filePath
    .split(path.sep)
    .slice(0, -1)
    .forEach(function(dir) {
      dirPath = path.join(dirPath, dir);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    });

    fs.writeFileSync(filePath, fileStr);
}

module.exports = {
  ALLOWED_NODE_TYPES: ALLOWED_NODE_TYPES,
  ALLOWED_TAGS: ALLOWED_TAGS,
  GOUDA_DIR: GOUDA_DIR,
  GOUDA_TEST_DIR: GOUDA_TEST_DIR,
  PRIMITIVE_TYPES: PRIMITIVE_TYPES,
  addBlockComments: addBlockComments,
  capitalize: capitalize,
  getGoudaData: getGoudaData,
  getTagSchemaType: getTagSchemaType,
  parseComments: parseComments,
  writeFile: writeFile
}
