import Vue from 'vue';

import { Key } from './key/key';
import { SimpleSynth } from '../../modules';

import './keyboard.sass';

const template = `
	<section class="keyboard">
		<ul class="keyboard__visual">
			<li
				v-bind:class="{sharp: note.name.indexOf('#') !== -1 }"
				v-for="note in playedNotes"
			>
				<ul class="keyboard__visual__col">
					<li
						class="keyboard__visual__col__item"
						v-for="index in note.quantity"
					></li>
				</ul>
			</li>
		</ul>
		<ul class="keyboard__keys">
			<key
				v-for="note in notes"
				v-bind:note="note"
				v-bind:onPlay="addPlayedNote"
			></key>
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
			})),
		};
	},
	methods: {
		addPlayedNote: function (playedNote) {
			this.playedNotes = this.playedNotes.map(note => ({
				name: note.name,
				quantity: note.name === playedNote ? note.quantity + 1 : note.quantity,
			}));
		},
    mapKeyToNote: function (key) {

    },
	},
  created: function() {
	  document.addEventListener('keydown', (e) => {
      console.log(e.key);
    });
  },
});
