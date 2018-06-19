import * as constants from './constants';

export class Looper {
	constructor(audioInterface) {
		this.recordStartTime = null;
		this.isRecording = false;
		this.audioInterface = audioInterface;

		this.decorateAudioInterface();

		this.history = {};
	}

	decorateAudioInterface() {
		const _play = this.audioInterface.play;
		const _stop = this.audioInterface.stop;
		this.originalInterface = {
			play: _play.bind(this.audioInterface),
			stop: _stop.bind(this.audioInterface),
		};
		this.audioInterface.play = function() {
			_play.call(null, ...arguments);
			// TODO: make this part more flexible and developer-friendly
			const note = arguments[0];
			if (!this.isRecording) {
				return;
			}
			if (!this.recordStartTime) {
        this.recordStartTime = new Date().getTime();
      }
			const noteHistory = this.history[note];
			const newHistoryItem = {
				note,
				event: constants.EVENTS.PRESS,
				occurenceTime: new Date().getTime(),
			};
			if (!noteHistory) {
				this.history[note] = [];
			}
			this.history[note].push(newHistoryItem);
		}.bind(this);
		this.audioInterface.stop = function() {
			_stop.call(null, ...arguments);
			// TODO: make this part more flexible and developer-friendly
			const note = arguments[0];
			if (!this.isRecording) {
				return;
			}
			const noteHistory = this.history[note];
			const newHistoryItem = {
				note,
				event: constants.EVENTS.RELEASE,
				occurenceTime: new Date().getTime(),
			};
			if (!noteHistory) {
				this.history[note] = [];
			}
			this.history[note].push(newHistoryItem);
		}.bind(this);
	}

	startRecording() {
		this.isRecording = true;
	}

	normalizeHistoryTime() {
		Object.keys(this.history).forEach((note) => {
			const normalizedNoteHistory = this.history[note].map((noteHistoryItem) => {
				return {
					...noteHistoryItem,
					occurenceTime: noteHistoryItem.occurenceTime - this.recordStartTime,
				};
			});
			this.history[note] = normalizedNoteHistory;
		});
	}

	stopRecording() {
		this.isRecording = false;
		this.normalizeHistoryTime();
		this.recordStopTime = new Date().getTime();
	}

	play() {
		Object.keys(this.history).forEach(note => this.originalInterface.stop(note));
		Object.keys(this.history).forEach((note) => {
			this.history[note].forEach((noteHistoryItem) => {
				setTimeout(() => {
					if (noteHistoryItem.event === constants.EVENTS.PRESS) {
						this.originalInterface.play(note);
					} else if (noteHistoryItem.event === constants.EVENTS.RELEASE) {
						this.originalInterface.stop(note);
					}
				}, noteHistoryItem.occurenceTime);
			});
		});
		setTimeout(() => { this.play() }, this.recordStopTime - this.recordStartTime);
	}

	pause() {

	}

	stop() {

	}
}
