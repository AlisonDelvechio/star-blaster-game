class Obstacle {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
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

export default Obstacle;