const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Imports the file
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'BCP-47 language code, e.g. en-US';

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
// const languageCode = 'en-US';
const languageCode = 'vi-VN';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  );

var file = fs.createWriteStream('resources/test.wav', {encoding: 'binary'});
// Start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .on('error', console.error)
  // .on('data', data => {
  //     // console.log("data:" + data.toString("base64"));
  //     console.log("data:" + data.length)
  // } )
  // .pipe(file)
  // .on('data', data => {
  //   console.log("DONE:" + data.length);
  // });
  .pipe(recognizeStream);
console.log('Listening, press Ctrl+C to stop.');
setTimeout(() => {
  record.stop();
  console.log("STOPED");
}, 5000);