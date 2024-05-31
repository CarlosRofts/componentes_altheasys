/** confetti */
function showConfetti() {
	var count = 0;
	var interval = setInterval(function () {
		if (count >= 3) {
			clearInterval(interval);
			return;
		}
		confetti({
			particleCount: 150,
			spread: 100,
			origin: { y: 1, x: setXOriginValue(count) },
		});
		count++;
	}, 1000); // Intervalo de 1 segundo entre cada disparo

	function setXOriginValue(count) {
		const originValues = { 0: 0.5, 1: 0.3, 2: 0.7 };
		return originValues[count] || null; // Devuelve el valor correspondiente o null si no se encuentra
	}
}

// splitTxt({ container: el.querySelector('.splittxt'), callback: ()=>{} });
// 					splitTxt({ container: el.querySelector('.splittxt') });
function splitTxt({ container, callback }) {
	if (container) {
		container.innerHTML += '<div class="cursor"></div>';

		let split = new SplitText(container, { type: 'words,chars' });
		let tl = gsap.timeline({
			id: 'split',
			transformOrigin: '100% 50%',
		});

		// ocultar elementos html para mostrarlos en el momento indicado del stagger de splitText
		const liElements = container.querySelectorAll('li');
		if (liElements.length > 0) gsap.set(liElements, { autoAlpha: 0 });

		tl.from(split.chars, {
			//opacity: 0,
			//scale: 0,
			//y: -30,
			//rotationX: 180,
			// stagger: 0.1,

			delay: 0.5,
			autoAlpha: 0,
			ease: 'back',

			stagger: {
				each: 0.1,
				onStart() {
					let target = this.targets()[0];
					//console.log(target);
					const targetRect = target.getBoundingClientRect();
					const containerrect = container.getBoundingClientRect();
					gsap.set('.cursor', {
						duration: 0,
						opacity: 1,
						left: targetRect.left - containerrect.left + targetRect.width + 2,
						top: targetRect.top - containerrect.top + 2,
					});

					// mostrar en el momento indicado el html a la par que el texto
					if (target.parentElement.parentElement && target.parentElement.parentElement.tagName.toLowerCase() === 'li') {
						const li = target.parentElement.parentElement;
						gsap.set(li, { autoAlpha: 1 });
					}
				},
				onComplete: () => {
					gsap.set('.cursor', {
						opacity: 0,
					});
				},
			},
			onComplete: () => {
				if (callback) callback();
			},
		});
	}
}
