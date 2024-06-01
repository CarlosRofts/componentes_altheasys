import { isMobile } from '../../utils';
import { gsap } from 'gsap';

// Componente E-Learning Slider
export class RangeSlider {
	constructor(images) {
		this.images = images;
		this.currentSlide = 0;
		this.counterVistos = 0;
		this.slider = document.getElementById('slider');
		this.sliderControl = document.getElementById('slider-control');
		this.prevButton = document.getElementById('prevBtn');
		this.nextButton = document.getElementById('nextBtn');
		this.indicatorsContainer = document.getElementById('indicators'); // Nueva línea

		this.init();
	}

	init() {
		this.renderImages();
		this.setupEvents();
		this.renderIndicators();
		this.updateIndicatorPosition();
	}

	renderImages() {
		this.images.forEach((imgSrc, index) => {
			const img = document.createElement('img');
			img.src = imgSrc;
			this.slider.appendChild(img);
			if (index === 0) img.style.display = 'block';
		});
		this.sliderControl.max = this.images.length - 1;
	}

	setupEvents() {
		this.prevButton?.addEventListener('click', () => this.prevSlide());
		this.nextButton?.addEventListener('click', () => this.nextSlide());

		// Agregar evento 'input' para actualizar la imagen mientras se arrastra el rango
		this.sliderControl.addEventListener('input', () => {
			// Validar si el valor es un número entero antes de ejecutar slideTo
			if (!isNaN(this.sliderControl.value) && Number.isInteger(parseFloat(this.sliderControl.value))) {
				this.slideTo(this.sliderControl.value);
			}
			this.updateOpacity();
			this.updateIndicatorPosition(); // Nueva línea
		});
		// Agregar evento 'input' para actualizar la imagen mientras se arrastra el rango
		this.sliderControl.addEventListener('change', () => {
			this.slideTo(this.sliderControl.value);
			this.updateOpacity();
			this.updateIndicatorPosition(); // Nueva línea
		});
	}
	renderIndicators() {
		this.images.forEach((_, index) => {
			const indicator = document.createElement('span');
			this.indicatorsContainer.appendChild(indicator);
		});
		this.updateIndicatorPosition();
	}

	updateIndicatorPosition() {
		const indicators = this.indicatorsContainer.querySelectorAll('span');
		const rangeWidth = this.sliderControl.offsetWidth;
		const rangeValue = parseFloat(this.sliderControl.value);
		const offsetPercentage = isMobile() ? 2 : 1; // Porcentaje de offset
		const offsetPixels = (offsetPercentage / 100) * rangeWidth; // Convertir el porcentaje a píxeles

		const totalWidth = rangeWidth - 2 * offsetPixels; // Ancho total del rango sin contar el offset

		const indicatorSpacing = totalWidth / (this.images.length - 1); // Espaciado entre los indicadores sin contar el offset

		indicators.forEach((indicator, index) => {
			const indicatorPosition = ((index * indicatorSpacing + offsetPixels) / rangeWidth) * 100; // Aplicar un offset al inicio

			indicator.style.left = `${indicatorPosition}%`; // Utilizar porcentaje en lugar de píxeles
			indicator.classList.toggle('active', index === rangeValue);
		});
	}

	prevSlide() {
		this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
		this.updateSlide();
		this.updateSliderControlValue();
	}

	nextSlide() {
		this.currentSlide = this.currentSlide === this.images.length - 1 ? 0 : this.currentSlide + 1;
		this.updateSlide();
		this.updateSliderControlValue();
	}

	updateSliderControlValue() {
		this.sliderControl.value = this.currentSlide;
	}

	slideTo(index) {
		// Validar si el valor es intermedio y redondearlo al índice más cercano
		const roundedIndex = Math.round(index);
		if (index !== roundedIndex) {
			this.currentSlide = roundedIndex;
			this.sliderControl.value = roundedIndex;
		} else {
			this.currentSlide = parseInt(index);
		}
		this.updateSlide();
	}

	updateSlide() {
		gsap.to(this.slider.querySelectorAll('img'), {
			duration: 0.0,
			opacity: 0,
			onComplete: () => {
				this.slider.querySelectorAll('img').forEach((img, index) => {
					img.style.display = index === this.currentSlide ? 'block' : 'block';
				});
				gsap.to(this.slider.querySelectorAll('img')[this.currentSlide], { duration: 0.0, opacity: 1 });
			},
		});
	}

	updateOpacity() {
		const value = parseFloat(this.sliderControl.value);
		const index = Math.floor(value);
		const fraction = value - index;
		const images = this.slider.querySelectorAll('img');
		// const nextImg = index > 0 ? images[index - 1] : images[index + 1];
		const nextImg = images[Math.round(value)];

		// current
		images[index].style.opacity = 1;
		images[index].style.zIndex = 1;
		// next
		if (this.getDecimal(value) >= 0.5) {
			nextImg.style.display = 'block';
			nextImg.style.zIndex = value + 20;
			nextImg.style.opacity = fraction;
		}

		images[index].classList.add('visto');
		if (document.querySelectorAll('.visto').length === images.length) {
			window.finTema();
		}

		// console.log('imagen actual', images[index]);
		// console.log('next img', nextImg);
		// console.log('Math.round(value)', Math.round(value));
	}

	getDecimal(numero) {
		return numero - Math.floor(numero);
	}
}
