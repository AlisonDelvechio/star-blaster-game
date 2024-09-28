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

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const drawProjectiles = ()=> {
    playerProjectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
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

// Loop de gameplay que atualiza informações em tempo real
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(playerProjectiles);

    drawProjectiles();
    clearProjectiles();

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



gameLoop();