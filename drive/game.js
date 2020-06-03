var config = {
  type: Phaser.AUTO,
  backgroundColor: '#404040',
  parent: 'SceneMain',
}
var isMobile = navigator.userAgent.indexOf("Mobile");
if (isMobile == -1) {
  isMobile = navigator.userAgent.indexOf("Tablet");
}
if (isMobile == -1) {
  config = {
    ...config,
    width: 400,
    height: 600,
  };
} else {
  config = {
    ...config,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
    this.width = config.width;
    this.height = config.height;
    this.lane = 2;
    this.speed = 0;
    this.linesCounter = 0;
    this.lanesTotal = 5;
    this.linesTotal = 10;
  }
  preload() {
    this.load.image('car', 'assets/car.png');
    this.load.image('line', 'assets/line.png');
    this.load.image('play', 'assets/play.png');
    this.load.image('right', 'assets/right.png');
    this.load.image('left', 'assets/left.png');
    this.load.audio('theme', ['assets/ES_The Perfect Picture - Sunshine Coast.mp3', 'assets/ES_The Perfect Picture - Sunshine Coast.ogg']);
  }
  create() {
    this.createControl();
    this.createCar();
    this.createLines();
  }

  update() {
    this.moveLines();
  }

  createControl() {
    this.play = this.add.image(this.width / 2, this.height / 2, 'play');
    this.play.setScale(this.width / 3 / this.play.width);
    this.play.setOrigin(0.5, 0.5);
    this.play.setInteractive();
    this.play.on('pointerdown', () => {
      this.createMusic();
      this.speed = 3;
      this.play.setVisible(false);
      this.left.setVisible(true);
      this.right.setVisible(true);
      this.car.setVisible(true);
    });


    this.left = this.add.image(0, this.height, 'left');
    this.left.setScale(this.width / this.lanesTotal / this.left.width);
    this.left.setOrigin(-0.25, 1.25);
    this.left.setInteractive();
    this.left.on('pointerdown', this.moveCarLeft.bind(this));
    this.left.setDepth(1);
    this.left.setVisible(false);

    this.right = this.add.image(this.width, this.height, 'right');
    this.right.setScale(this.width / this.lanesTotal / this.right.width);
    this.right.setOrigin(1.25, 1.25);
    this.right.setInteractive();
    this.right.on('pointerdown', this.moveCarRight.bind(this));
    this.right.setDepth(1);
    this.right.setVisible(false);

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
    this.input.keyboard.on('keydown-LEFT', this.moveCarLeft.bind(this));
    this.input.keyboard.on('keydown-RIGHT', this.moveCarRight.bind(this));
    this.input.keyboard.on('keydown-UP', (event) => {
      this.speed = Math.min(10, this.speed + 1);
    });
    this.input.keyboard.on('keydown-DOWN', (event) => {
      this.speed = Math.max(1, this.speed - 1);
    });
    this.car.setVisible(false);
  }

  moveCarLeft(event) {
    this.lane = Math.max(0, this.lane - 1);
    this.moveCar();
  }

  moveCarRight(event) {
    this.lane = Math.min(this.lanesTotal - 1, this.lane + 1);
    this.moveCar();
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

config = {
  ...config,
  scene: SceneMain
}


var game = new Phaser.Game(config);
