class BootState extends Phaser.State {
  constructor() {
    super();
    this.raster;
    this.data;
    this.pos = [];
  }

  preload() {
    this.game.load.image('raster', 'assets/sprites/purple-raster.png');
    this.game.load.audio('music', 'assets/fx/Shaolin_Dub_-_04_-_Awake.mp3');
  }

  create() {
    let fx = game.add.audio('music');
    fx.allowMultiple = true;

    fx.play();
    this.data = this.game.make.tween({ y: -70 }).to( { y: 540 }, 3000, Phaser.Easing.Sinusoidal.In).yoyo(true).generateData(30);

    this.rasters = this.game.add.group();

    let total = 8;
    let offset = 4;

    for (let i = 0; i < total; i++)
    {
        this.raster = this.rasters.create(0, 0, 'raster');
        this.raster.width = 800;
        this.raster.alpha = (i + 1) * (1 / total);
        this.pos.push(i * offset);
    }
    this.title = new Phaser.Text(
      this.game,
      this.game.world.centerX,
      this.game.world.centerY - 200,
      "The Dream Game",
      {
        font: "36px Tahoma",
        fill: "white",
        align: "center"
      }
    );

    this.title.anchor.setTo(0.5);

    this.start = new TextButton({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      overFrame: 2,
      outFrame: 1,
      downFrame: 0,
      upFrame: 1,
      label: "Let's Rock",
      style: {
        font: "16px Verdana",
        fill: "white"
      }
    });

    this.controlls = new Phaser.Text(
      this.game,
      this.game.world.centerX,
      this.game.world.centerY + 200,
      `      Controlls: 
          Arrows - rotating your ship
          Spacebar - fire
          WASD - moving in chosed direction`,
      {
        font: "16px Tahoma",
        fill: "white",
        align: "center"
      }
    );
    this.controlls.anchor.setTo(0.5);

    this.start.onInputUp.add(() => this.state.start("Game"));

    this.menuPanel = this.add.group();
    this.menuPanel.add(this.title);
    this.menuPanel.add(this.controlls);
    this.menuPanel.add(this.start);
  }

  update() {
    this.rasters.resetCursor();

    for (var i = 0; i < this.rasters.total; i++)
    {
        this.pos[i]++;

        if (this.pos[i] === this.data.length)
        {
          this.pos[i] = 0;
        }

        this.rasters.cursor.y = 100 + this.data[this.pos[i]].y;
        this.rasters.next();
    }
  }
}
