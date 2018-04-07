class PlayerCursor extends Phaser.Sprite {
  constructor({ game, x, y, pivotOffset, asset }) {
    super(game, x, y, asset);

    this.anchor.setTo(0.5);
    this.pivot.x = pivotOffset;
    this.pivot.y = 0;
  }

  updatePosition({ x, y, angle }) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}
