// const level = [
// 	[1, 0, 3],
// 	[2, 4, 1],
// 	[3, 4, 2],
// ];
import Phaser from 'phaser';
import CountdownController from './countdownController';
import swal from 'sweetalert';

export default class Game extends Phaser.Scene {
	cursors;
	player;
	boxGroup;
	activeBox;
	itemsGroup;
	selectedBoxes = [];
	countdown;
	matchesCount = 0;

	constructor(state) {
		super('game');
		this.complete = false;
		this.state = state;
	}

	init() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		const { width, height } = this.scale;

		const map = this.make.tilemap({ key: 'memo_tilemap' });
		const tileset = map.addTilesetImage('Grass', 'Grass');
		const tileset2 = map.addTilesetImage('tileset', 'tileset');

		// Itera sobre todas las capas del mapa
		map.layers.forEach((layer) => {
			// Asume que las capas 'grass' y 'gras2' usan 'tileset1' y el resto usan 'tileset2'
			let usedTileset;
			if (layer.name === 'grass' || layer.name === 'tileset') {
				usedTileset = tileset;
			} else {
				usedTileset = tileset2;
			}

			const mapLayer = map.createLayer(layer.name, usedTileset);
			mapLayer.setScale(2);
		});

		this.player = this.physics.add
			.sprite(width * 0.5, height * 0.8, 'char1')
			.setSize(40, 40)
			.setOffset(12, 38)
			.play('down-idle');

		// Habilita la colisión del jugador con los límites del mundo de juego. Esto evita que el jugador se salga de la pantalla.
		this.player.setCollideWorldBounds(true);

		// Crea un grupo estático (staticGroup) para almacenar las cajas del juego con la física de Phaser.
		this.boxGroup = this.physics.add.staticGroup();

		this.createBoxes();

		// Crea un grupo normal (group) para almacenar los items del juego, sin física involucrada.
		this.itemsGroup = this.add.group();

		// Crea un objeto de texto que muestra el valor '45' en el centro de la parte superior de la pantalla (ancho * 0.5, 50).
		const timerLabel = this.add
			.text(width * 0.5, 50, '45', { fontSize: 48, color: 'black', fontFamily: 'arial', fontStyle: 'bold', stroke: 'white', strokeThickness: 10 })
			.setOrigin(0.5);

		this.countdown = new CountdownController(this, timerLabel);
		// Inicia el conteo del controlador y le pasa una función para llamar cuando finalice el conteo (handleCountdownFinished). Esta función se ata al contexto de la escena (this.bind(this)) para asegurar que se llame correctamente dentro del controlador.
		this.countdown.start(this.handleCountdownFinished.bind(this));

		// Configura un detector de colisiones entre el jugador (this.player) y el grupo de cajas (this.boxGroup).
		this.physics.add.collider(this.player, this.boxGroup, this.handlePlayerBoxCollide, undefined, this);

		// mouse tracker
		this.input.on('pointerdown', (pointer) => {
			this.targetPosition = { x: pointer.worldX, y: pointer.worldY };
			this.isMovingToTarget = true;
		});

