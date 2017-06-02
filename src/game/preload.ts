/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />

export default function preload(game: Phaser.Game) {
  game.load.spritesheet('player', 'assets/jagsprite.png', 72, 72);
  game.load.spritesheet('boss', 'assets/Boss.png', 89, 148);
  game.load.spritesheet('drone', 'assets/Drone.png', 72, 74);

  game.load.image('lvl1bg', 'assets/LEVEL01.png');
  game.load.image('lvl2bg', 'assets/LEVEL02.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('fireball', 'assets/fireball.png');
  game.load.image('introscreen', 'assets/intro.png');

  game.load.image('lava', 'assets/lava.png');

  game.load.image('exit', 'assets/exit.png');

  game.load.audio('mscintro', 'assets/intro-final.mp3');
  game.load.audio('lvl1', 'assets/megajaglvl1.mp3');
}
