import Player from "./class/Player.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Reduzo efeito de "esticar" a imagem
ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);

const keys = {
    left: false,
    right: false,
};

// Loop de gameplay que atualiza informações em tempo real
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.left && player.position.x >= 0) {
        player.moveLeft();
    }

    if (keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight();
    }

    player.draw(ctx);
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