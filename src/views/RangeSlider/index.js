// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';
import { RangeSlider } from './rangeSlider';

export const html = view;
export const styles = css;

export function init() {
	console.log('js RangeSlider init');

	const images = ['slider_demo_1.png', 'slider_demo_2.png', 'slider_demo_3.png'];

	// Inicializar el componente
	const slider = new RangeSlider(images);
}
