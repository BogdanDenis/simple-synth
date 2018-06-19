import Vue from 'vue';
import {
  difference,
  union,
  pull,
} from 'lodash';

import { Key } from './key/key';
import {
  SimpleSynth,
  Looper,
} from '../../modules';

import './keyboard.sass';

const template = `
	<section class="keyboard">
		<ul class="keyboard__visual" ref="historyBoard">
			<li
				v-bind:class="{sharp: note.name.indexOf('#') !== -1 }"
				v-bind:id="note.name"
				v-for="note in playedNotes"
			>
				<ul class="keyboard__visual__col">
					<li
						class="keyboard__visual__col__item"
						v-for="item in note.history"
						:key="item.id"
						v-bind:style="{ height: item.height + 'px', transform: 'translateY(' + item.translate + 'px)' }"
					/>
				</ul>
			</li>
		</ul>
		<ul class="keyboard__keys">
			<key
				v-for="note in notes"
				v-bind:note="note"
				v-bind:onPlay="addPlayedNote"
		  />	
		</ul>
	</section>
`;

const notes = [
	'c0', 'c#0', 'd0', 'd#0', 'e0', 'f0', 'f#0', 'g0', 'g#0', 'a0', 'a#0', 'b0',
	'c1', 'c#1', 'd1', 'd#1', 'e1', 'f1', 'f#1', 'g1', 'g#1', 'a1', 'a#1', 'b1',
	'c2', 'c#2', 'd2', 'd#2', 'e2', 'f2', 'f#2', 'g2', 'g#2', 'a2', 'a#2', 'b2',
	'c3', 'c#3', 'd3', 'd#3', 'e3', 'f3', 'f#3', 'g3', 'g#3', 'a3', 'a#3', 'b3',
	'c4', 'c#4', 'd4', 'd#4', 'e4', 'f4', 'f#4', 'g4', 'g#4', 'a4', 'a#4', 'b4',
	'c5', 'c#5', 'd5', 'd#5', 'e5', 'f5', 'f#5', 'g5', 'g#5', 'a5', 'a#5', 'b5',
  'c6', 'c#6', 'd6', 'd#6', 'e6', 'f6', 'f#6', 'g6', 'g#6', 'a6', 'a#6', 'b6',
  'c7', 'c#7', 'd7', 'd#7', 'e7', 'f7', 'f#7', 'g7', 'g#7', 'a7', 'a#7', 'b7',
  'c8', 'c#8', 'd8', 'd#8', 'e8', 'f8', 'f#8', 'g8', 'g#8', 'a8', 'a#8', 'b8',
];

const keyMapping = {
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
};

const animationSpeed = 1;

export const Keyboard = Vue.component('keyboard', {
	name: 'keyboard',
	template,
	components: { Key },
	data: function() {
		return {
      notes,
      playedNotes: notes.map(note => ({
        name: note,
        quantity: 0,
        history: [],
      })),
			baseNoteIndex: 36,
      keyboardSize: 24,
      pressedKeys: [],
      sustainedKeys: [],
      isSustained: false,
      noteAnimationTimeout: 0,
      looper: new Looper(SimpleSynth),
		};
	},
  computed: {
    pressedAndSustained: function() {
      return union(this.pressedKeys, this.sustainedKeys);
    }
  },
	methods: {
		addPlayedNote: function (playedNote) {
		  if (!playedNote) {
		    return;
      }
			this.playedNotes = this.playedNotes.map(note => ({
				name: note.name,
        history: note.name === playedNote ?
          [...note.history, {
            id: new Date().getTime(),
            height: 5,
            translate: 0,
          }]
          :
          note.history,
				quantity: note.name === playedNote ? note.quantity + 1 : note.quantity,
			}));
		},
    mapKeyToNote: function (key) {
      const supportedKeys = Object.keys(keyMapping);
      if (supportedKeys.indexOf(key) === -1) {
        return;
      }
      const noteIndex = keyMapping[key] + this.baseNoteIndex;
      const playedNote = this.notes[noteIndex];
      return playedNote;
    },
    increasePlayedNotesHeight: function() {
		  this.playedNotes = this.playedNotes.map(playedNote => {
		    if (this.pressedAndSustained.find(key => this.mapKeyToNote(key) === playedNote.name)) {
		      const history = playedNote.history;
          const lastAdded = history[history.length - 1];
          if (lastAdded) {
            lastAdded.height += animationSpeed;
          }
          playedNote.history = history;
        }
        return playedNote;
      });
    },
    moveNoteItemsUp: function() {
      this.playedNotes = this.playedNotes.map(note => {
        const noteHistory = note.history;
        if (!noteHistory) {
          return note;
        }
        const changedHistory = noteHistory.filter(item => {
          return Math.abs(item.translate) - item.height < this.$refs.historyBoard.clientHeight;
        });
        const lastMoved = this.pressedAndSustained.find(key => this.mapKeyToNote(key) === note.name) ?
          changedHistory.length - 1 : changedHistory.length;
        changedHistory.forEach((item, itemIndex) => {
          if (itemIndex < lastMoved) {
            changedHistory[itemIndex].translate -= animationSpeed;
          }
        });
        return {
          ...note,
          history: changedHistory,
        };
      });
    },
    animateNotes: function() {
		  this.noteAnimationTimeout = setTimeout(() => {
        this.increasePlayedNotesHeight();
        this.moveNoteItemsUp();
        this.animateNotes();
      }, 10);
    },
    handleKeyPress: function(key) {
      if (key === 'Control') {
        this.looper.play();
      }
      if (key === 'Enter') {
        this.looper.startRecording();
      }
      if (key === ' ') {
        this.isSustained = true;
        this.sustainedKeys = union(this.sustainedKeys, this.pressedKeys);
      }
      const note = this.mapKeyToNote(key);
      if (!note) {
        return;
      }
      if (!this.pressedAndSustained.find(pressedKey => pressedKey === key)) {
        this.pressedKeys.push(key);
        if (this.isSustained) {
          this.sustainedKeys.push(key);
        }
        this.addPlayedNote(note);
        SimpleSynth.play(note);
      }
    },
    handleKeyRelease: function(key) {
      if (key === 'Shift') {
        this.looper.stopRecording();
      }
      if (key === ' ') {
        this.isSustained = false;
        const notPressedKeys = difference(this.sustainedKeys, this.pressedKeys);
        notPressedKeys.forEach(notPressedKey => {
          const note = this.mapKeyToNote(notPressedKey);
          if (!note) {
            return;
          }
          SimpleSynth.stop(note);
          pull(this.pressedKeys, notPressedKey);
        });
        this.sustainedKeys = [];
      }
      this.pressedKeys = this.pressedKeys.filter(pressedKey => pressedKey !== key);
      if (this.sustainedKeys.find(sustainedKey => sustainedKey === key)) {
        return;
      }
      const note = this.mapKeyToNote(key);
      if (!note) {
        return;
      }
      SimpleSynth.stop(note);
    },
	},
  created: function() {
	  document.addEventListener('keydown', (e) => {
	    const key = e.key;
      this.handleKeyPress(key);
    });

	  document.addEventListener('keyup', (e) => {
	    const key = e.key;
      this.handleKeyRelease(key);
    });

	  this.animateNotes();
  },
});
