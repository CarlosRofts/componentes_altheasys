// import './styles.css';
import view from './index.html?raw';
import css from './styles.css?raw';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const html = view;
export const styles = css;
// export const scripts = ['https://flbulgarelli.github.io/headbreaker/js/headbreaker.js'];

export function init() {
	console.log('Diagrams');
	gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

	// Seleccionar todos los svgs
	const svgs = document.querySelectorAll('.Diagrams svg');
	const container = document.querySelector('#view');

	gsap.set('[id^="fill-"]', { drawSVG: 0 });
	gsap.set(svgs, { opacity: 0.2 });
	gsap.set(svgs[0], { opacity: 1 });

	// Recorrer cada svg y crear una animación ScrollTrigger
	svgs.forEach((svg, i) => {
		ScrollTrigger.create({
			trigger: svg,
			start: 'top center',
			endTrigger: svgs[i + 1],
			// end: 'bottom 100%+=100px',
			scroller: container, // Set the scrollable container explicitly
			onToggle: (self) => {
				console.log('toggled, isActive:', self.isActive);
				gsap.to(svg, { opacity: 1, duration: 2 });
				drawSvg100(svg);
			},
			onUpdate: (self) => {
				console.log('progress:', self.progress.toFixed(3), 'direction:', self.direction, 'velocity', self.getVelocity());
			},
			markers: true,
			// scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the
		});
	});

	function drawSvg100(svg) {
		const fills = svg.querySelectorAll('[id^="fill-"]');
		gsap.to(fills, {
			drawSVG: '100%',
			stagger: {
				from: 100,
				amount: 0,
				each: 2,
			},
		});
	}
}
