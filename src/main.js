import './css/hamburguer.css';
import './css/style.css';
import { removeExistingScripts, insertScripts } from './utils';
import { isMobile } from './utils';

window.addEventListener('DOMContentLoaded', function () {
	const sidebar = document.querySelector('.sidebar-wrapper');
	const navbarToggler = document.querySelector('.navbar-toggler-btn');
	const menuItem = document.querySelector('.menu__item');
	navbarToggler.addEventListener('click', () => {
		sidebar.classList.toggle('collapsed');
		navbarToggler.classList.toggle('collapsed');
	});

	const state = {};
	console.log('init');

	// view importing handler
	async function setView(id) {
		const { html, init, styles, scripts } = await import(`/root/src/views/${id}`);
		if (styles) document.querySelector('.view').innerHTML = `<style>${styles}</style>`;

		// script es un array, iterar y asignar los script a head, debemos guardar los scripts por que los vamos a borrar

		// Remove existing scripts before inserting new ones
		if (scripts?.length > 0) {
			state.scripts = scripts;
			removeExistingScripts(scripts);
			insertScripts(state.scripts); // Insert view-specific scripts
			state.scripts = [];
		}

		if (html) document.querySelector('.view').innerHTML += html;
		if (init) init();
	}

	setView('hb');

	// click handler
	[...document.querySelectorAll('.link-view')].map((el) => {
		el.addEventListener('click', (ev) => {
			ev.target.classList.add('active');

			if (isMobile()) {
				sidebar.classList.toggle('collapsed');
				navbarToggler.classList.toggle('collapsed');
				menuItem.classList.toggle('menu__item--active');
			}

			setView(el.getAttribute('id'));
		});
	});
});
