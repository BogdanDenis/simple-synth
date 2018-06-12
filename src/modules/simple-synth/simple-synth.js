import * as constants from './constants';

const SimpleSynth = (function() {
  const defaultSettings = {
    type: 'sine',
    fadeTime: 0.05,
  };
  let mergedSettings = {};
  let context = null;

  const playedNotes = [];

  const _init = () => {
    try {
      window.AutioContext = window.AutioContext || window.webkitAudioContext;
      context = new AudioContext();
      mergedSettings = Object.assign({}, defaultSettings);
    } catch (e) {
      throw new Error('Web Audio API is not supported in this browser!');
    }
  };

  const isStringRepresentation = (note) => {
    return typeof note === 'string';
  };

  const isNumericRepresentation = (note) => {
    return typeof note === 'number';
  };

  const getNoteFrequency = (note) => {
    const noteLowerCase = note.toLowerCase();
    let freq = null;
    Object.keys(constants.NOTES).forEach(key => {
      if (key === noteLowerCase) {
        freq = constants.NOTES[key];
      }
    });
    if (!freq) {
      throw new Error('Note is not supported!');
    }
    return freq;
  };

  const init = (settings) => {
    mergedSettings = Object.assign({}, defaultSettings, settings);
  };

  const saveNote = (freq, gain) => {
    const g = gain;
    playedNotes.push({
      freq,
      gain: g,
    });
  };

  const play = (note) => {
    const gain = context.createGain();
    gain.gain.value = 0.2;
    const oscillator = context.createOscillator();
    oscillator.connect(gain);
    oscillator.type = mergedSettings.type;
    let frequency;
    if (isStringRepresentation(note)) {
      frequency = getNoteFrequency(note);
    } else if (isNumericRepresentation(note)) {
      frequency = note;
    } else {
      throw new Error('Note is neither a string nor a number!');
    }
    oscillator.frequency.value = frequency;
    gain.connect(context.destination);
    oscillator.start();
    saveNote(frequency, gain);
    return () => {
      gain.gain.setTargetAtTime(0, context.currentTime, mergedSettings.fadeTime);
    };
  };

  const stopAll = () => {
    playedNotes.forEach(note => {
      note.gain.gain.setTargetAtTime(0, context.currentTime, mergedSettings.fadeTime);
    });
  };

  const stop = (note) => {
    let frequency;
    if (isStringRepresentation(note)) {
      frequency = getNoteFrequency(note);
    } else if (isNumericRepresentation(note)) {
      frequency = note;
    } else {
      throw new Error('Note is neither a string nor a number!');
    }
    playedNotes.forEach(note => {
      if (note.freq === frequency) {
        note.gain.gain.setTargetAtTime(0, context.currentTime, mergedSettings.fadeTime);
      }
    });
  };

  _init();

  return {
    init,
    play,
    stop,
    stopAll,
  };
}());

module.exports = SimpleSynth;