		// todo 🔨
		this.resize();
	}

	createBoxes() {
		const width = this.scale.width;
		let xPer = 0.25;
		let y = 150;
		for (let row = 0; row < this.state.pares.length; ++row) {
			for (let col = 0; col < this.state.pares[row].length; ++col) {
				/** @type {Phaser.Physics.Arcade.Sprite} */

				/*                                                                                      *
				 * 👇 Esta línea crea un nuevo sprite de caja usando el método get del grupo this.boxGroup.*
				 /* width * xPer: Calcula la posición horizontal de la caja basada en el valor actual de xPer y el ancho de la pantalla.*
				 /* y: Usa el valor actual de y para la posición vertical.                               *
				 /* 10: Establece un valor de profundidad de 10 para el sprite de la caja *
				 *                                                                                      */
				const box = this.boxGroup.get(width * xPer, y, 'box', 0);

				/*                                                                                      *
				 * 👇 Esta cadena de métodos configura el sprite de caja recién creado:          *
				 /*.setSize(64, 32): Establece el tamaño del área de colisión de la caja a 64 píxeles de ancho y 32 píxeles de alto.*
				 /*.setOffset(0, 32): Establece el desplazamiento del área de colisión a 0 píxeles horizontalmente y 32 píxeles hacia abajo desde la esquina superior izquierda de la imagen del sprite.*
				 /*.setData('itemType', level[row][col]): Establece una propiedad personalizada llamada itemType en el sprite de la caja. El valor asignado es el elemento de la fila actual (row) y la columna actual (col) de la estructura de datos level. Esto probablemente almacena información sobre el tipo de caja (por ejemplo, caja normal, caja*
				 *                                                                                      */
				box.setSize(64, 32).setOffset(0, 32).setData('itemType', this.state.pares[row][col]);

				xPer += 0.25;
			}

			xPer = 0.25;
			y += 150;
		}
	}

	handleCountdownFinished() {
		this.player.active = false;
		this.player.setVelocity(0, 0);

		if (window.mostrarPop) window.mostrarPop(this.state.modmal);

		const { width, height } = this.scale;
		if (!this.complete)
			this.add
				.text(width * 0.5, height * 0.5, 'Perdiste!', {
					fontSize: 48,
					color: 'black',
					fontFamily: 'arial',
					fontStyle: 'bold',
					stroke: 'white',
					strokeThickness: 10,
				})
				.setOrigin(0.5);
	}

	/**
	 *
	 * @param {Phaser.Physics.Arcade.Sprite} player
	 * @param {Phaser.Physics.Arcade.Sprite} box
	 */
	handlePlayerBoxCollide(player, box) {
		const opened = box.getData('opened');

		if (opened) {
			return;
		}

		if (this.activeBox) {
			// console.log(this.activeBox);

			return;
		}

		this.activeBox = box;

		this.activeBox.setFrame(3); // blue
		if (this.isMovingToTarget) {
			this.player.setVelocity(0, 0); // Detiene el movimiento.
			this.isMovingToTarget = false; // Indica que ya no se está moviendo hacia el objetivo.
		}
	}

	/**
	 *
	 * @param {Phaser.Physics.Arcade.Sprite} box
	 */
	openBox(box) {
		if (!box) {
			return;
		}

		const itemType = box.getData('itemType');

		/** @type {Phaser.GameObjects.Sprite} */
		let item;

		switch (itemType) {
			case 0:
				// todo, poner excel las imagenes : state.image[x]
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('image1');
				break;

			case 1:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('image2');
				break;

			case 2:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('image3');
				break;

			case 3:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('image4');
				break;

			case 4:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('image5');
				break;
		}

		if (!item) {
			return;
		}

		box.setData('opened', true);

		item.setData('sorted', true);
		item.setDepth(2000);

		item.setActive(true);
		item.setVisible(true);

		item.scale = 0;
		item.alpha = 0;

		this.selectedBoxes.push({ box, item });

		this.tweens.add({
			targets: item,
			y: '-=50',
			alpha: 1,
			scale: 2,
			angle: 0,
			duration: 500,
			onStart: () => {
				if (itemType === 0) {
					this.handleBearSelected();
					return;
				}

				if (this.selectedBoxes.length < 2) {
					return;
				}

				this.checkForMatch();
			},
		});
	}

	handleBearSelected() {
		const { box, item } = this.selectedBoxes.pop();

		item.setTint(0xff0000);
		box.setFrame(2);

		this.player.active = false;
		this.player.setVelocity(0, 0);

		this.time.delayedCall(1000, () => {
			item.setTint(0xffffff);
			box.setFrame(0); // gray
			box.setData('opened', false);

			this.tweens.add({
				targets: item,
				y: '+=50',
				alpha: 0,
				scale: 0,
				duration: 300,
				onComplete: () => {
					this.player.active = true;
				},
			});
		});
	}

	checkForMatch() {
		const second = this.selectedBoxes.pop();
		const first = this.selectedBoxes.pop();

		if (first.item.texture !== second.item.texture) {
			this.tweens.add({
				targets: [first.item, second.item],
				y: '+=50',
				alpha: 0,
				scale: 0,
				duration: 300,
				delay: 1000,
				onComplete: () => {
					this.itemsGroup.killAndHide(first.item);
					this.itemsGroup.killAndHide(second.item);

					first.box.setData('opened', false);
					second.box.setData('opened', false);
				},
			});
			return;
		}

		++this.matchesCount;

		// 👁‍🗨
		if (this.matchesCount >= 4) this.complete = true;

		this.time.delayedCall(1000, () => {
			first.box.setFrame(1); // green
			second.box.setFrame(1); // green

			if (this.matchesCount >= 4) {
				// game won
				if (window.mostrarPop) window.mostrarPop(this.state.modbien);

				this.complete = true;
				this.countdown.stop();

				this.player.active = false;
				this.player.setVelocity(0, 0);

				const { width, height } = this.scale;
				this.add
					.text(width * 0.5, height * 0.5, 'Ganaste!', {
						fontSize: 48,
					})
					.setOrigin(0.5);
			}
		});
	}

	finalizar() {
		// blockAll();
		// 🔨 estrucctura para temario y puntaje al fallo
		if (window.setTema)
			window.setTema({
				b: this.state.completado,
				ACT: { puntaje: Number(this.state.puntaje), puntajeMax: this.state.puntaje, aprobado: true },
			});
		// guardar en data de act.
		console.log('puntaje:', Number(this.state.puntaje));
		window.getTema(function (r) {
			console.log('getTema= ', r);
		});
		if (window.finTema) window.finTema();
	}

	updatePlayer() {
		// Verifica si el jugador está activo. Si no, termina la función.
		if (!this.player.active) {
			return;
		}

		const speed = 200; // Define la velocidad de movimiento del jugador.

		// 🎮 Movimiento con teclas de dirección. 🎮
		if (this.cursors.left.isDown) {
			// Si la tecla de dirección izquierda está presionada, mueve al jugador a la izquierda.
			this.player.setVelocity(-speed, 0);
			this.player.play('left-walk', true); // Reproduce la animación de caminar a la izquierda.
		} else if (this.cursors.right.isDown) {
			// Si la tecla de dirección derecha está presionada, mueve al jugador a la derecha.
			this.player.setVelocity(speed, 0);
			this.player.play('right-walk', true); // Reproduce la animación de caminar a la derecha.
		} else if (this.cursors.up.isDown) {
			// Si la tecla de dirección arriba está presionada, mueve al jugador hacia arriba.
			this.player.setVelocity(0, -speed);
			this.player.play('up-walk', true); // Reproduce la animación de caminar hacia arriba.
		} else if (this.cursors.down.isDown) {
			// Si la tecla de dirección abajo está presionada, mueve al jugador hacia abajo.
			this.player.setVelocity(0, speed);
			this.player.play('down-walk', true); // Reproduce la animación de caminar hacia abajo.
		} else if (this.isMovingToTarget) {
			// 🖱 🌂 Si el jugador se está moviendo hacia una posición objetivo (clic del ratón).  🖱 🌂

			// Calcula la distancia en el eje x e y desde la posición actual del jugador a la posición objetivo.
			const dx = this.targetPosition.x - this.player.x - 80; //80: size+offset values
			const dy = this.targetPosition.y - this.player.y - 20;
			// Calcula la distancia total utilizando el teorema de Pitágoras.
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 2) {
				// Si la distancia es menor que 4 píxeles, se considera que ha llegado al destino.
				this.player.setVelocity(0, 0); // Detiene el movimiento.
				this.isMovingToTarget = false; // Indica que ya no se está moviendo hacia el objetivo.

				// Obtiene la animación actual y cambia a la animación de "idle" correspondiente.
				const key = this.player.anims.currentAnim.key;
				const parts = key.split('-');
				const direction = parts[0];
				this.player.play(`${direction}-idle`);
			} else {
				// Si no ha llegado al destino, calcula el ángulo hacia el objetivo.
				const angle = Math.atan2(dy, dx);
				console.log('angle', angle);
				// Establece la velocidad del jugador en la dirección del objetivo.
				this.player.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));

				// Cambia la animación dependiendo de la dirección de movimiento.
				if (Math.abs(dx) > Math.abs(dy)) {
					if (dx > 0) {
						this.player.play('right-walk', true); // Reproduce la animación de caminar a la derecha.
					} else {
						this.player.play('left-walk', true); // Reproduce la animación de caminar a la izquierda.
					}
				} else {
					if (dy > 0) {
						this.player.play('down-walk', true); // Reproduce la animación de caminar hacia abajo.
					} else {
						this.player.play('up-walk', true); // Reproduce la animación de caminar hacia arriba.
					}
				}
			}
		} else {
			// Si no hay entrada de teclado ni movimiento hacia el objetivo, detiene el jugador.
			this.player.setVelocity(0, 0);

			// Obtiene la animación actual y cambia a la animación de "idle" correspondiente.
			const key = this.player.anims.currentAnim.key;
			const parts = key.split('-');
			const direction = parts[0];
			this.player.play(`${direction}-idle`);
		}

		// Verifica si la tecla de espacio se presionó.
		const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
		if (spaceJustPressed && this.activeBox) {
			// Si la tecla de espacio se presionó y hay una caja activa, abre la caja.
			this.openBox(this.activeBox);

			// Cambia el marco de la caja para indicar que está abierta.
			this.activeBox.setFrame(0); // gris
			this.activeBox = undefined; // Desactiva la caja.
		}
	}

	updateActiveBox() {
		if (!this.activeBox) {
			return;
		}

		const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.activeBox.x, this.activeBox.y);

		if (distance < 100) {
			return;
		}

		this.activeBox.setFrame(0); // gray
		this.activeBox = undefined;
	}

	update() {
		this.updatePlayer();

		this.updateActiveBox();

		this.children.each((c) => {
			/** @type {Phaser.Physics.Arcade.Sprite} */
			// @ts-ignore
			const child = c;

			if (child.getData('sorted')) {
				return;
			}

			child.setDepth(child.y);
		});

		this.countdown.update();
	}

	resize() {
		var canvas = this.sys.canvas;
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var windowRatio = windowWidth / windowHeight;
		var gameRatio = this.sys.game.config.width / this.sys.game.config.height;

		if (windowRatio < gameRatio) {
			canvas.style.width = windowWidth + 'px';
			canvas.style.height = windowWidth / gameRatio + 'px';
		} else {
			canvas.style.width = windowHeight * gameRatio + 'px';
			canvas.style.height = windowHeight + 'px';
		}
	}
}
