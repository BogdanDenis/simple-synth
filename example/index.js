const SimpleSynth = require('../src/modules/simple-synth/simple-synth');

const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const stopAllBtn = document.querySelector('#stop-all-btn');
let stop;
const pressedKeys = [];

startBtn.addEventListener('click', () => {
  stop = SimpleSynth.play('C#5');
});

stopBtn.addEventListener('click', () => {
  stop();
});

stopAllBtn.addEventListener('click', () => {
  SimpleSynth.stopAll();
});

document.addEventListener('keydown', (e) => {
  if (pressedKeys.indexOf(e.key) !== -1) {
    return;
  }
  switch (e.key) {
    case 'a':
      SimpleSynth.play('c5');
      break;
    case 's':
      SimpleSynth.play('d5');
      break;
    case 'd':
      SimpleSynth.play('e5');
      break;
    case 'f':
      SimpleSynth.play('f5');
      break;
    case 'g':
      SimpleSynth.play('g5');
      break;
    case 'h':
      SimpleSynth.play('a5');
      break;
    case 'j':
      SimpleSynth.play('b5');
      break;
    case 'w':
      SimpleSynth.play('c#5');
      break;
    case 'e':
      SimpleSynth.play('d#5');
      break;
    case 't':
      SimpleSynth.play('f#5');
      break;
    case 'y':
      SimpleSynth.play('g#5');
      break;
    case 'u':
      SimpleSynth.play('a#5');
      break;
  }
  pressedKeys.push(e.key);
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
      SimpleSynth.stop('c5');
      break;
    case 's':
      SimpleSynth.stop('d5');
      break;
    case 'd':
      SimpleSynth.stop('e5');
      break;
    case 'f':
      SimpleSynth.stop('f5');
      break;
    case 'g':
      SimpleSynth.stop('g5');
      break;
    case 'h':
      SimpleSynth.stop('a5');
      break;
    case 'j':
      SimpleSynth.stop('b5');
      break;
    case 'w':
      SimpleSynth.stop('c#5');
      break;
    case 'e':
      SimpleSynth.stop('d#5');
      break;
    case 't':
      SimpleSynth.stop('f#5');
      break;
    case 'y':
      SimpleSynth.stop('g#5');
      break;
    case 'u':
      SimpleSynth.stop('a#5');
      break;
  }
  pressedKeys.splice(pressedKeys.indexOf(e.key), 1);
});
