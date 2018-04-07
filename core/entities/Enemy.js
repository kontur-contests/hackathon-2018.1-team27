class Enemy extends Phaser.Sprite {
  constructor(game, x, y, player) {
    super(game, x, y, "monster");
    this.player = player;

    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.SPEED = 125;
    this.TURN_RATE = 5;
  }

  update() {
    var targetAngle = this.game.math.angleBetween(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    if (this.rotation !== targetAngle) {
      var delta = targetAngle - this.rotation;

      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;

      if (delta > 0) {
        this.angle += this.TURN_RATE;
      } else {
        this.angle -= this.TURN_RATE;
      }

      if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
        this.rotation = targetAngle;
      }
    }

    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
  }
}
