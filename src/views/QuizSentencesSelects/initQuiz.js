import swal from 'sweetalert';

export default function initQuiz(state) {
	const { selects, modmal, modbien, retrosBien, retrosMal, correct_options, validatebtn } = state;
	validatebtn.addEventListener('click', function () {
		intentar(compararRespuestas());
	});

	function compararRespuestas() {
		let response = true;
		console.log('correct array', correct_options);
		console.log(selects);
		selects.forEach((el, i) => {
			console.log('selected', i, el.value);
			console.log('correcta', i, correct_options[i]);
			if (el.value != correct_options[i]) {
				response = false;
			}
		});
		return response;
	}
	function showFeedback() {
		selects.forEach((el, i) => {
			if (el.value != correct_options[i]) {
				// el.selectedIndex = 0;
				el.classList.add('❌');
			} else {
				el.classList.add('✅');
			}
		});
	}
	function showCorrects() {
		selects.forEach((el, i) => {
			el.value = correct_options[i];
		});
	}

	// calificar por intentos
	function intentar(isCorrect) {
		if (isCorrect) {
			// sfx_correcto[0].play();
			if (state.contInt === 0) state.completado = true;
			state.puntajeObt = state.puntos[state.contInt];

			swal({
				title: '¡Respuesta Correcta!',
				text: '¡Felicitaciones! Has respondido correctamente la pregunta.',
				icon: 'success',
				button: 'Continuar',
			});
			finalizar();
			showFeedback();

			return;
		} else {
			state.contInt++;
			if (state.totalInt === state.contInt) {
				swal({
					title: 'Respuesta Incorrecta',
					text: 'Continua para ver la respuesta correcta.',
					icon: 'error',
					button: 'Continuar',
				}).then((value) => {
					showCorrects();
					showFeedback();
				});

				finalizar(); // guardar data y finalizar
			} else {
				if (window.mostrarPop) window.mostrarPop(modmal);
			}
		}
		showFeedback();
	}

	function blockAll() {
		[...document.querySelectorAll('select')].map((el) => {
			el.removeEventListener('click', function () {});
			el.setAttribute('disabled', true);
			el.style.cursor = 'not-allowed';
		});

		validatebtn.removeEventListener('click', function () {});
		validatebtn.setAttribute('disabled', true);
		validatebtn.style.cursor = 'not-allowed';
	}

	function finalizar() {
		blockAll();
	}
}
