class Player extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);

    this.anchor.setTo(0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.cursor = new PlayerCursor({
      game: this.game,
      x: this.x,
      y: this.y,
      pivotY: this.width + 40,
      asset: 'cursor',
    });

    this.game.add.existing(this.cursor);

    this.MOVE_STEP = 10;
    this.ROTATE_STEP = 7;
  }

  update() {
    this.movement();

    this.cursor.updatePosition({
      x: this.x, y: this.y, angle: this.angle
    })
  }

  movement() {
    let keyboard = this.game.input.keyboard;

    if (keyboard.isDown(Phaser.Keyboard.W)) {
      this.y -= this.MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.A)) {
      this.x -= this.MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.S)) {
      this.y += this.MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.D)) {
      this.x += this.MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.angle -= this.ROTATE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.angle += this.ROTATE_STEP;
    }
  }
}
