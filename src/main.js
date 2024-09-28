import Player from "./class/Player.js";
import Projectile from "./class/Projectile.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Remove o efeito de "esticar" a imagem
ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const p = new Projectile({ x: 300, y: 700}, 5);
const keys = {
    left: false,
    right: false,
};

// Loop de gameplay que atualiza informações em tempo real
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    p.draw(ctx);

    ctx.save();

    ctx.translate(
        player.position.x + player.width / 2, 
        player.position.y + player.height / 2
    );

    if (keys.left && player.position.x >= 0) {
        player.moveLeft();
        ctx.rotate(-0.15);
    }

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

// Evento de Ação para INICIAR movimento do Player
addEventListener("keydown", ()=> {
    const key = event.key.toLowerCase();
    if (key === "a" || key === "arrowleft") keys.left = true;
    if (key === "d" || key === "arrowright") keys.right = true;
});

// Evento de Ação para PARAR o movimento do Player
addEventListener("keyup", ()=> {
    const key = event.key.toLowerCase();
    if (key === "a" || key === "arrowleft") keys.left = false;
    if (key === "d" || key === "arrowright") keys.right = false;
});



gameLoop();