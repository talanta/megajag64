/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
import * as phaser from 'phaser-ce';

// todo
class winscreen extends Phaser.Sprite {
    constructor(game:Phaser.Game)
    {
        super(game,game.world.centerX, game.world.centerY, 'winsheet');
        this.anchor.set(0.5);
    }

   init() {
      this.game.world.add(this);
      this.animations.add('idle'); //,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
      this.animations.play('idle', 8, true, false);
  }
}

export default winscreen;