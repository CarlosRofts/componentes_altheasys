import { shuffleArray } from '../../utils';
import { initSelects } from '../../libs/select';

export function render({ settings, imagen_arr, validarBtn }) {
	// build
	const placeholder = 'Selecciona';
	const select = (i) => {
		// const selectRadio = (ind) => {
		// 	let rad = '';
		// 	if (ind === imagen_arr.length - 1) {
		// 		rad = `<div className="lastoption"></div>`;
		// 		debugger;
		// 	}
		// 	return rad;
		// };

		const sel = `
		<div class="form-group m-0 p-0 select-container custom-select" i="${i}">
			<select class="selects form-control mx-1" name="select" data-name="${i}">
				<option value="placeholder">${placeholder}</option>
			</select>
			  <div class="arrow"></div>
		</div>`;
		return sel;
	};
	const container = document.getElementById('img-selects');
	container.innerHTML = '';

	// render
	imagen_arr.forEach((img, i) => {
		container.innerHTML += `
        <div class="col">
            <img src="/${img}" alt="" class="image" />
            ${select(i)}
        </div>
        `;
	});
	const selects = document.querySelectorAll('.selects');

	// styles
	const actContainer = document.querySelector('#img-selects');
	actContainer.classList.add(`row-cols-${selects.length}`);

	// options
	setOptions(shuffleArray([...settings.corrects_options]));
	console.log('options', shuffleArray([...settings.corrects_options]));
	function setOptions(options) {
		selects.forEach((select) => {
			options.forEach((option, i) => {
				const newOption = new Option(option, option);
				if (i === options.length - 1) {
					newOption.setAttribute('class', 'lastOption');
				}

				select.appendChild(newOption);
			});
		});
	}

	initSelects();
}

export function initAct(actData) {
	const { validarBtn, modbien, modmal, retrosBien, audioEl, retrosMal, audiosRetrosSrc, settings, puntajeMax } = actData;
	let { intentosCount, completado } = actData;
	const { intentos, corrects_options, puntaje, puntaje_fallo } = settings;
	const selects = document.querySelectorAll('.selects');

	// events
	const customSelects = document.querySelectorAll('.custom-select');
	// selectOpen = [];

	[...customSelects].map((select) => {
		select.addEventListener('click', () => {
			console.log('click');
			validarBtn.removeAttribute('disabled');
			select.classList.remove('❌');
			select.classList.remove('✅');
		});
	});
	validarBtn.addEventListener('click', function () {
		validar(compararRespuestas());
	});

	// act
	function compararRespuestas() {
		let value = true;
		console.log('correct array', corrects_options);
		selects.forEach((el, i) => {
			console.log('selected', i, el.value);
			console.log('correcta', i, corrects_options[i]);
			if (el.value != corrects_options[i]) {
				value = false;
			}
		});
		return value;
	}
	function validar(isCorrect) {
		if (isCorrect) {
			console.log('correcto ✅');
			if (intentosCount === 0) completado = true; // mostrar modal
			swal({
				title: '¡Respuesta Correcta!',
				text: '¡Felicitaciones! Has respondido correctamente la pregunta.',
				icon: 'success',
				button: 'Continuar',
			});
			// finalizar();
			showFeedback();
			blockAll();
			return;
		} else {
			intentosCount++;
			if (intentos === intentosCount) {
				swal({
					title: 'Respuesta Incorrecta',
					text: 'Continua para ver la respuesta correcta.',
					icon: 'error',
					button: 'Continuar',
				}).then((value) => {
					showCorrects();
					showFeedback();
					blockAll();
				});

				console.log('⚠ intentos superados ⚠', intentosCount);
			} else {
				if (window.mostrarPop) window.mostrarPop(modmal);
			}
		}
	}

	function showFeedback() {
		customSelects.forEach((el, i) => {
			if (el.value != corrects_options[i]) {
				// el.selectedIndex = 0;
				el.classList.add('❌');
			} else {
				el.classList.add('✅');
			}
		});
	}
	function showCorrects() {
		customSelects.forEach((el, i) => {
			const current = el.querySelector('.select-selected');
			console.log('current', current);
			el.value = corrects_options[i];
			current.textContent = corrects_options[i];
		});
	}
	function blockAll() {
		document.querySelector('body').style.pointerEvents = 'none';
	}
}
