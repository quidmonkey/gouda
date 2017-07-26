// dependencies
var args = require('yargs').argv;
var path = require('path');

// libs
var coreUtils = require('./lib/core-utils');
var typeUtils = require('./lib/type-utils');

var filePath = args.f || args.file || 'examples/sample.js';
var typedFile = typeUtils.annotateFile(filePath);

console.log(typedFile);

coreUtils.writeFile(path.join(coreUtils.GOUDA_DIR, filePath), typedFile);
