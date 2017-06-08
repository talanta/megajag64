/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts" />
import * as phaser from 'phaser-ce';

class SpeechBubble extends Phaser.Sprite {
    width:number;
    text:string;
    bitmapText:Phaser.BitmapText;
    borders:any;
    tail:any;
    inverttail:boolean;
    timeshown:number;
    
    constructor(game:Phaser.Game, x:number, y:number, width:number, text:string, inverttail:boolean, timeshown?:number){
        super(game,x,y);
        this.width = width;
        this.text = text;
        this.inverttail = inverttail;
        this.timeshown = timeshown;
    }

    draw () {
        Phaser.Sprite.call(this, this.game, this.x, this.y);
        this.width = this.width || 27;
        var height = 18;
            // Set up our text and run our custom wrapping routine on it
        this.bitmapText = this.game.make.bitmapText(this.x + 12, this.y + 4, '8bitoperator', this.text, 15);
        this.wrapBitmapText();
        
        // Calculate the width and height needed for the edges
        var bounds = this.bitmapText.getLocalBounds();
        if (bounds.width + 18 > this.width) {
            this.width = bounds.width + 18;
        }
        if (bounds.height + 14 > height) {
            height = bounds.height + 40;
        }
        
        // Create all of our corners and edges
        this.borders = [
            this.game.make.tileSprite(this.x + 9, this.y + 9, this.width - 9, height - 9, 'bubble-border', 4),
            this.game.make.image(this.x, this.y, 'bubble-border', 0),
            this.game.make.image(this.x + this.width, this.y, 'bubble-border', 2),
            this.game.make.image(this.x + this.width, this.y + height, 'bubble-border', 8),
            this.game.make.image(this.x, this.y + height, 'bubble-border', 6),
            this.game.make.tileSprite(this.x + 9, this.y, this.width - 9, 9, 'bubble-border', 1),
            this.game.make.tileSprite(this.x + 9, this.y + height, this.width - 9, 9, 'bubble-border', 7),
            this.game.make.tileSprite(this.x, this.y + 9, 9, height - 9, 'bubble-border', 3),
            this.game.make.tileSprite(this.x + this.width, this.y + 9, 9, height - 9, 'bubble-border', 5)
        ];  
        
        // Add all of the above to this sprite
        for (var b = 0, len = this.borders.length; b < len; b++) {
            this.addChild(this.borders[b]);   
        }

        // Add the tail
        this.tail = this.addChild(this.game.make.image(this.x + 18, this.y + 3 + height, 'bubble-tail'));
        if(this.inverttail){
            this.tail.anchor.setTo(.5,.5);
            this.tail.scale.x *= -1;
        }

        // Add our text last so it's on top
        this.addChild(this.bitmapText);
        this.bitmapText.tint = 0x111111;
        
        // Offset the position to be centered on the end of the tail
        this.pivot.set(this.x + 25, this.y + height + 24);
        this.game.world.add(this);
        if(this.timeshown !== null)
            this.timer();
    }

    undraw(){
        this.kill();
    }

    timer(){
        this.game.time.events.add(Phaser.Timer.SECOND * this.timeshown, () => this.undraw(), this);
    }

    wrapBitmapText () {
        var words = this.bitmapText.text.split(' '), output = "", test = "";
        
        for (var w = 0, len = words.length; w < len; w++) {
            test += words[w] + " ";
            this.bitmapText.text = test;
            this.bitmapText.updateText();
            if (this.bitmapText.textWidth > this.width) {
                output += "\n" + words[w] + " ";
            }
            else {
                output += words[w] + " ";
            }
            test = output;
        }
        
        output = output.replace(/(\s)$/gm, ""); // remove trailing spaces
        this.bitmapText.text = output;
        this.bitmapText.updateText();
    }
}

export default SpeechBubble;