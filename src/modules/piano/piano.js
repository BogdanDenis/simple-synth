import {
  difference,
  union,
  pull,
} from 'lodash';

import { NOTES } from './constants';

const defaultConfig = {
	keyMapping: {
		'q': 0,   // c
		'2': 1,   // c#
		'w': 2,   // d
		'3': 3,   // d#
		'e': 4,   // e
		'r': 5,   // f
		'5': 6,   // f#
		't': 7,   // g
		'6': 8,   // g#
		'y': 9,   // a
		'7': 10,  // a#
		'u': 11,  // b,
		'z': 12,   // c
		's': 13,   // c#
		'x': 14,   // d
		'd': 15,   // d#
		'c': 16,   // e
		'v': 17,   // f
		'g': 18,   // f#
		'b': 19,   // g
		'h': 20,   // g#
		'n': 21,   // a
		'j': 22,  // a#
		'm': 23,  // b
	},
	baseNote: 'c3',
	sustainKey: ' ',
};

export class Piano {
	constructor(audioInterface, config = {}) {
		this.audioInterface = audioInterface;
		Object.assign(this, defaultConfig, config);

		this.isSustained = false;
		this.pressedAndSustained = [];
		this.pressedKeys = [];
		this.sustainedKeys = [];

		this.observers = {
			onNotePlay: [],
		};
	}

	computePressedAndSustained() {
		this.pressedAndSustained = union(this.pressedKeys, this.sustainedKeys);
	}

	mapKeyToNote(key) {
		const supportedKeys = Object.keys(this.keyMapping);
		if (supportedKeys.indexOf(key) === -1) {
			return;
		}
		const noteIndex = this.keyMapping[key] + NOTES.indexOf(this.baseNote);
		const playedNote = NOTES[noteIndex];
		return playedNote;
	}

	noteIsBeingPlayed(note) {
		return this.pressedAndSustained.find(key => this.mapKeyToNote(key) === note) !== undefined;
	}

	keyPress(key) {
		if (key === this.sustainKey) {
			this.isSustained = true;
			this.sustainedKeys = union(this.sustainedKeys, this.pressedKeys);
			this.computePressedAndSustained();
		}
		const note = this.mapKeyToNote(key);
		if (!note) {
			if (key !== this.sustainKey) {
				console.warn(`Warning! Given key ${key} is not valid!`);
			}
			return;
		}
		if (!this.pressedAndSustained.find(pressedKey => pressedKey === key)) {
			this.pressedKeys.push(key);
			if (this.isSustained) {
				this.sustainedKeys.push(key);
			}
			this.computePressedAndSustained();
			// TODO: notify about new played note
			this.observers['onNotePlay'].forEach(observer => observer(note));
			this.audioInterface.play(note);
		}
	}

	keyRelease(key) {
		if (key === this.sustainKey) {
			this.isSustained = false;
			const notPressedKeys = difference(this.sustainedKeys, this.pressedKeys);
			notPressedKeys.forEach(notPressedKey => {
				const note = this.mapKeyToNote(notPressedKey);
				if (!note) {
					return;
				}
				// TODO: notify about note stopped playing
				this.audioInterface.stop(note);
				pull(this.pressedKeys, notPressedKey);
				this.computePressedAndSustained();
			});
			this.sustainedKeys = [];
		}
		this.pressedKeys = this.pressedKeys.filter(pressedKey => pressedKey !== key);
		this.computePressedAndSustained();
		if (this.sustainedKeys.find(sustainedKey => sustainedKey === key)) {
			return;
		}
		const note = this.mapKeyToNote(key);
		if (!note) {
			return;
		}
		// TODO: notify about note stopped playing
		this.audioInterface.stop(note);
	}

	on(event, callback) {
		this.observers[event].push(callback);
	}
}
