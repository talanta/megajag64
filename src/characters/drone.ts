/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
import * as phaser from 'phaser-ce';

// todo
class Drone extends Phaser.Sprite {
  packages:Phaser.Group;
  timer:Phaser.TimerEvent;
  sfxdeath:Phaser.Sound;

  constructor(game:Phaser.Game, x:number, y:number) {
      super(game,x,y, 'drone');
  }

  init() {
      this.game.world.add(this);
      this.animations.add('idle',[0,1]);
      this.packages = this.game.add.group();
      this.animations.play('idle', 2, true);
      this.body.velocity.x = -50;
      this.scale.setTo(2,2);
      this.sfxdeath = this.game.add.audio('sfxdamage',1);
      this.Timer();
  }

  Timer() {
    this.timer = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.dropPackage, this);
  }

  kill() {
      super.kill();
      this.sfxdeath.play();
      return this;
  }

  dropPackage() {
    if(this.alive === true){
        var fireball = this.game.add.sprite(this.body.x+16, this.body.y+56, 'fireball');
        fireball.outOfBoundsKill = true;
        this.packages.add(fireball);
        fireball.body.velocity.y = 500;
        this.Timer();
    }
  }
}

export default Drone;