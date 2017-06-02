//Level management
export default function levelRenderer(game : any, walls : any, escalators: any, lava: any, exits:any, level : any) {
  var lastItem = '';
  var velocity = 0;
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
        if(item === 'y') {
          const escalator = game.add.sprite(20 * j, 20 * i, 'wall');
          escalators.add(escalator);
          escalator.body.immovable = true;
          if(lastItem === 'y')
          {
              escalator.body.velocity.setTo(0,velocity);
          }
          else {
            velocity = Math.floor((Math.random() * 100) + 100);
            escalator.body.velocity.setTo(0,velocity);
          }
          
          //  This makes the game world bounce-able
          escalator.body.collideWorldBounds = true;
          
          //  This sets the image bounce energy for the horizontal 
          //  and vertical vectors. "1" is 100% energy return
          escalator.body.bounce.set(1);
        }
         if(item === 'v') {
          const lav = game.add.sprite(20 * j, 20 * i, 'lava');
          lava.add(lav);
        }
        if(item === 'e') {
          const lav = game.add.sprite(20 * j, 20 * i, 'exit');
          exits.add(lav);
        }
        lastItem = item;
        return ''
      })
  })
}
