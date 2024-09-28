import { 
    PATH_SPACESHIP_IMAGE, 
    PATH_ENGINE_IMAGE,
    PATH_ENGINE_SPRITES,
    INITIAL_FRAMES
} from "../utils/constants.js";

import Projectile from "./Projectile.js";

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

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;
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
        // Nave
        ctx.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );

        // Sprites de movimento
        ctx.drawImage(
            this.engineSprites, 
            this.sx, 
            0, 
            48, 
            48,
            this.position.x,
            this.position.y + 10,
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

        this.update();
    }

    // Animação do Sprite
    update() {
        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INITIAL_FRAMES;
        }

        // Diminui a velocidade dos frames de imagem
        this.framesCounter--;
    }

    shoot(projectiles) {
        const p = new Projectile({
            x: this.position.x + this.width / 2,
            y: this.position.y 
        }, -10);

        projectiles.push(p);
    }
}

export default Player;