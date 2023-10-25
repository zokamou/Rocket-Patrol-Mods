class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload() {
        this.load.image('bigstars', './assets/stars1_bg.png')
        this.load.image('asteroids', './assets/asteroids.png')
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/baby_stars_bg.png');
        this.load.spritesheet('spin', './assets/spaceship_spritesheet.png', {frameWidth: 72, frameHeight: 72, startFrame: 0, endFrame: 9})
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('alien', './assets/enemy_spritesheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});

    }
    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0,0,640, 480, 'starfield').setOrigin(0,0);
        this.asteroids = this.add.tileSprite(0,0,640, 480, 'asteroids').setOrigin(0,0);
        this.bigstars = this.add.tileSprite(0,0,640, 480, 'bigstars').setOrigin(0,0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spin', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spin', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spin', 0, 10).setOrigin(0,0);
        this.hard = new Enemy(this, game.config.width, borderUISize*6 + borderPadding*4, 'alien', 0, 50).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

         // define keys
         keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
         keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
         keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
         keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // timer
        this.timer = 0;
        let timerConfig = {
            fontFamily: 'DotGothic16',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 60
        }
        
        this.timer_display = this.add.text(game.config.width - borderUISize*2  - borderPadding*4, borderUISize + borderPadding*2, game.settings.gameTimer, timerConfig);
        this.timer_display.text =  game.settings.gameTimer
        this.countup = this.time.delayedCall(game.settings.gameTimer, this.onEvent, [], this);
        
        // score
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'DotGothic16',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 180
        }
        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, ("Score: " + this.p1Score), scoreConfig);
        this.scoreLeft.text =  ("Score: " + this.p1Score)

        // fire button
        let fireConfig = {
            fontFamily: 'DotGothic16',
            fontSize: '16px',
            backgroundColor: '#F3B141',
            color: '#b00e11',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 80
        }
        this.fire = this.add.text(game.config.width - borderUISize*6 - borderPadding*2, borderUISize + borderPadding*3,"FIRE", fireConfig);
        this.fire.visible = false;

        // high score
        let highConfig = {
            fontFamily: 'DotGothic16',
            fontSize: '16px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 150
        }
        
        this.highScore = this.add.text((borderUISize*2 + borderPadding)*2 + 100, borderUISize + borderPadding*3, ("High-Score: " + hs), highConfig);
        this.highScore.setText("High-Score: " + hs);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'spinning',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('spin', { start: 0, end: 9, first: 0}),
            frameRate: 10
        });
        this.anims.create({
            key: 'saucer',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 9, first: 0}),
            frameRate: 10
        });

        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //play animations
        this.ship01.anims.play('spinning')
        this.ship02.anims.play('spinning')
        this.ship03.anims.play('spinning')
        this.hard.anims.play('saucer')

    }

    update() {

        this.highScore.setText("High-Score: " + hs);
        this.scoreLeft.setText("Score: " + this.p1Score);
        //set high score
        if(hs <= this.p1Score){
            this.highScore.text = ("High-Score: " + hs)
            hs = this.p1Score
        }

        //update timer
        let current = Phaser.Math.RoundTo(this.countup.getRemainingSeconds(), 0)
        if(current < 10 && current > 0 ){
            this.timer_display.setText(current);
        } else{
            this.timer_display.setText(current);
        }
        
        //show fire 
        if(fired == true){
            this.fire.visible = true;
        } else{
            this.fire.visible = false;
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //move bg
        this.starfield.tilePositionX -= .5;
        this.bigstars.tilePositionX -= 2;
        this.asteroids.tilePositionX += 1;
        this.asteroids.tilePositionY -= 1;

        //update sprites
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.hard.update();
            
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.hard)) {
            this.p1Rocket.reset();
            this.shipExplode(this.hard);
        }
        
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
      }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        let index = Phaser.Math.RoundTo(Math.random() * 100, 0) % 4
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });       
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = ("Score: " + this.p1Score);
        this.sound.play(sounds[index]);

    }

}
