// Missile constructor
class Enemy extends Phaser.Sprite {
    constructor(game, x, y, player) {
        super(game, x, y, "monster");
        this.player = player; 

        // Set the pivot point for this sprite to the center
        this.anchor.setTo(0.5, 0.5);
        // Enable physics on the enemy
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.enableBody = true;
        // Define constants that affect motion
        this.SPEED = 250; // enemy speed pixels/second
        this.TURN_RATE = 5; // turn rate in degrees/frame
    }


    update() {
        // Calculate the angle from the enemy to the mouse cursor game.input.x
        // and game.input.y are the mouse position; substitute with whatever
        // target coordinates you need.
        var targetAngle = this.game.math.angleBetween(
            this.x, this.y,
            this.player.x, this.player.y
        );

        // Gradually (this.TURN_RATE) aim the enemy towards the target angle
        if (this.rotation !== targetAngle) {
            // Calculate difference between the current angle and targetAngle
            var delta = targetAngle - this.rotation;

            // Keep it in range from -180 to 180 to make the most efficient turns.
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (delta > 0) {
                // Turn clockwise
                this.angle += this.TURN_RATE;
            } else {
                // Turn counter-clockwise
                this.angle -= this.TURN_RATE;
            }

            // Just set angle to target angle if they are close
            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }

        // Calculate velocity vector based on this.rotation and this.SPEED
        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
    }
}