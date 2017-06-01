/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />
/// <reference path="../node_modules/phaser-ce/typescript/pixi.d.ts" />

import 'p2';
import 'pixi.js';
import * as phaser from 'phaser-ce';

function levelRenderer(game : any, walls : any, level : any) {
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
        return ''
      })
  })
}

const levels = {
  level01: [
    '',
    ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
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
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                        x',
    ' x                                                         x',
    ' x         x                                             x',
    ' x              x                                         x',
    ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  ]
}

class GameState {
  player:any;
  cursor:any;
  walls:any;
 
  preload() {
    // Load the bird sprite
    game
      .load
      .spritesheet('player', 'assets/sprite.jpg', 67, 81, 2);
    game
      .load
      .image('wall', 'assets/wall.png');
  }
   create() {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db';
    // Start the Arcade physics system (for movements and collisions)
    game
      .physics
      .startSystem(Phaser.Physics.ARCADE);
    // Add the physics engine to all game objects
    game.world.enableBody = true;

   this.cursor = game.input.keyboard.createCursorKeys();
    // Create the player in the middle of the game
   this.player = game.add.sprite(70, 400, 'player');

    var idle = this.player
      .animations
      .add('idle');

    this.player
      .animations
      .play('idle', 4, true);
   this.player.body.gravity.y = 600;
    //groups
    this.walls = game
      .add
      .group();

    levelRenderer(game, this.walls, levels.level01);
   
  }

   update () {

     game.physics.arcade.collide(this.player, this.walls);
      if (this.cursor.left.isDown) 
    this.player.body.velocity.x = -200;
else if (this.cursor.right.isDown) 
    this.player.body.velocity.x = 200;
else 
    this.player.body.velocity.x = 0;

// Make the player jump if he is touching the ground 
if (this.cursor.up.isDown && this.player.body.touching.down) 
    this.player.body.velocity.y = -250;
    
  }

  render() {
    game.debug.bodyInfo(this.player, 32, 32);
        game.debug.body(this.player);
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
