// import './styles.css';
import view from './index.html?raw';
import css from './styles.css?raw';

export const html = view;
export const styles = css;
// export const scripts = ['https://flbulgarelli.github.io/headbreaker/js/headbreaker.js'];

export function init() {
	initGame();
}
const state = {
	intentos: 1,
	minutos: 1,
	intentosCount: 0,
	modbien: {},
	modmal: {},
	initialWidth: 350,
	width: 400,
	height: 400,
	horizontalPiecesCount: 4,
	verticalPiecesCount: 4,
	complete: false,
	started: false,
};
function initGame() {
	// var audio = new Audio('../audios/retros/ding.mp3');
	let image = new Image();
	image.src = 'img1.png';
	// no funciona la lib, error de painters en vite
	image.onload = () => {
		const canvas = document.querySelector('#canvas');
		console.log(canvas);
		console.log(image);
		// canvas.appendChild(image);
		// debugger
		const hb = new headbreaker.Canvas('canvas', {
			width: state.width,
			height: state.height,
			pieceSize: state.width * 0.19,
			proximity: 5,
			borderFill: 0,
			strokeWidth: 0.5,
			lineSoftness: 0.18,
			image: image,
			strokeColor: 'black',
			outline: new headbreaker.outline.Rounded(),
			preventOffstageDrag: true,
			fixed: true,
			// metadata: {
			// 	DragMode: 'ForceDisconnection',
			// },
		});
		console.log('hb', hb);

		hb.adjustImagesToPuzzleHeight();
		hb.autogenerate({
			horizontalPiecesCount: state.horizontalPiecesCount,
			verticalPiecesCount: state.verticalPiecesCount,
			insertsGenerator: headbreaker.generators.random,
			// metadata: { id: 'meta_autogenerate', targetPosition: { x: 500, y: 500 }, currentPosition: { x: 570, y: 560 } },
		});

		// keyboard
		// hb.registerKeyboardGestures({ 0: (puzzle) => puzzle.forceDisconnectionWhileDragging() });
		// hb.registerKeyboardGestures();
		// simularTeclaAlClicSostenido();

		hb.shuffleGrid();
		hb.draw();

		hb.onConnect((_piece, figure, _target, targetFigure) => {
			// play hb
			// audio.play();

			// paint borders on click
			// of conecting and conected figures
			figure.shape.stroke('yellow');
			targetFigure.shape.stroke('yellow');
			hb.redraw();

			setTimeout(() => {
				// restore border colors
				figure.shape.stroke('black');
				targetFigure.shape.stroke('black');
				hb.redraw();
			}, 200);
			if (!state.started) {
				state.started = true;
				initTemporizador();
			}
		});

		// hb.onDisconnect((it) => {
		// 	// audio.play();
		// });

		hb.attachSolvedValidator();
		hb.onValid(() => {
			// document.querySelector('#canvas').style.pointerEvents = 'none';
			console.log('complete');
			state.complete = true;
			console.log('modbien');
			swal({
				title: '¡Respuesta Correcta!',
				text: '¡Felicitaciones! Has respondido correctamente la pregunta.',
				icon: 'success',
				button: 'Continuar',
			});
			// complete()
		});
		hb.onConnect(() => {
			console.log('connected');
			return;
		});

		// responsive
		let resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(setCanvasSize, 250); // Espera 250ms antes de ejecutar setCanvasSize()
		});
		setCanvasSize();
		function setCanvasSize() {
			const container = document.querySelector('#canvas');

			// Get the container's width and height
			const containerWidth = container.offsetWidth;
			const containerHeight = container.offsetHeight;

			// Calculate the desired aspect ratio (optional, adjust as needed)
			const desiredAspectRatio = state.width / state.height; // Replace with your preferred aspect ratio

			// Determine the new dimensions that fit within the container while maintaining the aspect ratio
			let newWidth, newHeight;
			if (containerWidth / containerHeight > desiredAspectRatio) {
				// Container is wider than desired aspect ratio, adjust height
				newWidth = containerWidth;
				newHeight = containerHeight / desiredAspectRatio;
			} else {
				// Container is taller than desired aspect ratio, adjust width
				newWidth = containerHeight * desiredAspectRatio;
				newHeight = containerHeight;
			}

			// Resize the canvas element
			hb.resize(newWidth, newHeight);

			// Scale the drawing (optional, adjust based on your library's scaling method)
			// Assuming hb.scale expects a single scaling factor:
			hb.scale(Math.min(containerWidth / state.width, containerHeight / state.height)); // Scale to fit while preserving aspect ratio

			// Redraw the canvas content
			hb.redraw();
		}
	};
} // initGame

function timeover() {
	if (!state.complete) {
		// modalmal
		console.log('modmal');
		// mostrar imagen completa
	}
}
const tiempoInicial = Number(state.minutos * 60); // segundos
let tiempoRestante = tiempoInicial;
function initTemporizador() {
	console.log('Temporizador iniciado');
	const temp = setInterval(() => {
		const minutos = Math.floor(tiempoRestante / 60);
		let segundos = tiempoRestante % 60;

		segundos = segundos < 10 ? `0${segundos}` : segundos;

		// console.log(`${minutos}:${segundos}`);
		document.querySelector('.temp-wrapper').classList.remove('d-none');
		const tempEl = document.querySelector('.temporizador');
		tempEl.innerHTML = `
					<span>${minutos}</span> : <span>${segundos}</span>
					`;

		if (tiempoRestante === 0) {
			console.log('¡Tiempo terminado!');
			clearInterval(temp);
			timeover();
		}
		if (state.complete) {
			clearInterval(temp);
			// console.log('tiempoRestante', tiempoRestante);
		}

		tiempoRestante--;
	}, 1000);
}
