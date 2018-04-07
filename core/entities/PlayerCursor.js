class PlayerCursor extends Phaser.Sprite {
  constructor({ game, x, y, pivotY, asset }) {
    super(game, x, y, asset);

    this.anchor.setTo(0.5);
    this.pivot.x = 0;
    this.pivot.y = pivotY;
  }

  updatePosition({ x, y, angle }) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}
