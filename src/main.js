import Grid from "./class/Grid.js";
import Invader from "./class/Invader.js";
import Particle from "./class/Particle.js";
import Player from "./class/Player.js";
import Projectile from "./class/Projectile.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Remove o efeito de "esticar" a imagem
ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const playerProjectiles = [];

const grid = new Grid(3, 6);
const invadersProjectiles = [];

const particles = [];

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const drawProjectiles = ()=> {
    const projectiles = [...playerProjectiles, ...invadersProjectiles];
    
    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
}

const drawParticles = ()=> {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
}

// Limpa a lista de Projeteis
const clearProjectiles = ()=> {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
}

// Limpa as particulas da tela
const clearParticles = ()=> {
    playerProjectiles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
}

const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i+= 1) {
        const particle = new Particle(
            { x: position.x, y: position.y},
            { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2},
            2,
            color
        )

        particles.push(particle);
    }
}

// Checa se o Projetil atingiu o Invader
const checkShootInvaders = ()=> {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                createExplosion(
                    { 
                        x: invader.position.x + invader.width / 2, 
                        y: invader.position.y + invader.height / 2 
                    },
                    10,
                    "#941CFF"
                );

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};


// Checa se o Projetil atingiu o Invader
const checkShootPlayer = ()=> {
    invadersProjectiles.some((projectile, projectileIndex) => {
        if (player.hit(projectile)) {
            createExplosion(
                { 
                    x: player.position.x + player.width / 2, 
                    y: player.position.y + player.height / 2 
                },
                10,
                "#fff"
            );
            createExplosion(
                { 
                    x: player.position.x + player.width / 2, 
                    y: player.position.y + player.height / 2 
                },
                10,
                "#FF0000"
            );

            invadersProjectiles.splice(projectileIndex, 1);
        }
    });
};

// Loop de gameplay que atualiza informações em tempo real
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawParticles();
    drawProjectiles();
    clearProjectiles();
    clearParticles();
    checkShootInvaders();
    checkShootPlayer();

    grid.draw(ctx);
    grid.update();

    ctx.save();

    ctx.translate(
        player.position.x + player.width / 2, 
        player.position.y + player.height / 2
    );

    // Dispara o Projetil apenas ao apertar e soltar a tecla
    if (keys.shoot.pressed && keys.shoot.released) {
        player.shoot(playerProjectiles);
        keys.shoot.released = false;
    }

    // Movimenta para a Esquerda
    if (keys.left && player.position.x >= 0) {
        player.moveLeft();
        ctx.rotate(-0.15);
    }

    // Movimenta para a Direita
    if (keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight();
        ctx.rotate(0.15);
    }

    ctx.translate(
        - player.position.x + - player.width / 2, 
        - player.position.y + - player.height / 2
    );

    player.draw(ctx);

    ctx.restore();

    requestAnimationFrame(gameLoop);
};

// Player soltou a tecla
addEventListener("keydown", ()=> {
    const key = event.key.toLowerCase();

    // Evento de Ação para INICIAR movimento do Player
    if (key === "a" || key === "arrowleft") keys.left = true;
    if (key === "d" || key === "arrowright") keys.right = true;

    // Disparar Projetil
    if (key === "enter" || key === " ") keys.shoot.pressed = true;
});

// Tecla pressionada
addEventListener("keyup", ()=> {
    const key = event.key.toLowerCase();

    // Evento de Ação para PARAR o movimento do Player
    if (key === "a" || key === "arrowleft") keys.left = false;
    if (key === "d" || key === "arrowright") keys.right = false;

    if (key === "enter" || key === " ") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

setInterval(() => {
    const invader = grid.getRandomInvader();

    if (invader) {
        invader.shoot(invadersProjectiles);
    }
}, 1000)

gameLoop();