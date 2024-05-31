// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';
import selects from '../../css/select.css?raw';
import { initSelects } from '../../libs/select';

import { render, initAct } from './ImageSelects';

export const html = view;
export const styles = css + selects;

let state = {
	imagen_arr: ['img1.png', 'img2.png', 'img1.png'],
	intentosCount: 0,
	completado: false,
	validarBtn: null,
	modbien: {
		html: 'modalbien.html',
		retrotitulo: 'Modal BIEN Titulo lorem ipsum 🌟',
		retrotexto: 'texto lorem ipsum',
		urlImg: 'default.png',
		audio: 'bien.mp3',
		size: 'md',
	},
	modmal: {
		html: 'modalmal.html',
		retrotitulo: 'Modal MAL Titulo lorem ipsum 🌟',
		retrotexto: 'texto lorem ipsum',
		urlImg: 'default.png',
		audio: 'bien.mp3',
		size: 'md',
	},
	settings: {
		puntaje_fallo: 0,
		puntaje: 10,
		corrects_options: ['lorem', 'ipsum', 'dolor'],
		intentos: 2,
	},
};

export function init() {
	console.log('js ImageSelects init');
	state.validarBtn = document.getElementById('validate');
	render(state);
	initAct(state);
}
