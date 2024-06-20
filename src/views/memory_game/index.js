// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';
import Phaser from 'phaser';
import Game from './game';
import Preloader from './preloader';
export const html = view;
export const styles = css;

const state = {
	pares: [
		[1, 0, 3],
		[2, 4, 1],
		[3, 4, 2],
	],
	intentos: 2,
	puntaje: [10, 5],
	sprites: ['/textures/char1_64.png', '/textures/char2_64.png'],
	assets: ['/textures/box.png'],
	tilemaps: ['/textures/bg_tiled/Grass.png', '/textures/bg_tiled/tileset.png', '/textures/bg_tiled/bg_memo.tmj'],
	imagen_arr: ['/textures/imagen1.png', '/textures/imagen2.png', '/textures/imagen3.png', '/textures/imagen4.png', '/textures/imagen5.png'],
	intentos: 2,
	intentosCount: 0,
	puntaje: [10, 5],
	navbar_mt: 70,
	tiempo: 2,
};

export function init() {
	console.log('js memorygame init');
	const container = document.querySelector('#phaser');
	// debugger;
	const config = {
		parent: 'phaser',
		type: Phaser.AUTO,
		width: container.offsetWidth,
		height: window.innerHeight,
		physics: {
			default: 'arcade',
			arcade: {
				debug: true,
				gravity: { y: 0 },
			},
		},
		// scale: {
		// 	mode: Phaser.AUTO,
		// 	autoCenter: true,
		// 	parent: 'phaser',
		// },
		scene: [new Preloader(state), new Game(state)],
	};

	swal({
		title: 'Instrucciones',
		text: 'Usa las teclas de dirección, el teclado o los dedos para moverte y encuentra los pares.',
		icon: 'info',
		button: 'Continuar',
	}).then((value) => {
		const phaser = new Phaser.Game(config);
	});
}
