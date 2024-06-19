export default class CountdownController {
	scene;
	label;
	timerEvent;
	duration = 0;
	constructor(scene, label) {
		this.scene = scene;
		this.label = label;
		this.state = this.scene.state;
	}

	start(callback, duration = this.state.tiempo) {
		this.stop();

		this.finishedCallback = callback;
		this.duration = duration * 60 * 1000; // Convertir minutos a milisegundos

		this.timerEvent = this.scene.time.addEvent({
			delay: this.duration,
			callback: () => {
				this.label.text = '0';

				this.stop();

				if (callback) {
					callback();
				}
			},
		});
	}

	stop() {
		if (this.timerEvent) {
			this.timerEvent.destroy();
			this.timerEvent = undefined;
		}
	}

	update() {
		if (!this.timerEvent || this.duration <= 0) {
			return;
		}

		const elapsed = this.timerEvent.getElapsed();
		const remaining = this.duration - elapsed;
		const seconds = remaining / 1000;

		this.label.text = seconds.toFixed(2);
	}
}
