var width = 400;
var height = 600;

class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
    this.width = width;
    this.height = height;
    this.lane = 2;
    this.speed = 3;
    this.linesCounter = 0;
    this.lanesTotal = 5;
    this.linesTotal = 10;
  }
  preload() {
    this.load.image('car', 'assets/car.png');
    this.load.image('line', 'assets/line.png');
    this.load.audio('theme', ['assets/ES_The Perfect Picture - Sunshine Coast.mp3', 'assets/ES_The Perfect Picture - Sunshine Coast.ogg']);
  }
  create() {
    this.createMusic();
    this.createCar();
    this.createLines();
  }
  update() {
    this.moveLines();
  }

  createMusic() {
    const music = this.sound.add('theme');
    music.addMarker({
      name: 'loop',
      start: 0,
      duration: music.duration,
      config: {
        loop: true
      }
    });
    music.play('loop');
  }

  createCar() {
    this.car = this.add.image(0, 0, 'car');
    this.moveCar();
    this.car.setScale(this.width / this.lanesTotal / this.car.width);
    this.car.setOrigin(0, 1);
    this.input.keyboard.on('keydown-LEFT', (event) => {
      this.lane = Math.max(0, this.lane - 1);
      this.moveCar();
    });
    this.input.keyboard.on('keydown-RIGHT', (event) => {
      this.lane = Math.min(this.lanesTotal - 1, this.lane + 1);
      this.moveCar();
    });
    this.input.keyboard.on('keydown-UP', (event) => {
      this.speed = Math.min(10, this.speed + 1);
    });
    this.input.keyboard.on('keydown-DOWN', (event) => {
      this.speed = Math.max(1, this.speed - 1);
    });
  }

  moveCar() {
    this.car.setPosition(this.width / this.lanesTotal * (this.lane), this.height * 0.95);
  }

  createLines() {
    this.lines = this.add.group();
    for (let l = 1; l < this.lanesTotal; l++) {
      for (let i = -1; i < this.linesTotal; i++) {
        const line = this.add.image(this.width / this.lanesTotal * l, i * this.height / this.linesTotal, 'line');
        line.setDisplaySize(this.width / this.lanesTotal / 10, this.height / this.linesTotal / 2);
        line.setOrigin(0.5, 0);
        line['originalY'] = line.y;
        this.lines.add(line);
      }
    }
  }

  moveLines() {
    if (this.linesCounter < this.height / this.linesTotal) {
      for (const line of this.lines.getChildren()) {
        line.setY(line.y + this.speed);
      }
      this.linesCounter += this.speed;
    } else {
      for (const line of this.lines.getChildren()) {
        line.setY(line['originalY']);
      }
      this.linesCounter = 0;
    }
  }
}

var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  backgroundColor: '#404040',
  parent: 'SceneMain',
  scene: SceneMain
};

var game = new Phaser.Game(config);