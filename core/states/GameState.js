class GameState extends Phaser.State {
  constructor() {
    super();
    this.MAX_ENEMIES = 6;
    this.firingTimer = 0;
    this._score = 0;
  }

  preload() {
    this.load.image("player", "/assets/sprites/player.png");
    this.load.image("bullet", "/assets/sprites/bullet.png");
    this.load.image("monster", "/assets/sprites/enemy.png");
    this.load.image("rocket", "/assets/sprites/enemy-bullet.png");
    this.load.image("background", "/assets/sprites/bg.jpg");
    this.load.spritesheet("explosion", "/assets/sprites/explode.png", 82, 72);
  }

  create() {

    this._score = 0;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.add.tileSprite(0, 0, 800, 600, 'background');


    this.playerGroup = this.game.add.group();
    this.enemiesGroup = this.game.add.group();
    this.explosionGroup = this.game.add.group();

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: "player"
    });
    this.game.add.existing(this.player);

    this.playerGroup.add(this.player);

    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(30, "rocket");
    this.enemyBullets.setAll("anchor.x", 0.5);
    this.enemyBullets.setAll("anchor.y", 1);
    this.enemyBullets.setAll("outOfBoundsKill", true);
    this.enemyBullets.setAll("checkWorldBounds", true);

    this.createEnemies();

    this.titleScore = new Phaser.Text(
      this.game,
      100,
      100,
      `Score: ${this._score}`,
      {
        font: "24px Tahoma",
        fill: "white",
        align: "center"
      }
    );
    this.titleScore.anchor.setTo(0.5);
    this.menuPanel = this.add.group();
    this.menuPanel.add(this.titleScore);
  }

  update() {
    this.updateEnemies();
    this.updateCollide();

    this.game.physics.arcade.overlap(
      this.player.weapon.bullets,
      this.enemiesGroup,
      this.hitEnemy,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.playerGroup,
      this.enemiesGroup,
      this.hitPlayer,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.playerGroup,
      this.enemyBullets,
      this.hitPlayer,
      null,
      this
    );
  }

  hitEnemy(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    this.getExplosion(enemy.x, enemy.y);
    this._score++;
    this.titleScore.setText(`Score: ${this._score}`);
    this.game.camera.shake(0.01, 500);
  }

  hitPlayer(player, bullet) {
    player.destroy();
    bullet.kill();
    this.getExplosion(bullet.x, bullet.y);
    this.game.camera.shake(0.01, 500);

    this.game.time.events.add(500, () => this.state.start("GameOver", true, false, this._score));
  }

  createEnemies() {
    const spawnPoints = [
      { x: -10, y: -10 },
      { x: 400, y: -10 },
      { x: 800, y: -10 },
      { x: -10, y: 400 },
      { x: -10, y: 800 },
      { x: -10, y: this.game.height + 10 },
      { x: 400, y: this.game.height + 10 },
      { x: 800, y: this.game.height + 10 },
      { x: this.game.width + 10, y: -10 },
      { x: this.game.width + 10, y: 400 },
      { x: this.game.width + 10, y: 800 }
    ];

    let rndSpawnPoint =
      spawnPoints[this.game.rnd.integerInRange(0, spawnPoints.length - 1)];
    let x = rndSpawnPoint.x;
    let y = rndSpawnPoint.y;

    let enemy = this.enemiesGroup.getFirstDead();

    if (enemy === null) {
      enemy = new Enemy(this.game, x + 10, y + 10, this.player);
      this.enemiesGroup.add(enemy);
    }

    enemy.revive();

    enemy.x = x;
    enemy.y = y;

    return enemy;
  }

  getExplosion(x, y) {
    var explosion = this.explosionGroup.getFirstDead();

    if (explosion === null) {
      explosion = this.game.add.sprite(0, 0, "explosion");
      explosion.anchor.setTo(0.5, 0.5);

      var animation = explosion.animations.add(
        "boom",
        [0, 1, 2, 3, 4, 5, 6, 7],
        50,
        false
      );
      animation.killOnComplete = true;

      this.explosionGroup.add(explosion);
    }

    explosion.revive();
    explosion.x = x;
    explosion.y = y;
    explosion.angle = this.game.rnd.integerInRange(0, 360);
    explosion.animations.play("boom");

    return explosion;
  }

  updateCollide() {
    this.game.physics.arcade.collide(this.enemiesGroup, this.enemiesGroup);
  }

  enemyFires() {
    let enemyBullet = this.enemyBullets.getFirstExists(false);
    let livingEnemies = [];

    this.enemiesGroup.forEachAlive(function(m) {
      livingEnemies.push(m);
    });

    if (enemyBullet && livingEnemies.length > 0) {
      let random = this.game.rnd.integerInRange(0, livingEnemies.length - 1);

      let shooter = livingEnemies[random];
      enemyBullet.reset(shooter.body.x, shooter.body.y);

      this.game.physics.arcade.moveToObject(enemyBullet, this.player, 150);
      this.firingTimer = this.game.time.now + 250;
    }
  }

  updateEnemies() {
    if (this.enemiesGroup.countLiving() < this.MAX_ENEMIES) {
      this.createEnemies();
    }

    this.enemiesGroup.forEachAlive(m => {
      const distance = this.game.math.distance(
        m.x,
        m.y,
        this.player.x,
        this.player.y
      );
      if (this.game.time.now > this.firingTimer) {
        this.enemyFires();
      }
    });
  }
}
