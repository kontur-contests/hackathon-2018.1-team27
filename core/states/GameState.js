class GameState extends Phaser.State {
  constructor() {
    super();
    this.MAX_ENEMIES = 6
  }

  preload() {
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
      enemy = new Enemy(this.game, x, y, this.player);
      this.enemiesGroup.add(enemy);
    }

    // Revive the enemy (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    enemy.revive();

    enemy.x = x;
    enemy.y = y;

    return enemy;
    // this.game.add.existing(
    //   new Enemy(this.game, this.game.width/2, this.game.height - 16, this.player)
    // );
  }

  getExplosion(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
      explosion = this.game.add.sprite(0, 0, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);

      // Add an animation for the explosion that kills the sprite when the
      // animation is complete
      var animation = explosion.animations.add('boom', [0, 1, 2, 3], 60, false);
      animation.killOnComplete = true;

      // Add the explosion sprite to the group
      this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
  };

  updateEnemies() {
    if (this.enemiesGroup.countLiving() < this.MAX_ENEMIES) {
      // Set the launch point to a random location
      this.createEnemies(
        this.game.rnd.integerInRange(50, this.game.width),
        this.game.rnd.integerInRange(50, this.game.height)
      );
    }

    this.enemiesGroup.forEachAlive((m) => {
      const distance = this.game.math.distance(m.x, m.y,
        this.player.x, this.player.y);
      if (distance < 50) {
        m.kill();
        // this.getExplosion(m.x, m.y);
      }
    });
  }
}
