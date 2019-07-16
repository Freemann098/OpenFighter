class SceneGame extends Phaser.Scene {

    constructor()
    {
        super({ key: 'SceneGame' });
    }

    phaser = null;
    cursors = null;
    ground = null;

    player = {
        gameObject: null,
        playerVelocity: 125,
        playerJumpVelocity: -750,
        jumpAngle: false,
        jumpTimerAlloc: 0,
        jumpDir: 0,
        jumpTimer: 0,
        currentState: 0,
        states: {
            none: 0,
            idle: 1,
            moving: 2,
            jumping: 3,
            crouching: 4,
            punching: 5,
            kicking: 6
        }
    };
    //Controls
    punchKeyX;

    preload()
    {
        this.phaser = this;
        this.phaser.load.image('player', 'assets/proto/player.png');
        this.phaser.load.image('stage', 'assets/proto/stage1_large.png');
        this.phaser.load.spritesheet('player_walk', 'assets/proto/player/player_walk1.png', {frameWidth:280,frameHeight:476});
        this.phaser.load.spritesheet('player_atk', 'assets/proto/player/player_combat.png', {frameWidth:280,frameHeight:476});

        //Controls init
        this.punchKeyX = this.phaser.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    create()
    {
        this.phaser.cameras.main.setSize(1280,720);
        this.cameras.main.setBounds(0, 0, 1500, 800);

        this.cursors = this.phaser.input.keyboard.createCursorKeys();
        this.phaser.add.image(0, 0, 'stage').setOrigin(0,0);//.setScale(3).refreshBody();
        this.ground = this.phaser.physics.add.staticSprite(640, 720, '').setSize(1280, 155).setOrigin(0,0).setAlpha(0);

        this.player.gameObject = this.phaser.physics.add.sprite(300, 400, 'player_walk').toggleFlipX().setScale(0.8);

        this.phaser.physics.add.collider(this.player.gameObject, this.ground);

        this.initAnimations();
    }

    update ()
    {
        //console.log(this.player.currentState);
        this.manageStates();

        this.phaser.cameras.main.centerOn(this.player.gameObject.x+300, this.player.gameObject.y-100);
        
        if(!this.player.gameObject.body.touching.down)
         {
             this.player.currentState = this.player.states.jumping;
         }
    }

    manageStates()
    {
        if(this.player.currentState == this.player.states.none || 
            this.player.currentState == this.player.states.idle ||
            this.player.currentState == this.player.states.moving ||
            this.player.currentState == this.player.states.crouching){
             if(this.cursors.left.isDown)
             {
                 this.player.currentState = this.player.states.moving;
                 this.player.gameObject.setVelocityX(-this.player.playerVelocity+30);
                 this.player.gameObject.anims.play('player_run_back', true);
             }
             else if(this.cursors.right.isDown)
             {
                 this.player.currentState = this.player.states.moving;
                 this.player.gameObject.setVelocityX(this.player.playerVelocity);
                 this.player.gameObject.anims.play('player_run', true);
             }
             else if(this.cursors.down.isDown)
             {
                 this.player.currentState = this.player.states.crouching;
                 this.player.gameObject.setVelocityX(0);
                 this.player.gameObject.anims.play('player_crouch', true);
             }
             else if(Phaser.Input.Keyboard.JustDown(this.punchKeyX))
             {
                 this.player.currentState = this.player.states.punching;
                 this.player.gameObject.setVelocityX(0);
                 this.player.gameObject.anims.play('player_punch', true);
             }
             else
             {
                 this.player.currentState = this.player.states.idle;
                 this.player.gameObject.setVelocityX(0);
                 this.player.gameObject.anims.play('player_idle', true);
             }
         }
 
         if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.currentState != this.player.states.jumping)
         {
             this.player.currentState = this.player.states.jumping;
             this.player.gameObject.setVelocityY(this.player.playerJumpVelocity);
         }
         
         if(this.player.currentState == this.player.states.jumping)
         {
             this.player.gameObject.anims.play('player_jump', true);
             this.player.jumpTimerAlloc += 1;
             if(this.player.jumpTimerAlloc<=4){
                 if(this.cursors.left.isDown)
                 {
                     this.player.jumpDir = 0;
                     this.player.jumpAngle = true;
 
                 }
                 else if(this.cursors.right.isDown)
                 {
                     this.player.jumpDir = 1;
                     this.player.jumpAngle = true;
                 }
             }
             if(this.player.gameObject.body.touching.down)
             {
                 this.player.currentState = this.player.states.none;
                 this.player.jumpAngle = false;
                 this.player.jumpTimerAlloc = 0;
                 this.player.jumpTimer = 0;
             }
         }
         else if(this.player.currentState == this.player.states.punching)
         {
             if(this.player.gameObject.anims.getProgress() == 1)
             {
                 this.player.currentState = this.player.states.none;
             }
         }
 
         if(this.player.jumpAngle)
         {
             this.player.jumpTimer += 1;
             if(this.player.jumpTimer<=70){
                 if(this.player.jumpDir == 0)//left
                 {
                     this.player.gameObject.setVelocityX(-this.player.playerVelocity-100);
                 }
                 else if(this.player.jumpDir == 1 )//right
                 {
                     this.player.gameObject.setVelocityX(this.player.playerVelocity+100);
                 }
             }
             else
                 this.player.jumpAngle = false;
         }
    }

    initAnimations()
    {
        this.phaser.anims.create({
            key: 'player_run',
            frames: this.phaser.anims.generateFrameNumbers('player_walk', { start: 0, end: 6}), //0-7 8fps
            frameRate: 15,
            repeat: -1
        });
        this.phaser.anims.create({
            key: 'player_run_back',
            frames: this.phaser.anims.generateFrameNumbers('player_walk', { start: 6, end: 0}),//fps 6
            frameRate: 12,
            repeat: -1
        });
        this.phaser.anims.create({
            key: 'player_idle',
            frames: this.phaser.anims.generateFrameNumbers('player_walk', { start: 8, end: 15}),
            frameRate: 10,
            repeat: -1
        });
        this.phaser.anims.create({
            key: 'player_jump',
            frames: this.phaser.anims.generateFrameNumbers('player_walk', { start: 16, end: 23}),
            frameRate: 6,
            repeat: -1
        });
        this.phaser.anims.create({
            key: 'player_crouch',
            frames: this.phaser.anims.generateFrameNumbers('player_walk', { start: 7, end: 7}),
            frameRate: 1,
            repeat: -1
        });
        this.phaser.anims.create({
            key: 'player_punch',
            frames: this.phaser.anims.generateFrameNumbers('player_atk', { start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        });
    }
};