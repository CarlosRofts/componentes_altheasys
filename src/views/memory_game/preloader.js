import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
	constructor(state) {
		super('preloader');
		this.state = state;
	}

	preload() {
		// characters sprites
		this.load.spritesheet('char1', '/textures/char1_64.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('char2', '/textures/char2_64.png', { frameWidth: 64, frameHeight: 64 });

		// assets
		this.load.spritesheet('box', '/textures/box.png', { frameWidth: 64, frameHeight: 64 });

		// memo cards
		this.state.imagen_arr.forEach((url, i) => {
			if (i > 4) return; // no aceptara mas de 5 imagenes... 🔨
			this.load.image(`image${i + 1}`, `${url}`);
		});

		// backgrounds
		this.load.image('Grass', '/textures/bg_tiled/Grass.png');
		this.load.image('tileset', '/textures/bg_tiled/tileset.png');
		this.load.tilemapTiledJSON('memo_tilemap', '/textures/bg_tiled/bg_memo.tmj');

		// Validación de carga de recursos
		this.load.on('complete', () => {
			console.log('Todos los recursos se han cargado correctamente.');
			// Aquí puedes iniciar el juego o realizar otras acciones necesarias
		});

		// Manejo de errores en la carga de recursos
		this.load.on('fileerror', (fileKey, file) => {
			console.error('Error al cargar el archivo: ' + fileKey);
			console.error('Detalles del error:', file);
		});

		this.load.on('fileprogress', (file) => {
			console.log('Cargando archivo: ' + file.key);
		});

		this.load.start(); // Inicia la carga de los recursos
	}

	create() {
		// this.sokoban();
		this.loadCharacters();
		this.scene.start('game');
	}

	loadCharacters() {
		// character 1
		this.anims.create({
			key: 'down-idle',
			frames: [{ key: 'char2', frame: 5 }],
		});

		this.anims.create({
			key: 'down-walk',
			frames: this.anims.generateFrameNumbers('char2', { start: 4, end: 5 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'up-idle',
			frames: [{ key: 'char2', frame: 0 }],
		});

		this.anims.create({
			key: 'up-walk',
			frames: this.anims.generateFrameNumbers('char2', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'left-idle',
			frames: [{ key: 'char2', frame: 6 }],
		});

		this.anims.create({
			key: 'left-walk',
			frames: this.anims.generateFrameNumbers('char2', { start: 6, end: 7 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'right-idle',
			frames: [{ key: 'char2', frame: 2 }],
		});

		this.anims.create({
			key: 'right-walk',
			frames: this.anims.generateFrameNumbers('char2', { start: 2, end: 3 }),
			frameRate: 10,
			repeat: -1,
		});
	}
}
