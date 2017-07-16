// dependencies
var args = require('yargs').argv;
var path = require('path');

// libs
var coreUtils = require('./lib/core-utils');
var testUtils = require('./lib/test-utils');

var filePath = args.f || args.file || 'examples/sample.js';
var testFilePath = filePath.replace('.js', '.spec.js');
var framework = args.framework || testUtils.TEST_FRAMEWORKS.JEST;
var data = coreUtils.getGoudaData(filePath);
var testFile = testUtils.generateTests(framework, filePath, data.goudaAst);

console.log(testFile);

coreUtils.writeFile(path.join(coreUtils.GOUDA_TEST_DIR, filePath), data.file);
coreUtils.writeFile(path.join(coreUtils.GOUDA_TEST_DIR, testFilePath), testFile);
