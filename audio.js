const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'BCP-47 language code, e.g. en-US';
const filename = 'resources/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

// Stream the audio to the Google Cloud Speech API
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    console.log(
      `Transcription: ${data.results[0].alternatives[0].transcript}`
    );
  });

// Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
fs.createReadStream(filename).pipe(recognizeStream);