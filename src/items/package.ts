/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
import * as phaser from 'phaser-ce';

// todo
class Package extends Phaser.Sprite {

  constructor(game:Phaser.Game, x:number, y:number) {
      super(game,x,y, 'package');
  }

  init(){
      this.game.world.add(this);
      this.body.immovable = true;
  }
}

export default Package