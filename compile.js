const fs = require('fs');
const path = require('path');
const solc = require('solc');

if(!process.argv[2]) {
    console.log('Error: missing path to Solidity file.');
    return;
}
const pathToSolFiles = path.resolve(__dirname, process.argv[2]);
try {
    const contents = fs.readFileSync(pathToSolFiles, 'utf8');
    const compiledSource = solc.compile(contents, 1);
    module.exports = compiledSource.contracts[':Inbox'];
    // module.exports = compiledSource.contracts[':Inbox'].interface;
} catch(e) {
    console.log(e.message);
}