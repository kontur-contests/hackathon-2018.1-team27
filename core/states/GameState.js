class GameState extends Phaser.State {
  constructor() {
    super();
    this.MAX_ENEMIES = 6
  }

  preload () {
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('rocket', '/assets/gfx/rocket.png');

    this.load.spritesheet('explosion', '/assets/gfx/explosion.png', 128, 128);
    this.load.image('cursor', '/assets/sprites/cursor.png');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

     // Create a group to hold the enemies
     this.enemiesGroup = this.game.add.group();

     // Create a group for explosions
     this.explosionGroup = this.game.add.group();

    this.createPlayer();
    this.createEnemies();
    this.createCursor();
  }

  update() {
    this.updatePlayer();
    this.updateEnemies();
    this.updateCursor();
  }

  render() {
    this.game.debug.body(this.player);
    this.game.debug.body(this.cursor);
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

  createCursor() {
    this.cursor = this.add.sprite(
      this.player.x,
      this.player.y,
      'cursor'
    );
    this.cursor.anchor.setTo(0.5, 0.5);

    this.cursor.pivot.x = 0;
    this.cursor.pivot.y = this.player.width + 40;

    this.graphics = this.game.add.graphics(
      this.player.x,
      this.player.y
    );

    this.graphics.lineStyle(1, 0xFF0000, 0.5);

    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(30, -(this.player.width + 40));
    this.graphics.lineTo(-30, -(this.player.width + 40));
    this.graphics.lineTo(0, 0);
    this.graphics.endFill();
  }

  updateCursor() {
    this.cursor.angle = this.player.angle;
    this.cursor.x = this.player.x;
    this.cursor.y = this.player.y;

    this.graphics.angle = this.player.angle;
    this.graphics.x = this.player.x;
    this.graphics.y = this.player.y;
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
