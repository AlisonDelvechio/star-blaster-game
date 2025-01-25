class SoundEffects {
    constructor() {
        this.shootSounds = [
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
        ];

        this.hitSounds = [
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
        ];

        this.explosionSounds = new Audio("src/assets/audios/explosion.mp3");
        this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;
    }
}

export default SoundEffects;