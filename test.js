const record = require('node-record-lpcm16')
const fs = require('fs')

var file = fs.createWriteStream('resources/test.wav',{encoding:'binary'});

record.start({
    sampleRate: 44100,
    verbose: true,
    recordProgram: 'rec'
}).pipe(file);
setTimeout(() => {
    record.stop();
}, 10000)