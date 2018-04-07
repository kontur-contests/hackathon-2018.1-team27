class GameState extends Phaser.State {
  constructor() {
    super();
    this.MAX_ENEMIES = 6;
    this.firingTimer = 0;
  }

  preload() {
    this.load.image('player', '/assets/sprites/2.png');
    this.load.image('cursor', '/assets/sprites/cursor.png');
    this.load.image('bullet', '/assets/sprites/bullet.png');
    this.load.spritesheet('rocket', '/assets/gfx/ball.png', 10, 10);
    this.load.spritesheet('monster', '/assets/gfx/10.png', 32, 32);

    this.load.spritesheet('explosion', '/assets/gfx/fx-7.png', 82, 72);
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.playerGroup = this.game.add.group();
    this.enemiesGroup = this.game.add.group();
    this.explosionGroup = this.game.add.group();

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player'
    });
    this.game.add.existing(this.player);

    this.playerGroup.add(this.player);

    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(30, 'rocket');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 1);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    this.createEnemies();
  }

  update() {
    this.updateEnemies();
    this.updateCollide();

    this.game.physics.arcade.overlap(
      this.player.weapon.bullets, this.enemiesGroup, this.hitEnemy, null, this
    );

    this.game.physics.arcade.overlap(
      this.playerGroup, this.enemiesGroup, this.hitPlayer, null, this
    );

    this.game.physics.arcade.overlap(
      this.playerGroup, this.enemyBullets, this.hitPlayer, null, this
    );
  }

  hitEnemy(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    this.getExplosion(enemy.x, enemy.y);
    console.log('kill enemy');
  }

<<<<<<< HEAD
  hitPlayer(player, bullet) {
    console.log('player', player, 'bullet', bullet);
    player.kill();
    bullet.kill();

    this.getExplosion(bullet.x, bullet.y);
    // debugger;

    console.log('bullet kill');
  }

  render() {
    this.game.debug.body(this.player);
=======
  hitPlayer(a, b) {
    // debugger;
>>>>>>> 1d14e82e5e8f7d3308f2773b33279c0366855046
  }

  createEnemies() {
    const spawnPoints = [{
      x: -10,
      y: -10
    }, {
      x: 400,
      y: -10
    }, {
      x: 800,
      y: -10
    }, {
      x: -10,
      y: 400
    }, {
      x: -10,
      y: 800
    }, {
      x: -10,
      y: this.game.height + 10
    }, {
      x: 400,
      y: this.game.height + 10
    }, {
      x: 800,
      y:  this.game.height + 10
    }, {
      x: this.game.width + 10,
      y: -10
    }, {
      x: this.game.width + 10,
      y: 400
    }, {
      x: this.game.width + 10,
      y: 800
    }]

    let rndSpawnPoint = spawnPoints[this.game.rnd.integerInRange(0, spawnPoints.length - 1)];
    let x = rndSpawnPoint.x;
    let y = rndSpawnPoint.y;

    let enemy = this.enemiesGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (enemy === null) {
      enemy = new Enemy(this.game, x+10, y+10, this.player);
      this.enemiesGroup.add(enemy);
    }

    enemy.revive();

    enemy.x = x;
    enemy.y = y;
    rndSpawnPoint = 0;
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

      // Add an animation for the explosion
      var animation = explosion.animations.add('boom', [0, 1, 2, 3, 4 ,5 ,6 ,7], 50, false);
      animation.killOnComplete = true;

      // Add the explosion sprite to the group
      this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    explosion.angle = this.game.rnd.integerInRange(0, 360);

    explosion.animations.play('boom');

    return explosion;
  };

  updateCollide() {
    this.game.physics.arcade.collide(this.enemiesGroup, this.enemiesGroup);
  }

  enemyFires () {

    //  Grab the first bullet we can from the pool
    let enemyBullet = this.enemyBullets.getFirstExists(false);
    let livingEnemies = [];

    this.enemiesGroup.forEachAlive(function(m){

        // put every living enemy in an array
        livingEnemies.push(m);
    });

    if (enemyBullet && livingEnemies.length > 0)
    {
        
        let random = this.game.rnd.integerInRange(0, livingEnemies.length-1);

        let shooter = livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        this.game.physics.arcade.moveToObject(enemyBullet,this.player,500);
        this.firingTimer = this.game.time.now + 250;
    }

}

  updateEnemies() {
    if (this.enemiesGroup.countLiving() < this.MAX_ENEMIES) {
      this.createEnemies();
    }

    this.enemiesGroup.forEachAlive((m) => {
      const distance = this.game.math.distance(m.x, m.y,
        this.player.x, this.player.y);
      if (this.game.time.now > this.firingTimer)
      {
        this.enemyFires();
      }

      // if (distance < 50) {
      //   m.kill();
      //   this.getExplosion(m.x, m.y);
      // }
    });
  }
}
