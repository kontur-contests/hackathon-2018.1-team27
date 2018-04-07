const config = {
  width: 800,
  height: 600,
  renderer: Phaser.CANVAS,
  antialias: false,
  multiTexture: false
}

const game = new Phaser.Game(config);

game.state.add('Boot', BootState);
game.state.add('Game', GameState);
game.state.add('GameOver', GameOverState);

// game.state.start('Boot');
game.state.start('Game');
