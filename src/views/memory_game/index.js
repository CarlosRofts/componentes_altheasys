// import './styles.css';

import view from './index.html?raw';
import css from './styles.css?raw';

export const html = view;
export const styles = css;

export function init() {
	console.log('js memorygame init');
}
