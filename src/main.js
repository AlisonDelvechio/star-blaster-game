import Grid from "./class/Grid.js";
import Obstacle from "./class/Obstacle.js";
import Particle from "./class/Particle.js";
import Player from "./class/Player.js";
import SoundEffects from "./class/SoundEffects.js";
import { GameState } from "./utils/constants.js";

const soundEffects = new SoundEffects

const startScreen = document.querySelector(".start-screen");             // Tela de Inicio
const gameOverScreen = document.querySelector(".game-over");             // Tela de Game Over
const scoreUi = document.querySelector(".score-ui");                     // Score do Jogador
const scoreElement = scoreUi.querySelector(".score > span");             // Elemento do Score
const levelElement = scoreUi.querySelector(".level > span");             // Elemento do Level
const highElement = scoreUi.querySelector(".high > span");               // Elemento do High Score
const buttonPlay = startScreen.querySelector(".button-play");            // Botão de Iniciar o Jogo
const buttonRestart = gameOverScreen.querySelector(".button-restart");   // Botão de Reiniciar o Jogo
const selectScreen = document.querySelector(".select-spaceship");        // Tela de Seleção
const spaceships = document.querySelectorAll(".spaceship");              // Naves
const buttonSelect = document.querySelector(".button-select");           // Botão de Seleção
let selectedSpaceship = "src/assets/images/spaceship.png";               // Nave Selecionada

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Remove o efeito de "esticar" a imagem
ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    highScore: 0
}

const showGameData = ()=> {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.highScore;
}

let player = new Player(canvas.width, canvas.height, selectedSpaceship);
const playerProjectiles = [];

const grid = new Grid(3, 6);
const invadersProjectiles = [];

const particles = [];
const obstacles = [];

const initObstacles = ()=> {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
}

initObstacles();

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const incrementScore = (value)=> {
    gameData.score += value;

    if (gameData.score > gameData.highScore) {
        gameData.highScore = gameData.score;
    }
}

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

const drawObstacles = ()=> {
    obstacles.forEach((obstacle) => {
        obstacle.draw(ctx);
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

// Checa se o Projetil atingiu o Invader
const checkShootInvaders = ()=> {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound();
                createExplosion(
                    { 
                        x: invader.position.x + invader.width / 2, 
                        y: invader.position.y + invader.height / 2 
                    },
                    10,
                    "#941CFF"
                );

                // Incrementa o Score do Jogador
                incrementScore(10);

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
            soundEffects.playExplosionSound();
            invadersProjectiles.splice(projectileIndex, 1);
            gameOver();
        }
    });
};

// Checa se o Projetil atingiu um Obstaculo
const checkShootObstacles = ()=> {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
        
        invadersProjectiles.some((projectile, projectileIndex) => {
            if (obstacle.hit(projectile)) {
                invadersProjectiles.splice(projectileIndex, 1);
            }
        });
    });
}

const spawnGrid = ()=> {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();
        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);
        grid.restart();
        gameData.level += 1;
    }
}

const gameOver = ()=> {
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

    currentState = GameState.GAME_OVER;
    player.alive = false;
    document.body.appendChild(gameOverScreen);
}

// Loop de gameplay que atualiza informações em tempo real
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.PLAYING) {
        showGameData();
        spawnGrid();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        checkShootInvaders();
        checkShootPlayer();
        checkShootObstacles();
    
        grid.draw(ctx);
        grid.update(player.alive);
    
        ctx.save();
    
        ctx.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        );
    
        // Dispara o Projetil apenas ao apertar e soltar a tecla
        if (keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
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
    }

    if (currentState === GameState.GAME_OVER) {
        checkShootObstacles();
        
        drawParticles();
        drawProjectiles();
        drawObstacles();

        clearParticles();
        clearProjectiles();

        grid.draw(ctx);
        grid.update(player.alive);
    }

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

buttonPlay.addEventListener("click", ()=> {
    startScreen.remove();
    selectScreen.style.display = "flex";
});

buttonRestart.addEventListener("click", ()=> {
    currentState = GameState.PLAYING;
    player.alive = true;

    grid.invaders.length = 0;
    grid.invadersVelocity = 1;

    invadersProjectiles.length = 0;

    gameData.score = 0;
    gameData.level = 0;

    gameOverScreen.remove();
});

buttonSelect.addEventListener("click", () => {
    player = new Player(canvas.width, canvas.height, selectedSpaceship);

    selectScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invadersProjectiles);
        }
    }, 1000);
});

spaceships.forEach(spaceship => {
    spaceship.addEventListener("click", () => {
        spaceships.forEach(s => s.classList.remove("selected"));
        spaceship.classList.add("selected");
        selectedSpaceship = spaceship.querySelector("img").src.replace(window.location.origin + "/", "");
    });
});

gameLoop();