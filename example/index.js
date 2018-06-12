const SimpleSynth = require('../src/simple-synth/simple-synth');

const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');

startBtn.addEventListener('click', () => {
  SimpleSynth.play(440);
});

stopBtn.addEventListener('click', () => {

});
