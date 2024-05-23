window.addEventListener('load', function () {
	console.log('init');

	// view importing handler
	async function setView(id) {
		const { html, init, styles } = await import(`/root/src/views/${id}`);
		if (styles) document.querySelector('.view').innerHTML = `<style>${styles}</style>`;
		if (html) document.querySelector('.view').innerHTML += html;
		if (init) init();
	}

	// click handler
	[...document.querySelectorAll('.link-view')].map((el) => {
		el.addEventListener('click', (ev) => {
			ev.target.classList.add('active');
			setView(el.getAttribute('id'));
		});
	});
});
