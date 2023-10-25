// -------------------------------------------------------------------------------------------------------------------------
// Name: Zoe Feller
// Title: Rocket-Patrol-Mods
// Time: ~ 8 hours
// Points: 

// 1-Point Tier ---------
// Track a high score that persists across scenes and display it in the UI (1)
// Implement the 'FIRE' UI text from the original game (1)

// 3-Point Tier ---------
// Create 4 new explosion sound effects and randomize which one plays on impact (3)
// Display the time remaining (in seconds) on the screen (3)
// Using a texture atlas, create a new animated sprite for the Spaceship enemies (3)
// Create a new title screen (e.g., new artwork, typography, layout) (3)
// Implement parallax scrolling for the background (3)

// 5-Point Tier ---------
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)

// Total Points: 22
// -------------------------------------------------------------------------------------------------------------------------
let config = {
    type: Phaser.CANVAS, 
    render: {
        pixelArt: true
    },
    width: 640,
    height: 480,
    scene: [Menu, Play]
}
let game = new Phaser.Game(config);

let fired = false;
let keyF, keyR, keyLEFT, keyRIGHT;
let hs = 0;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let sounds = ['sfx_explosion1', 'sfx_explosion2', 'sfx_explosion3', 'sfx_explosion4']