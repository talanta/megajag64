/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
//Level management

function commonRender(check:string, 
  game:Phaser.Game, 
  group: Phaser.Group, 
  item:string, 
  i:number, j:number, immovable:boolean = false) {
  if(item !== check){return;}
  const block = game.add.sprite(20 * j, 20 * i, 'exit');
  group.add(block);
  block.body.immovable = true;
}

function renderEscalator(game:Phaser.Game, 
  escalators:Phaser.Group, 
  last:{item:string, velocity:Number}, 
  item: string, 
  i: number, 
  j: number): Number {

  if (item !== 'y') { return;}

  const escalator = game.add.sprite(20 * j, 20 * i, 'wall');
  escalators.add(escalator);
  escalator.body.immovable = true;
    let velocity:Number = 0;
  if(last && last.item === 'y'){
     velocity = last.velocity;
  }
  else {
    velocity = Math.floor((Math.random() * 100) + 100);    
  }
  escalator.body.velocity.setTo(0,velocity);
  //  This makes the game world bounce-able
  escalator.body.collideWorldBounds = true;
  //  This sets the image bounce energy for the horizontal 
  //  and vertical vectors. "1" is 100% energy return
  escalator.body.bounce.set(1);      
  return velocity;
}

export default function levelRenderer(game : Phaser.Game, 
  walls : Phaser.Group, 
  escalators: Phaser.Group, 
  lava: Phaser.Group, 
  exits: Phaser.Group, 
  level : any) {
  
  level.reduce((result : any, line : string, i : number) => {
    line.split('').reduce((last, item, j) => {

      commonRender('x', game, walls, item, i, j, true);
      commonRender('v', game, lava, item, i, j);
      commonRender('e', game, exits, item, i, j);

      const velocity = renderEscalator(game, escalators, <{item:string,velocity:number}>last, item, i,j);
      
      return {item, velocity}
    }, {})
  })
}
