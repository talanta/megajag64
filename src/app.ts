/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />
/// <reference path="../node_modules/phaser-ce/typescript/pixi.d.ts" />

import 'p2';
import 'pixi.js';
import * as phaser from 'phaser-ce';
import levels from './levels/index'
import levelRenderer from './rendering/levelRenderer'
import preloadFn from './game/preload'
//End level management

class Drone {
  packages:any;
  drone:any;
  init() {
    this.drone = game.add.sprite(100, 100, 'drone');
    this.drone
      .animations
      .add('idle',[0,1]);
    this.packages = game.add.group();
    this.drone.animations.play('idle', 2, false);
    this.drone.body.velocity.setTo(-100,0);
    this.Timer();
  }
    Timer() {
    game.time.events.add(Phaser.Timer.SECOND * 2, this.BossFire, this);
  }

  BossFire() {
    var fireball = game.add.sprite(this.drone.body.x, this.drone.body.y+90, 'fireball');
    this.packages.add(fireball);
    fireball.body.velocity.y = 500;
      this.Timer();
    }

}

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
  fireball:any;
  boss:any;
  text:any;
  bossHP:number;
  currentLevel:number;
  bossFireballs:any;
  drone:Drone;
  background:any;

  preload() {
    preloadFn(game);
  }

  create() {
       var music = game.add.audio('mscintro',1,true);

    music.play();
    this.gamelaunched = false;
    this.cursor = game.input.keyboard.createCursorKeys();
    this.introscreen = game.add.sprite(0,0,'introscreen');
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
    }
  }

  initBoss() {
    this.bossText();
    this.boss = game.add.sprite(900, 550, 'boss');
    var anim = this.boss
      .animations
      .add('appear',[0,1,2,3]);
      anim.onComplete.add(this.BossReady, this);
    this.boss
      .animations
      .add('death',[6,7]);
    this.boss.animations.add('fire', [4,5]);
    this.boss.animations.play('appear', 2, false);
    this.bossHP = 15;
    this.boss.body.gravity.y = 600;
    this.bossFireballs = game.add.group();
  }

  BossReady() {
    this.boss.animations.play('fire', 2, true);
    this.bossTextKill();
    this.BossTimer();
    
  }

  BossTimer() {
    game.time.events.add(Phaser.Timer.SECOND * 1, this.BossFire, this);
  }

  BossFire() {
    var fireball = game.add.sprite(this.boss.body.x, this.boss.body.y+90, 'fireball');
    this.bossFireballs.add(fireball);
    fireball.body.velocity.x = -1000;
    if(this.bossHP !== 0)
    {
      this.BossTimer();
      if(this.boss.body.touching.down)
      this.boss.body.velocity.y = -Math.floor((Math.random() * 1000) + 10);
    }
  }

  bossHit() {
    this.bossHP = this.bossHP - 1;
    this.fireball.kill();
    if(this.bossHP === 0)
      this.bossDie();
  }

  bossDie(){
    this.boss.animations.stop();
    this.boss.animations.play('death', 2, false);
  }

   launchgame () {
     this.background = game.add.image(game.world.centerX, game.world.centerY, 'lvl1bg');
     this.background.anchor.set(0.5);
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
    this.player = game.add.sprite(70, 400, 'player');
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

    this.music = game.add.audio('lvl1',1,true);
   
    this.music.play();
  }

  bossText()
  {
    this.text = game.add.text(800, 500, 'AHAH NOTHING CAN STOP SHOWROOM! THIS IS MINE!', null);

    //	Center align
    this.text.anchor.set(0.5);
    this.text.align = 'center';

    //	Font style
    this.text.font = 'Arial Black';
    this.text.fontSize = 20;
    this.text.fontWeight = 'bold';

    //	Stroke color and thickness
    this.text.stroke = '#000000';
    this.text.strokeThickness = 6;
    this.text.fill = '#FFFFFF';
  }
  bossTextKill() {
    this.text.kill();
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
    var bgtile = game.add.image(game.world.centerX, game.world.centerY, 'lvl2bg');
    bgtile.anchor.set(0.5);
    
    game.world.sendToBack(bgtile);
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
    this.initBoss();
  }

   update () {
     if(this.gamelaunched)
     {
       //this.drone = new Drone();
       //this.drone.init();
       if(this.currentLevel === 1)
       {
         game.physics.arcade.collide(this.boss, this.walls);
          //boss colision
          game.physics.arcade.overlap(this.fireball, this.boss, this.bossHit, null, this);

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
    //game.debug.bodyInfo(this.boss, 32, 32);
     //   game.debug.body(this.boss);
     }
  }
}

const game = new Phaser.Game(1200, 800);
// Add the 'mainState' and call it 'main'
game.state.add('main', new GameState());
// Start the state to actually start the game
game.state.start('main');
