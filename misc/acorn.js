var acorn = require('acorn');
var fs = require('fs');

var file = fs.readFileSync('examples/simple.js', 'utf-8');
var ast = acorn.parse(file);

console.log('~~~ ast', JSON.stringify(ast, null, 2));
