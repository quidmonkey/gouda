// dependencies
var acorn = require('acorn');
var args = require('yargs').argv;
var doctrine = require('doctrine');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

// constants
var GOUDA_DIR = '.gouda';
var ALLOWED_TAGS = ['arg', 'argument', 'param', 'return', 'returns'];

// globals
var fileName = args.f || args.file || 'examples/sample.js';
var file = fs.readFileSync(fileName, 'utf-8');
var comments = [];
var ast = acorn.parse(file, { onComment: comments });

/**
 * Augment an Acorn AST with Acorn block comments
 * @param {object} ast      Acorn AST
 * @param {array} comments  Acorn comments
 * @return {object}         Augmented AST
 */
function addBlockComments(ast, comments) {
  var astClone = _.cloneDeep(ast);
  var blockComments = comments.filter(function(comment) { return comment.type === 'Block'; });

  astClone.body = astClone.body
    .filter(function(node) { return node.type === 'FunctionDeclaration'; })
    .filter(function(node) {
      var comment = _.find(blockComments, function(comment) { return comment.end === node.start - 1; });

      if (comment) {
        comment.ast = parseComments(comment);

        node.comment = comment;

        return true;
      }

      return false;
    });

  return astClone;
}

/**
 * Parse out an Acorn comment using Doctrine.
 * Custom objects with property documentation
 * are parsed out manually and given their own
 * unique TypeApplication that is similar to
 * Doctrine's Array TypeApplication.
 * @param  {object} comment Acorn comment
 * @return {object}}        Doctrine AST
 */
function parseComments(comment) {
  var ast = doctrine.parse(comment.value, {
    sloppy: true,
    tags: ALLOWED_TAGS,
    unwrap: true
  });
  var objects = ast.tags.filter(function(tag) {
    return tag.type.name && tag.type.name.toLowerCase() === 'object';
  });

  objects.forEach(function(object) {
    var props = ast.tags.filter(function(tag) {
      return tag.name.indexOf(object.name + '.') !== -1;
    });

    ast.tags = _.difference(ast.tags, props);

    props = props.map(function(tag) {
      tag.name = tag.name.replace(object.name + '.', '');
      return tag;
    });

    object.type = {
      type: 'TypeApplication',
      expression: {
        type: object.type.type,
        name: object.type.name
      },
      applications: props
    };
  });

  return ast;
}

/**
 * Annotate a file with Flow typing
 * @param {string} file File to annotate
 * @param {object} ast  Augmented Acorn AST of file
 * @return {string}     Annotated file
 */
function addFlowTyping(file, ast) {
  var typedFile = file;
  var offset = 0;

  ast.body.forEach(function(node) {
    var end = 0;

    node.comment.ast.tags.forEach(function(tag) {
      var param = _.find(node.params, { 'name': tag.name });
      var tagType = getTagType(tag);

      // set substring marker
      if (tag.title === 'return') {
        // find the closing parenthesis
        end = typedFile.indexOf(')', _.last(node.params).end + offset) + 1;
        // end = _.last(node.params).end + offset + 1;
      } else {
        end = param.end + offset;
      }

      // add param type
      typedFile = typedFile.substr(0, end) + tagType + typedFile.substr(end);

      // offset the file string by added param type substring
      offset += tagType.length;
    });
  });

  // add flow annotation
  return '// @flow\n' + typedFile;
}

/**
 * Get the Flow type for a Doctrine tag
 * Supports: Optional Params (With Defaults),
 *  Array Types, Union Types, Primitives, Any Types,
 *  Object Types
 * @param  {object} tag Doctrine Tag AST
 * @return {string}     Flow type
 */
function getTagType(tag) {
  var tagType;

  switch(tag.type.type) {
    case 'AllLiteral':
      tagType = ': any';
      break;
    case 'OptionalType':
      tagType = '?: ' + tag.type.expression.name;

      if (tag.default) {
        tagType += ' = ' + tag.default;
      }

      break;
    case 'TypeApplication':
      if (tag.type.expression.name === 'Array') {
        tagType = ': Array<' + tag.type.applications[0].name + '>';
      } else if (tag.type.expression.name === 'object') {
        tagType = ': ' + getTagObjString(tag);
      }
      break;
    case 'UnionType':
      tag.type.elements.forEach(function(element) {
        tagType = tagType ? tagType + ' | ' : ': ';
        tagType += element.name;
      });
      break;
    default:
      tagType = ': ' + tag.type.name;
  }

  return tagType;
}

/**
 * Serial all of an ObjectType tag's applications
 * @param  {object} tag Doctrine tag
 * @return {string}     Serialized tag
 */
function getTagObjString(tag) {
  var str = tag.type.applications.reduce(function(str, application, index) {
    str += application.name + getTagType(application);

    // last element?
    if (index !== tag.type.applications.length - 1) {
      str += ', ';
    }

    return str;
  }, '{ ');

  return str + ' }';
}


var augmentedAst = addBlockComments(ast, comments);
var typedFile = addFlowTyping(file, augmentedAst);

// console.log('~~~ comments', comments);
// console.log('~~~ augmentedAst', JSON.stringify(augmentedAst, null, 2));
console.log('~~~ typedFile', typedFile);

fs.writeFileSync(path.join(GOUDA_DIR, fileName), typedFile);
