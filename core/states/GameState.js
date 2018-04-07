class GameState extends Phaser.State {
  constructor() {
    super();
    this.MAX_ENEMIES = 6
  }

  preload () {
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('cursor', '/assets/sprites/cursor.png');
    this.load.image('rocket', '/assets/gfx/rocket.png');

    this.load.spritesheet('explosion', '/assets/gfx/explosion.png', 128, 128);
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.enemiesGroup = this.game.add.group();
    this.explosionGroup = this.game.add.group();

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player'
    });
    this.game.add.existing(this.player);

    this.createEnemies();
  }

  update() {
    this.updateEnemies();
  }

  render() {
    this.game.debug.body(this.player);
  }

  createEnemies(x, y) {
      let enemy = this.enemiesGroup.getFirstDead();

      // If there aren't any available, create a new one
      if (enemy === null) {
          enemy = new Enemy(this.game,x,y,this.player);
          this.enemiesGroup.add(enemy);
      }

      // Revive the missile (set it's alive property to true)
      // You can also define a onRevived event handler in your explosion objects
      // to do stuff when they are revived.
      enemy.revive();

      return enemy;
      // this.game.add.existing(
      //   new Enemy(this.game, this.game.width/2, this.game.height - 16, this.player)
      // );
  }

  updateEnemies() {
    if (this.enemiesGroup.countLiving() < this.MAX_ENEMIES) {
      // Set the launch point to a random location
      this.createEnemies(this.game.rnd.integerInRange(50, this.game.width-50),
          this.game.height + 50);
    }

    this.enemiesGroup.forEachAlive((m) => {
        let distance = this.game.math.distance(m.x, m.y,
            this.player.x, this.player.y);
        if (distance < 50) {
            m.kill();
            // this.getExplosion(m.x, m.y);
        }
    });
  }
}
