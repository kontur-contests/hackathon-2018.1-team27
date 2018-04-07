class GameState extends Phaser.State {
  preload () {
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('player-cursor', '/assets/sprites/cursor.png');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.createPlayer();
  }

  update() {
    this.updatePlayer();
  }

  render() {
    this.game.debug.body(this.player);
  }

  createPlayer() {
    this.player = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'player'
    );
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
  }

  updatePlayer() {
    let keyboard = this.game.input.keyboard;
    const MOVE_STEP = 10;
    const ROTATE_STEP = 7;

    if (keyboard.isDown(Phaser.Keyboard.W)) {
      this.player.y -= MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.A)) {
      this.player.x -= MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.S)) {
      this.player.y += MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.D)) {
      this.player.x += MOVE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.player.angle -= ROTATE_STEP;
    }

    if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.player.angle += ROTATE_STEP;
    }
  }
}
