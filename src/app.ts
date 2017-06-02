/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import * as phaser from 'phaser';


//Level management
function levelRenderer(game : any, walls : any, escalators: any, lava: any, level : any) {
  level.reduce((result : any, line : string, i : number) => {
    line
      .split('')
      .reduce((res, item, j) => {
        if (item === 'x') {
          const wall = game
            .add
            .sprite(20 * j, 20 * i, 'wall');

          walls.add(wall);
          wall.body.immovable = true;
        }
        if(item === 'y') {
          const escalator = game.add.sprite(20 * j, 20 * i, 'wall');
          escalators.add(escalator);
          escalator.body.immovable = true;
              escalator.body.velocity.setTo(0,200);
          
          //  This makes the game world bounce-able
          escalator.body.collideWorldBounds = true;
          
          //  This sets the image bounce energy for the horizontal 
          //  and vertical vectors. "1" is 100% energy return
          escalator.body.bounce.set(1);
        }
         if(item === 'v') {
          const lav = game.add.sprite(20 * j, 20 * i, 'lava');
          lava.add(lav);
        }
        return ''
      })
  })
}

const levels = {
  level01: [
    '',
    ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    x',
    ' x         x                                              x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                  xxxxxxx',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                         xxxxxxxxxxxxxxxx',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                yyyyyyyy                x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x         x    x                                         x',
    ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxvvvvvvvvvxxxxxxxxxxxxxxxx'
  ],
  level02: []
}

//End level management


//Game Management
class GameState {
  player:any;
  cursor:any;
  walls:any;
  direction:any;
  escalator:any;
  lava:any;
  gamelaunched:boolean;
  music:any;
  introscreen:any;

  preload() {
    // Load the bird sprite
    game
      .load
      .spritesheet('player', 'assets/jagsprite.png', 72, 72);
    game
      .load
      .image('wall', 'assets/wall.png');
    game.load.image('introscreen', 'assets/intro.png');

          game
      .load
      .image('lava', 'assets/lava.png');
      game.load.audio('mscintro', 'assets/intro-final.mp3');
      game.load.audio('lvl1', 'assets/megajaglvl1.mp3');
  }

  create() {
       var music = game.add.audio('mscintro',1,true);

    music.play();
    this.gamelaunched = false;
    this.cursor = game.input.keyboard.createCursorKeys();
    this.introscreen = game.add.sprite(0,0,'introscreen');
  }

   launchgame () {
    // Set the background color to blue
    
    game.stage.backgroundColor = '#3598db';
    // Start the Arcade physics system (for movements and collisions)
    game
      .physics
      .startSystem(Phaser.Physics.ARCADE);
    // Add the physics engine to all game objects
    game.world.enableBody = true;

   
    // Create the player in the middle of the game
   this.player = game.add.sprite(70, 400, 'player');

    this.player
      .animations
      .add('runright',[0,1,2,3]);

            this.player
      .animations
      .add('jump',[10,11]);

    this.player
      .animations
      .add('idle',[8,9]);



    this.player
      .animations
      .play('idle', 4, true);

   this.player.body.gravity.y = 600;
    //groups
    this.walls = game
      .add
      .group();

    this.escalator = game.add.group();
    this.lava = game.add.group();

    levelRenderer(game, this.walls, this.escalator,this.lava, levels.level01);
    //0 = right
   this.direction = 0;

   this.music = game.add.audio('lvl1',1,true);

    this.music.play();
  }

  toggleDirection() {
          this.player.anchor.setTo(.5,.5);
         this.player.scale.x *= -1;
  }

  death() {
    this.player.body.x = 70;
        this.player.body.y = 400;
  }

   update () {
     if(this.gamelaunched)
     {
          game.physics.arcade.collide(this.player, this.walls);
          game.physics.arcade.collide(this.player, this.escalator);
          game.physics.arcade.overlap(this.player, this.lava, this.death, null, this);
          game.physics.arcade.collide(this.escalator, this.walls)

            if (this.cursor.left.isDown) 
            {
            
              this.player.body.velocity.x = -200;
              this.player.animations.play('runright', 4, true);
                if(this.direction === 0)
              {
                this.toggleDirection();
                this.direction = 1;
              }
            }
            else if (this.cursor.right.isDown) 
            {
              
          this.player.body.velocity.x = 200;
          this.player.animations.play('runright', 4, true);
          if(this.direction === 1)
              {
                this.toggleDirection();
                this.direction = 0;
              }
          }
          else 
          {
              this.player.body.velocity.x = 0;
              this.player.animations.play('idle', 4, true);
          }

      // Make the player jump if he is touching the ground 
      if (this.cursor.up.isDown && this.player.body.touching.down) 
          this.player.body.velocity.y = -250;
          if(!this.player.body.touching.down)
            this.player.animations.play('jump', 4, true);

            //player stuck between shit
            if(this.player.body.touching.up && this.player.body.touching.down)
            {
              this.death();
            }
     }
     else {
       //Intro screen
       if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
       {
          game.sound.stopAll();
          this.introscreen.kill();
       this.launchgame();

        this.gamelaunched = true;
       }
     }
}
  

  render() {
    if(this.gamelaunched)
     {
    //game.debug.bodyInfo(this.player, 32, 32);
    //    game.debug.body(this.player);
     }
  }

  


}

var game = new Phaser.Game(1200, 800);

// Add the 'mainState' and call it 'main'
game
  .state
  .add('main', new GameState());
// Start the state to actually start the game
game
  .state
  .start('main');
