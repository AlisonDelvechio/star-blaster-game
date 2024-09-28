import { 
    PATH_SPACESHIP_IMAGE, 
    PATH_ENGINE_IMAGE,
    PATH_ENGINE_SPRITES
} from "../utils/constants.js";

class Player {
    constructor(canvasWidth, canvasHeight) {

        this.width = 48 * 2;
        this.height = 48 * 2;
        this.velocity = 8;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        }

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }
    
    moveLeft() {
        this.position.x -= this.velocity;
    }
    
    moveRight() {
        this.position.x += this.velocity;
    }

    draw(ctx) {
        // Sprites
        ctx.drawImage(
            this.engineSprites, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );

        // Nave
        ctx.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );

        // Motor
        ctx.drawImage (
            this.engineImage, 
            this.position.x, 
            this.position.y + 8, 
            this.width, 
            this.height
        );
    }
}

export default Player;