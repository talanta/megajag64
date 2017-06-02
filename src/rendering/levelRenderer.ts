/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
//Level management

function renderWall(game:Phaser.Game, walls:Phaser.Group, item: string, i: number, j: number){
  if (item !== 'x') { return;}
  const wall = game.add.sprite(20 * j, 20 * i, 'exit');
  walls.add(wall);
  wall.body.immovable = true;
}

function renderEscalator(game:Phaser.Game, 
  escalators:Phaser.Group, 
  last:{item:string, velocity:Number}, 
  item: string, 
  i: number, 
  j: number): Number {

  if (item !== 'y') { return;}
  let velocity:Number = 0;
  const escalator = game.add.sprite(20 * j, 20 * i, 'wall');
  escalators.add(escalator);
  escalator.body.immovable = true;
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

export default function levelRenderer(game : Phaser.Game, walls : Phaser.Group, escalators: Phaser.Group, lava: any, exits:any, level : any) {
  
  var velocity = 0;
  level.reduce((result : any, line : string, i : number) => {
    line.split('').reduce((last, item, j) => {
      renderWall(game, walls, item, i, j);
      const velocity = renderEscalator(game, escalators, <{item:string,velocity:number}>last, item, i,j);
        if(item === 'v') {
        const lav = game.add.sprite(20 * j, 20 * i, 'exit');
        lava.add(lav);
      }
      if(item === 'e') {
        const lav = game.add.sprite(20 * j, 20 * i, 'exit');
        exits.add(lav);
      }
      
      return {item, velocity}
    }, {})
  })
}
