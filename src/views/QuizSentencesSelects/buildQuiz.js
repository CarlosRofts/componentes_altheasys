export function renderTexts(state, placeholder = 'Selecciona...') {
	const { sentences } = state;
	const select = `
		<div class="form-group m-0 p-0">
			<select class="selects form-control mx-1" data-name="2">
				<option value="placeholder">${placeholder}</option>
			</select>
		</div>`;

	const container = document.getElementById('sentences');

	// sentences.forEach((text) => {
	// 	// const words = text.split(' ');
	// 	// const spannedWords = words.map((word) => (word != '___' ? `<span class="p-0">${word}&nbsp;</span>` : word));
	// 	const spannedText = text.replace(/___/g, select);
	// 	container.innerHTML += `<div class="d-flex selects-container mb-4">${spannedText}</div>`;
	// });
	sentences.forEach((text) => {
		const spannedText = text
			.split(' ')
			.map((word) => {
				if (word !== '___') {
					return `<div class="word-span p-0">${word}&nbsp;</div>`; // Wrap each word
				} else {
					return word.replace(/___/g, select);
				}
			})
			.join(''); // Combine spanned words

		// Create a container element (adjust class as needed)
		const containerDiv = document.createElement('div');
		containerDiv.classList.add('d-flex', 'selects-container', 'mb-2');

		// Set the inner HTML with the spanned text
		containerDiv.innerHTML = spannedText;

		// Append the container to the target element
		container.appendChild(containerDiv);
	});

	[...document.querySelectorAll('select')].map((select) => {
		select.addEventListener('change', () => {
			state.validatebtn.removeAttribute('disabled');
			select.classList.remove('❌');
			select.classList.remove('✅');
		});
	});
}
export function setOptions(state, options) {
	state.selects = document.querySelectorAll('.selects');
	// llenando selects con options
	for (var i = 0; i < state.selects.length; i++) {
		for (var j = 0; j < options.length; j++) {
			var opt = document.createElement('option');
			opt.innerHTML = options[j];
			opt.value = options[j];
			state.selects[i].appendChild(opt);
		}
	}
}
