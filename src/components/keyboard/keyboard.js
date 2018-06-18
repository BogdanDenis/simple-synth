import Vue from 'vue';
import {
  difference,
  union,
  pull,
} from 'lodash';

import { Key } from './key/key';
import {
  SimpleSynth,
  Piano,
} from '../../modules';
import { NOTES } from '../../modules/piano/constants';

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

const animationSpeed = 1;

export const Keyboard = Vue.component('keyboard', {
	name: 'keyboard',
	template,
	components: { Key },
	data: function() {
		return {
      notes: NOTES,
      playedNotes: NOTES.map(note => ({
        name: note,
        history: [],
      })),
      noteAnimationTimeout: 0,
      piano: new Piano(SimpleSynth),
		};
	},
  computed: {
    
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
			}));
		},
    increasePlayedNotesHeight: function() {
		  this.playedNotes = this.playedNotes.map(playedNote => {
		    if (this.piano.noteIsBeingPlayed(playedNote.name)) {
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
        const lastMoved = this.piano.noteIsBeingPlayed(note.name) ?
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
      this.piano.keyPress(key);
    },
    handleKeyRelease: function(key) {
      this.piano.keyRelease(key);
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

    this.piano.on('onNotePlay', this.addPlayedNote.bind(this));

	  this.animateNotes();
  },
});
