var _ = require('lodash');

var coreUtils = require('./core-utils');

var flowSchema = require('./schemas/type/flow-schema');

/**
 * Annotate a file with Flow typing
 * @param {string} file File to annotate
 * @param {Object} ast  Augmented Acorn AST of file
 * @return {string}     Annotated file
 */
function addFlowTyping(file, ast) {
  var typedFile = file;
  var offset = 0;

  // for each function expression
  ast.body.forEach(function(node) {
    var end = 0;

    // for each jsDoc tag
    node.comment.ast.tags.forEach(function(tag) {
      // find corresponding ast data on the param
      var param = _.find(node.params, { 'name': tag.name });
      var tagType = coreUtils.getTagSchemaType(tag, flowSchema);

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
 * Reads a file in UTF-8 and returns a filestring blob
 * of a Flow annotated version of the file
 * @param  {string}  filePath File path
 * @return {string}           Filestring blob with Flow annotations
 */
function annotateFile(filePath) {
  var data = coreUtils.getGoudaData(filePath);
  return addFlowTyping(data.file, data.goudaAst);
}

module.exports = {
  addFlowTyping: addFlowTyping,
  annotateFile: annotateFile
};
