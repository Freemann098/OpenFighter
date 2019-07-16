let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#C7FFF6',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    parent: 'open-fight',
    scene: [SceneGame]
};

let version = "dev - 0.0.1"; 
let game = new Phaser.Game(config);