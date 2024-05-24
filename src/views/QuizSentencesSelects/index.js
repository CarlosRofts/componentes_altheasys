// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';
import { setOptions, renderTexts } from './buildQuiz';
import initQuiz from './initQuiz';
import { shuffleArray } from '../../utils';

export const html = view;
export const styles = css;

let state = {
	puntos: [0, 0],
	totalInt: 2,
	contInt: 0,
	puntajeObt: 0,
	retros: { mal: ['tienes otro intento', 'mal'], bien: ['bien', 'bien'] },
	correct_options: ['párrafos', 'enlaces', 'type '],
	sentences: [
		'El elemento "p" se utiliza para crear ___',
		'La etiqueta "a" se utiliza para crear ___',
		'El atributo ___ de la etiqueta "input" se utiliza para especificar el tipo de entrada',
	],
	selects: [],
	modbien: {
		html: 'modalbien.html',
		retrotitulo: 'Modal BIEN Titulo lorem ipsum ✔',
		retrotexto: '',
		urlImg: 'default.png',
		audio: 'bien.mp3',
		size: 'md',
	},
	modmal: {
		html: 'modalmal.html',
		retrotitulo: 'Modal MAL Titulo lorem ipsum ❌',
		retrotexto: '',
		urlImg: 'default.png',
		audio: 'mal.mp3',
		size: 'md',
	},
	validatebtn: null,
};

export function init() {
	console.log('js memorygame init');
	state.validatebtn = document.querySelector('#validate');
	renderTexts(state, 'selecciona...');
	setOptions(state, shuffleArray([...state.correct_options]));
	initQuiz(state);
}
