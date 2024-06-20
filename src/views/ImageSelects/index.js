// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';
import selects from '../../css/select.css?raw';
import { initSelects } from '../../libs/select';

import { render, initAct } from './ImageSelects';

export const html = view;
export const styles = css + selects;

let state = {
	imagen_arr: ['grafica_col.png', 'gráficos_de_líneas.png', 'grafica_circular.png'],
	intentosCount: 0,
	completado: false,
	validarBtn: null,
	settings: {
		puntaje_fallo: 0,
		puntaje: 10,
		corrects_options: ['Gráficos de columnas', 'Gráficos de líneas', 'Gráficos circulares'],
		intentos: 2,
	},
};

export function init() {
	console.log('js ImageSelects init');
	state.validarBtn = document.getElementById('validate');
	render(state);
	initAct(state);
}
