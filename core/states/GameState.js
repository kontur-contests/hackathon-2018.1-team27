class GameState extends Phaser.State {
  preload () {
    this.load.image('player', '/assets/sprites/player.png');
  }

  create() {
    this.player = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'player'
    );
    this.player.anchor.set(0.5, 0.5);

    this.game.camera.follow(this.player);
    this.game.physics.arcade.enable(this.player);
  }

  update() {
    let keyboard = this.game.input.keyboard;

    if (keyboard.isDown(Phaser.Keyboard.W)) {
      this.player.y -= 10;
    } else if (keyboard.isDown(Phaser.Keyboard.A))
    {
      this.player.x -= 10;
    } else if (keyboard.isDown(Phaser.Keyboard.S))
    {
      this.player.y += 10;
    } else if (keyboard.isDown(Phaser.Keyboard.D))
    {
      this.player.x += 10;
    }
  }


  render() {
    this.game.debug.body(this.player);
  }
}
