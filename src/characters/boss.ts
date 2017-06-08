/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
import * as phaser from 'phaser-ce';

import SpeechBubble from '../util/speechbubble'

class Boss {
    game:Phaser.Game;
    hitpoints: number;
    fireballs:any;
    sprite:Phaser.Sprite;
    text:SpeechBubble;

    constructor(game:any){
        this.game = game;
    }

  init() {
    this.introText();
    this.sprite = this.game.add.sprite(900, 550, 'boss');
    var anim = this.sprite
      .animations
      .add('appear',[0,1,2,3]);
      anim.onComplete.add(() => this.Ready(), this);
    this.sprite
      .animations
      .add('death',[6,7]);
    this.sprite.animations.add('fire', [4,5]);
    this.sprite.animations.play('appear', 2, false);
    this.hitpoints = 15;
    this.sprite.body.gravity.y = 600;
    this.fireballs = this.game.add.group();
  }

  Ready() {
    this.sprite.animations.play('fire', 2, true);
    this.BossTimer();
    
  }

  BossTimer() {
    this.game.time.events.add(Phaser.Timer.SECOND * 1, () => this.BossFire(), this);
  }

  BossFire() {
    var _fireball = this.game.add.sprite(this.sprite.body.x, this.sprite.body.y+90, 'fireball');
    this.fireballs.add(_fireball);
    _fireball.body.velocity.x = -1000;
    if(this.hitpoints > 0)
    {
      this.BossTimer();
      if(this.sprite.body.touching.down)
      this.sprite.body.velocity.y = -Math.floor((Math.random() * 1000) + 10);
    }
  }

  hit(fireball:Phaser.Sprite) {
      if(fireball !== undefined)
      {
        this.hitpoints = this.hitpoints - 1;
        fireball.kill();
        if(this.hitpoints <= 0)
        this.die();
      }
  }

  die(){
    this.sprite.animations.stop();
    this.sprite.animations.play('death', 2, false);
  }

   introText()
  {
      this.text = new SpeechBubble(this.game, 800,550,300, 'AHAH NOTHING CAN STOP SHOWROOM!', true, 4);
      this.text.draw();
  }

  introTextKill() {
    this.text.undraw();
  }

}

export default Boss;