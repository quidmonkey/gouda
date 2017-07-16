var _ = require('lodash');
var ejs = require('ejs');
var path = require('path');

var coreUtils = require('./core-utils');

var humanReadableSchema = require('./schemas/test/human-readable-types.js');
var javaScriptSchema = require('./schemas/test/javascript-types.js');
var testCheckSchema = require('./schemas/test/testcheck-types.js');

var TEST_IMPORT_NAME = 'gouda';
var TEST_FRAMEWORKS = {
  AVA: 'ava',
  JASMINE: 'jasmine',
  JEST: 'jest',
  MOCHA: 'mocha'
};

/**
 * Takes a Gouda AST and generates a file string blob
 * of generative unit tests using testcheck.js
 * @param  {string} type      Testing framework type
 * @param  {string} filePath  File path
 * @param  {object} ast       Gouda AST
 * @return {string}           Filestring blob of generative unit tests
 */
function generateTests(type, filePath, ast) {
  var str = getImportsString(type, filePath);

  ast.body.forEach(function(node) {
    str += generateUnitTest(type, node.id.name, node.comment.ast.tags);
  });

  return str;
}

/**
 * Generate a unit test string using
 * TestCheck generative testing. The unit test
 * is rendered using ejs templates.
 * @param  {string} type    Testing framework type
 * @param  {string} name    Name of the function to be tested
 * @param  {Object[]} tags  Set of jsDoc tags for the function
 * @return {string}         Unit test
 */
function generateUnitTest(type, name, tags) {
  var args = tags.filter(function(tag) {
    return tag.title !== 'return';
  });
  var returnTag = _.find(tags, { title: 'return' });

  // TODO remove this once generative testing is more robust
  if (_.isUndefined(returnTag)) {
    console.warn('~~~ Function ' + name + ' does not return anything. Skipping...');
    return '';
  }

  var data = {
    PRIMITIVE_TYPES: coreUtils.PRIMITIVE_TYPES,
    name: name,
    testImportName: TEST_IMPORT_NAME,
    returnType: coreUtils.getTagSchemaType(returnTag, javaScriptSchema),
    genTypes: getGenerativeTypesString(args),
    paramNames: getNamesString(args),
    paramTypes: getTypesString(args)
  };
  var filePath = '';
  var unitTest = '';

  switch (type) {
    case TEST_FRAMEWORKS.JASMINE:
    case TEST_FRAMEWORKS.JEST:
      filePath = 'lib/templates/test/bdd-unit-test.ejs';
      break;
    case TEST_FRAMEWORKS.AVA:
      filePath = 'lib/templates/test/ava-unit-test.ejs';
      break;
    case TEST_FRAMEWORKS.MOCHA:
      filePath = 'lib/templates/test/mocha-unit-test.ejs';
      break;
    default:
      throw new Error('Unsupported testing framework ' + type + ' found. Aborting...');
  }

  ejs.renderFile(filePath, data, null, function(err, str) {
    if (err) {
      throw new Error(err);
    }
    unitTest = str;
  });

  return unitTest;
};

/**
 * Get a comma-separated string of generative
 * data types for a set of jsDoc tags.
 * @param  {Object[]} tags Set of jsDoc tags
 * @return {string}        Generative data types
 */
function getGenerativeTypesString(tags) {
  return tags.reduce(function(str, tag, index) {
    // var type = getTestCheckTypeString(tag);
    var type = coreUtils.getTagSchemaType(tag, testCheckSchema);
    return index !== tags.length - 1 ? str + type + ', ' : str + type;
  }, '');
}

/**
 * Generate the imports string for the generative
 * test file. The imports string is generated using
 * ejs templates.
 * @param  {string} type     Testing framework type
 * @param  {string} filePath File path
 * @return {string}          Imports string
 */
function getImportsString(type, filePath) {
  var data = {
    testImportName: TEST_IMPORT_NAME,
    fileName: path.basename(filePath)
  };
  var imports = '';
  var filePath = '';

  switch (type) {
    case TEST_FRAMEWORKS.JASMINE:
    case TEST_FRAMEWORKS.JEST:
      filePath = 'lib/templates/test/bdd-imports.ejs';
      break;
    case TEST_FRAMEWORKS.AVA:
      filePath = 'lib/templates/test/ava-imports.ejs';
      break;
    case TEST_FRAMEWORKS.MOCHA:
      filePath = 'lib/templates/test/mocha-imports.ejs';
      break;
    default:
      throw new Error('Unsupported testing framework ' + type + ' found. Aborting...');
  }

  ejs.renderFile(filePath, data, null, function(err, str) {
    if (err) {
      throw new Error(err);
    }
    imports = str;
  });

  return imports;
}

/**
 * Get a comma-separated string of names
 * for a set of jsDoc tags
 * @param  {Object[]} tags Set of jsDoc tags
 * @return {string}        Names
 */
function getNamesString(tags) {
  return tags.reduce(function(str, tag, index) {
    return index !== tags.length - 1 ? str + tag.name + ', ' : str + tag.name;
  }, '');
}

/**
 * Get a human-readable string of tag types
 * for a set of jsDoc tags.
 * @param  {Object[]} tags Set of jsDoc tags
 * @return {string}        Tag types
 */
function getTypesString(tags) {
  return tags.reduce(function(str, tag, index) {
    // var name = getHumanReadableType(tag);
    var name = coreUtils.getTagSchemaType(tag, humanReadableSchema);

    if (index === tags.length - 1) {
      str += name;
    } else if (index === tags.length - 2) {
      str += name + ' and ';
    } else {
      str += name + ', ';
    }

    return str;
  }, '');
}

module.exports = {
  TEST_FRAMEWORKS: TEST_FRAMEWORKS,
  TEST_IMPORT_NAME: TEST_IMPORT_NAME,
  generateTests: generateTests,
  generateUnitTest: generateUnitTest,
  getGenerativeTypesString: getGenerativeTypesString,
  getImportsString: getImportsString,
  getNamesString: getNamesString,
  getTypesString: getTypesString
};
