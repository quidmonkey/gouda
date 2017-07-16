const execFile = require('child_process').execFile;
const flow = require('flow-bin');

console.log('~~~ flow', flow);

execFile(flow, ['check'], (err, stdout) => {
    console.log(stdout);
});
