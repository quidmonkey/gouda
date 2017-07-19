var doctrine = require('doctrine');
var fs = require('fs');

var ALLOWED_TAGS = ['arg', 'argument', 'param', 'return', 'returns'];

var file = fs.readFileSync('examples/simple.js', 'utf-8');

function parseDocBlocks(file) {
  var startIndex = 0;
  var endIndex = 0;
  var blocks = [];
  var block = '';

  while (startIndex !== -1 && endIndex !== -1) {
    startIndex = file.indexOf('/**', endIndex);
    endIndex = file.indexOf('*/', startIndex) + 2;
    block = file.substr(startIndex, endIndex - startIndex);

    blocks.push(block);
  }

  return blocks;
}

function getAst(file) {
  return parseDocBlocks(file)
    .map(function(block) {
      return doctrine.parse(block, {
        sloppy: true,
        tags: ALLOWED_TAGS,
        unwrap: true
      });
    });
}

var ast = getAst(file);

console.log('~~~ ast', JSON.stringify(ast, null, 2));
