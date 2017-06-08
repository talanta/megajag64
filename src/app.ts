/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />
/// <reference path="../node_modules/phaser-ce/typescript/pixi.d.ts" />

import 'p2';
import 'pixi.js';
import * as phaser from 'phaser-ce';
import levels from './levels/index';
import levelRenderer from './rendering/levelRenderer';
import preloadFn from './game/preload';
import Boss from './characters/boss';
import Drone from './characters/drone';
import SpeechBubble from './util/speechbubble';
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
  exits:any;
  fireball:Phaser.Sprite;
  boss:Boss;
  currentLevel:number;
  drone:Drone;
  background:Phaser.Image;
  sfxshoot: Phaser.Sound;

  preload() {
    preloadFn(game);
  }

  create() {
       var music = game.add.audio('mscintro',1,true);

    music.play();
    this.gamelaunched = false;
    this.cursor = game.input.keyboard.createCursorKeys();
    this.introscreen = game.add.sprite(0,0,'introscreen');
    this.sfxshoot = game.add.audio('sfxshoot');
  }

  playerFire() {
    if(this.fireball === undefined || this.fireball !== undefined  && (this.fireball.body.x >= 1200 || this.fireball.body.x < 1) || this.fireball !== undefined  && !this.fireball.exists )
    {
    if(this.direction === 0) {
      this.fireball = game.add.sprite(this.player.body.x+50, this.player.body.y+30, 'fireball');
      this.fireball.body.velocity.x = 1000;
    } else {
      this.fireball = game.add.sprite(this.player.body.x, this.player.body.y+30, 'fireball');
      this.fireball.body.velocity.x = -1000;
    }
    this.sfxshoot.play();
    }
  }

   launchgame () {
     this.background = game.add.image(game.world.centerX, game.world.centerY, 'lvl1bg');
     this.background.anchor.set(0.5);
     this.background.cacheAsBitmap = true;
    // Set the background color to blue
    this.currentLevel = 0;
    game.stage.backgroundColor = '#3598db';
    // Start the Arcade physics system (for movements and collisions)
    game
      .physics
      .startSystem(Phaser.Physics.ARCADE);
    // Add the physics engine to all game objects
    game.world.enableBody = true;
   
    // Create the player in the middle of the game
    this.player = game.add.sprite(70, 650, 'player');
    this.player.animations.add('runright',[0,1,2,3]);
    this.player.animations.add('jump',[10,11]);
    this.player.animations.add('idle',[8,9]);
    this.player.play('idle', 4, true);
    this.player.body.gravity.y = 600;
    //groups
   
    this.walls = game.add.group();
    this.escalator = game.add.group();
    this.lava = game.add.group();
    this.exits = game.add.group();

    levelRenderer(game, this.walls, this.escalator,this.lava, this.exits, levels.level01);
    //0 = right
    this.direction = 0;
    new SpeechBubble(game,120, 630,100, 'GO!', false, 1).draw();
    this.music = game.add.audio('lvl1',0.7,true);
    this.drone = new Drone(game, 200,200);
    this.drone.init();
    this.music.play();
    //this.goToLevel2();
  }

  toggleDirection() {
    this.player.anchor.setTo(.5,.5);
    this.player.scale.x *= -1;
  }

  death() {
    this.player.body.x = 70;
    this.player.body.y = 400;
  }

  goToLevel2() {
    this.drone.kill();
    var bgtile = game.add.image(game.world.centerX, game.world.centerY, 'lvl2bg');
    bgtile.anchor.set(0.5);
    
    game.world.sendToBack(bgtile);
    bgtile.cacheAsBitmap = true;
    game.world.sendToBack(this.background);
    this.currentLevel = 1;
    this.escalator.removeAll();
    this.walls.removeAll();
    this.lava.removeAll();
    this.exits.removeAll();
    levelRenderer(game, this.walls, this.escalator,this.lava, this.exits, levels.level02);
    this.player.body.x = 70;
    this.player.body.y = 700;
    this.player.body.velocity.y = -1000;
    this.boss = new Boss(game);
    this.boss.init();
  }

   update () {
     if(this.gamelaunched)
     {
       //this.drone = new Drone();
       //this.drone.init();
       if(this.currentLevel === 1)
       {
         game.physics.arcade.collide(this.boss.sprite, this.walls);
          //boss colision
          game.physics.arcade.overlap(this.fireball, this.boss.sprite, () => this.boss.hit(this.fireball), null, this.boss);

       }
       if(this.currentLevel === 0){
         //drone
         game.physics.arcade.collide(this.drone, this.walls);
         if(this.drone.body.velocity.x === 0)
          this.drone.body.velocity.x = 50;
         if(this.drone.body.touching.right)
          this.drone.body.velocity.x = -50;
          //shooting
          game.physics.arcade.collide(this.drone.packages, this.player, this.death, null, this);
          game.physics.arcade.overlap(this.fireball, this.drone, () => this.drone.kill(), null, this.drone);
       }
          game.physics.arcade.collide(this.player, this.walls);
           game.physics.arcade.overlap(this.player, this.exits, this.goToLevel2, null, this);
          game.physics.arcade.overlap(this.player, this.lava, this.death, null, this);
          game.physics.arcade.collide(this.escalator, this.walls)
          this.escalator.forEach(function(item){
            if(item.body.touching.down || item.body.touching.up)
              item.body.velocity.y = - item.body.velocity.y;
          });
          game.physics.arcade.collide(this.player, this.escalator);
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

          if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            this.playerFire();

      // Make the player jump if he is touching the ground 
      if (this.cursor.up.isDown && this.player.body.touching.down) 
          this.player.body.velocity.y = -300;
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
      //game.debug.bodyInfo(this.drone, 32, 32);
      //game.debug.body(this.drone);
     }
  }
}

const game = new Phaser.Game(1200, 800);
// Add the 'mainState' and call it 'main'
game.state.add('main', new GameState());
// Start the state to actually start the game
game.state.start('main');
