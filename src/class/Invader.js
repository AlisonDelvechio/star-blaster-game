import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";


class Invader {
    constructor(position, velocity) {
        this.position = position
        this.width = 50 * 0.8;
        this.height = 37 * 0.8;
        this.velocity = velocity;

        this.image = this.getImage(PATH_INVADER_IMAGE);
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

    moveDown() {
        this.position.y += this.height;
    }

    incrementVelocity(boost) {
        this.velocity += boost;
    }

    draw(ctx) { 
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    shoot(projectiles) {
        const p = new Projectile({
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height
        }, 10);

        projectiles.push(p);
    }

    hit(projectiles) {
        return (
            projectiles.position.x >= this.position.x &&
            projectiles.position.x <= this.position.x + this.width &&
            projectiles.position.y >= this.position.y &&
            projectiles.position.y <= this.position.y + this.height
        );
    }
}

export default Invader;