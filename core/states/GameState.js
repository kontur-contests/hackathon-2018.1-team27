class GameState extends Phaser.State {
  preload () {
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('player-cursor', '/assets/sprites/cursor.png');
  }

  create() {
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
    this.player.velocity = 10;

    this.cursor = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY - 32,
      'player-cursor'
    );
    this.cursor.anchor.setTo(0.5, 0.5);
  }

  updatePlayer() {
    let keyboard = this.game.input.keyboard;

    if (keyboard.isDown(Phaser.Keyboard.A)) {
      this.player.angle -=10;
    }

    if (keyboard.isDown(Phaser.Keyboard.D)) {
      this.player.angle +=10;
    }
  }
}
