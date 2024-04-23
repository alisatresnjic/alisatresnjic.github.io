import Phaser from 'phaser';
import spielfeld from './assets/spielfeld.png'
import basketball from './assets/basketball.png'
import openingScreen from './assets/openingScreen.png'
import rimNet from './assets/rimNet.png'
import lives from './assets/lives.png'
import ziel from './assets/ziel.png'
//import life from './assets/basketballLife.png'
//import lifeAway from './assets/basketballLife.png'

const orange = 0xFFA000
//#region Scene A | Loading Screen
class SceneA extends Phaser.Scene{

    constructor () 
    {
        super('SceneA')
    }

    preload ()
    {
        // loading screen 1

        const {width, height} = this.scale
        const x = width * 0.5
        const y = height * 0.5 


        const left = this.add.rectangle(x -50, y, 40, 75, orange, 1)
        const middle = this.add.rectangle(x, y, 40, 75, orange, 1)
        const right = this.add.rectangle(x  +50, y, 40, 75, orange, 1)

        this.add.tween({
            targets: left,
            scaleY: 2,
            duration: 100,
            repeat: -1,
            repeatDelay: 300,
            yoyo: true,
            ease: Phaser.Math.Easing.Bounce.InOut
        })

        this.add.tween({
            targets: middle,
            scaleY: 2,
            duration: 100,
            delay: 200,
            repeat: -1,
            repeatDelay: 300,
            yoyo: true,
            ease: Phaser.Math.Easing.Bounce.InOut
        })

        this.add.tween({
            targets: right,
            scaleY: 2,
            duration: 100,
            delay: 300,
            repeat: -1,
            repeatDelay: 300,
            yoyo: true,
            ease: Phaser.Math.Easing.Bounce.InOut
        })
    }

    create ()
    {
        this.time.delayedCall(2000, this.endScene, [], this);
    }

    endScene ()
    {
        this.scene.stop('SceneA');
        this.scene.start('SceneB');
    }
}
//#endregion 

//#region Scene B | Opening Screen
class SceneB extends Phaser.Scene{

    constructor () 
    {
        super('SceneB')
    }

    preload ()
    {
        // opening Screen
        this.load.image('openingScreen', openingScreen)

        // starting opening Music
       this.load.audio('openingMusic', './assets/openingMusic.mp3')    
    }

    

    create ()
    {
        // adding opening Screen
        this.add.image(400, 300, 'openingScreen')
        .setScale(1.54).setOrigin(0.29, 0.4)
        

        // adding opening music
        this.music = this.sound.add('openingMusic', {
            loop:true
        })
 
        if (!this.sound.locked){
            this.music.play()
        }
        else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, ()=> {
                this.music.play()
            })
        }


        // start button
        const playButton = this.add.rectangle(this.sys.scale.width / 2, this.sys.scale.height - 100, 290, 50, 0x000000, 1);
        playButton.setInteractive();
        const textButton = this.add.text(this.sys.scale.width / 2, this.sys.scale.height - 100, "Play").setOrigin(0.5);

        //Change scene
        playButton.on('pointerdown', () => {
            this.scene.start('SceneC')
        })

    }
}
//#endregion

//#region Scene C | Game Screen


class SceneC extends Phaser.Scene{

    constructor () 
    {
        super('SceneC')
        this.lives = 5;
        this.basketballs = [];
        this.initialBasketballPosition = { x: 640, y: 360 };
        this.moveDistance = 200; // Hier wird moveDistance initialisiert
        this.rimTween = null;
        this.shootDirection = new Phaser.Math.Vector2(); // shootDirection als Klassenattribut definieren
        this.isShooting = false; // Hinzufügen der Variable isShooting

        this.score = 0; // Punktestand
        this.scoreText = null; // Variable für die Textanzeige des Punktestands

        this.goalHit = false; // Variable zur Verfolgung, ob das Ziel bereits getroffen wurde
        this.shots = 0; // Variable zur Verfolgung der Anzahl der Schüsse

        this.misses = 0; // Variable zur Verfolgung der Anzahl der Fehlschüsse

    }
//#region preload
    preload ()
    {
        // loading game background 
        this.load.image('spielfeld', spielfeld)


        // loading basketball 
        this.load.spritesheet('basketball', basketball,  {
            frameHeight: 1280,
            frameWidth: 1204
        })


        // loading hoop 
        this.load.spritesheet('rimNet', rimNet,  {
            frameHeight: 4465,
            frameWidth: 5315
        })
        
        //loading game music 
        this.load.audio('gameMusic', './assets/gameMusic.mp3')   

        // lifes
        this.load.spritesheet('lives', lives, {
            frameHeight: 10,
            frameWidth: 10
        })

        // loading hoop 2

        this.load.spritesheet('ziel', ziel,  {
            frameHeight: 4465,
            frameWidth: 5315
        })

    }
//#endregion
    
    create ()
    {   
        // stop opening music 
        this.sound.stopAll();

        // start game music
        this.music = this.sound.add('gameMusic', {
            loop:true
        })
 
        if (!this.sound.locked){
            this.music.play()
        }
        else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, ()=> {
                this.music.play()
            })
        }

        // add game background 
        this.add.image(800, 770, 'spielfeld')
        .setScale(1.11).setOrigin(0.53, 1)

       
        
//#region add hoop
    // add hoop
    const centerX1 = this.cameras.main.width / 2;
    const bottom1 = this.cameras.main.height - 180;
    this.rimNet = this.physics.add.sprite(centerX1, bottom1, 'rimNet').setScale(0.24);

    //  Add hoop 2 (ziel) at the same position as rimNet
this.ziel = this.physics.add.sprite(centerX1, bottom1, 'ziel').setScale(0.145);
this.ziel.setVisible(false);

// Setze den Ankerpunkt beider Sprites auf die Mitte
this.ziel.setOrigin(0.5);

// Manuell die Bounding Box des Ziels anpassen
const boundingBoxWidth = 900; // Breite der Bounding Box
const boundingBoxHeight = 900; // Höhe der Bounding Box
const boundingBoxOffsetX = 2250; // X-Offset der Bounding Box
const boundingBoxOffsetY = -1000; // Y-Offset der Bounding Box
this.ziel.body.setSize(boundingBoxWidth, boundingBoxHeight);
this.ziel.body.setOffset(boundingBoxOffsetX, boundingBoxOffsetY);

    // Add your tween logic here
    let initialDuration = 4000; // Startdauer der Animation in Millisekunden

    // Initialisierung von rimTween als Klassenattribut
    this.rimTween = this.tweens.add({
        targets: this.rimNet,
        x: this.rimNet.x + this.moveDistance, // Zugriff auf moveDistance über this
        duration: initialDuration,
        yoyo: true,
        repeat: -1,
        onYoyo: () => {
            if (this.rimTween && this.rimTween.targets.length > 0) {
                this.rimTween.targets[0].x -= this.moveDistance; // Zugriff auf moveDistance über this
            }
        },
        onComplete: () => {
            initialDuration -= 100;
            if (initialDuration < 500) {
                initialDuration = 500;
            }
            if (this.rimTween) {
                this.rimTween.updateTweenData('duration', initialDuration);
                // Hier können Sie sicher auf die Tween-Dauer zugreifen
                console.log(this.rimTween.duration);
            }
        }
    });
//#endregion
// Add your hoop tween logic here
this.addHoopTween();

// Starte das Intervall für die Erhöhung der Tween-Geschwindigkeit
//this.startTweenSpeedIncreaseInterval();

        // Erstellen einer Taste für die Leertaste
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Eventlistener für die Leertaste hinzufügen
        this.input.keyboard.on('keydown-SPACE', this.handleSpaceBar, this);
        
         // add basketball
         const centerX = this.cameras.main.width / 2;
         const bottom = this.cameras.main.height -90;
         this.player = this.physics.add.sprite(centerX, bottom, 'basketball').setScale(0.1)

        
    // Add update loop to continuously update basketball position
    this.updateHoopPosition();

 
    this.physics.add.overlap(this.player, this.ziel, this.handleBasketballGoal, null, this);


    // Punktestandanzeige erstellen
    this.scoreText = this.add.text(this.sys.scale.width -16, 16, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#fff', 
        align: 'right'
    }).setOrigin(1, 0);

    // Hier Ihre anderen Erstellungsvorgänge, z.B. Basketball und Ziel hinzufügen

    // Überlappungsprüfung zwischen Basketball und Ziel
    this.physics.add.overlap(this.player, this.ziel, this.handleBasketballGoal, null, this);

    this.increaseTweenSpeed();

    this.physics.add.collider(this.player, this.ziel, this.handleBasketballGoalCollision, null, this);

    this.startTweenSpeedIncreaseInterval();


 
 }

    update() {
        this.updateHoopPosition();
    }


    updateHoopPosition() {
        // Continuously update the position of the basketball sprite to match the rimNet sprite
        this.ziel.x = this.rimNet.x;
        this.ziel.y = this.rimNet.y;
    }

    handleBasketballRimCollision(player, rimNet) {
        // Überprüfen, ob der Basketball in einem bestimmten Bereich des "rimNet" liegt
        // Du musst den Bereich entsprechend deiner Anforderungen definieren
        const allowedXRange = {
            min: rimNet.x - 500, // Beispiel: Linker Rand des "rimNet" minus 500 Pixel
            max: rimNet.x + 500 // Beispiel: Rechter Rand des "rimNet" plus 500 Pixel
        };
    
        // Überprüfen, ob der Basketball das RimNet nicht getroffen hat und der Ball bereits geschossen wurde
        if (!this.goalHit && this.isShooting && (player.x < allowedXRange.min || player.x > allowedXRange.max)) {
            this.misses++; // Erhöhe die Anzahl der Fehlschüsse um 1
    
            // Überprüfen, ob fünfmal hintereinander das Ziel nicht getroffen wurde
            if (this.misses === 3) {
                this.gameOver(); // Aufrufen der Methode für den Game Over
            }
        } 
    }
    
    

    loseLife() {
        // Leben abziehen
        if (this.lives > 0) {
            this.lives--;
    
            // Aktualisieren der Health-Anzeige
            this.updateHealthDisplay();
    
            // Überprüfen, ob keine Leben mehr übrig sind
            if (this.lives === 0) {
                this.gameOver();
            }
        }
    }
    

    // Methode zum Aktualisieren der Health-Anzeige
updateHealthDisplay() {

}

    resetBasketballPosition() {
        // Setze die Position des Basketballs auf die Ausgangsposition zurück
        this.player.setPosition(this.initialBasketballPosition.x, this.initialBasketballPosition.y);
    }

    handleBasketballGoalCollision(player, ziel) {
        player.setVelocity(0);
        player.setVisible(false); 
        // Hier wird der Kollision srückruf ausgeführt, wenn der Spieler das Ziel trifft
        this.handleBasketballGoal(player, ziel);
    }
    
    handleBasketballGoal(player, ziel) {
        if (!this.goalHit) { // Überprüfen, ob das Ziel bereits getroffen wurde
            this.goalHit = true; // Setze goalHit auf true, um zu signalisieren, dass das Ziel getroffen wurde
            this.score += 1; // Erhöhe den Punktestand um 1
            this.scoreText.setText('Score: ' + this.score); // Aktualisieren der Punktestandanzeige
            player.setVelocity(0); // Stoppe die Bewegung des Basketballs
            player.setVisible(false); // Mache den Basketball unsichtbar
    
            this.time.delayedCall(2000, () => {
                player.setVisible(true);
                this.goalHit = false; // Setze goalHit auf false, um den nächsten Treffer zu ermöglichen
                this.shots = 0; // Setze die Anzahl der Schüsse zurück
            });
        }
    }
    
    shoot() {
        // Führe den Schuss aus
        const shootVelocity = 2000; // Geschwindigkeit des Basketball-Schusses
        const directionX = this.input.mousePointer.x - this.player.x;
        const directionY = this.input.mousePointer.y - this.player.y;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / magnitude;
        const normalizedDirectionY = directionY / magnitude;
        this.player.setVelocity(normalizedDirectionX * shootVelocity, normalizedDirectionY * shootVelocity);
    
        // Erhöhe die Anzahl der Schüsse nur, wenn das Ziel nicht getroffen wurde
        if (!this.goalHit) {
            // Wenn der Spieler schießen kann, erhöhe die Anzahl der Schüsse
            this.shots++;
    
            // Überprüfen, ob die maximale Anzahl von Schüssen erreicht wurde
            if (this.shots >= 5) {
                // Wenn die maximale Anzahl von Fehlschüssen erreicht ist, rufe die gameOver-Methode auf
                this.gameOver();
                return; // Beende die Methode hier, um keine weiteren Aktionen auszuführen
            }
    
            // Setze den Schussstatus auf true, um anzuzeigen, dass ein Schuss im Gange ist
            this.isShooting = true;
    
            // Starte einen Timer, um den Schussstatus nach einer Verzögerung zurückzusetzen
            this.time.delayedCall(2000, () => {
                this.isShooting = false;
            });
        }
    }
    

    handleSpaceBar() {

        const coords = {x: this.player.x, y: this.player.y};

        // Überprüfen, ob der Basketball bereits in Bewegung ist
        if (!this.isShooting) {
            // Initialisierung von shootDirection lokal in der Methode
            const shootDirection = new Phaser.Math.Vector2();

        const centerX = this.cameras.main.width / 2;
        const mouseY = this.input.mousePointer.y;
        const mouseX = Phaser.Math.Clamp(this.input.mousePointer.x, centerX - 500, centerX + 500); // Begrenzen der X-Koordinate innerhalb des Bildschirms
        
        // Aktualisieren der Schussrichtung basierend auf der Mausposition
        this.shootDirection.setTo(mouseX - this.player.x, mouseY - this.player.y).normalize();
    
        if (!this.isShooting) {
            // Überprüfen, ob die maximale Anzahl von Schüssen erreicht wurde
            if (this.shots >= 5) {
                // Wenn die maximale Anzahl von Fehlschüssen erreicht ist, rufe die gameOver-Methode auf
                this.gameOver();
                return; // Beende die Methode hier, um keine weiteren Aktionen auszuführen
            }
    
            // Wenn der Spieler schießen kann, erhöhe die Anzahl der Schüsse
            this.shots++;
    
            // Setze den Schussstatus auf true, um anzuzeigen, dass ein Schuss im Gange ist
            this.isShooting = true;
    
            // Führe den Schuss aus
            this.shoot();
    
            // Starte einen Timer, um den Schussstatus nach einer Verzögerung zurückzusetzen
            this.time.delayedCall(2000, () => {
                this.isShooting = false;
            });
        }

        

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.player.disableBody(true, true)
                console.log(this.initialBasketballPosition.x)
                this.isShooting = false
                //this.player.x = coords.x
                //this.player.y = coords.y
                this.player.enableBody(true, coords.x, coords.y, true, true)
            }
        })

    }
}


/*increaseTweenSpeed() {
    if (this.rimTween && typeof this.rimTween.updateTweenData === 'function') {
        // Reduzieren Sie die Dauer des Tweens um einen bestimmten Prozentsatz (z. B. 10% schneller machen)
        const percentageDecrease = 0.1; // 10% Reduzierung
        const currentDuration = this.rimTween.duration; // Aktuelle Dauer des Tweens
        const newDuration = currentDuration * (1 - percentageDecrease); // Neue reduzierte Dauer
        this.rimTween.updateTweenData('duration', newDuration); // Aktualisieren Sie die Dauer des Tweens

        // Initialisierung der Zeitgeber-Ereignisse für die Geschwindigkeitsaktualisierung
        this.time.addEvent({
            delay: 5000, 
            callback: this.increaseTweenSpeed, // Korrekten Callback verwenden
            callbackScope: this,
            loop: true 
        });
    }
}*/

addHoopTween() {
    // Add your tween logic here
    let initialDuration = 4000; // Startdauer der Animation in Millisekunden

    // Initialisierung von rimTween als Klassenattribut
    this.rimTween = this.tweens.add({
        targets: this.rimNet,
        x: this.rimNet.x + this.moveDistance, // Zugriff auf moveDistance über this
        duration: initialDuration,
        yoyo: true,
        repeat: -1,
        onYoyo: () => {
            if (this.rimTween && this.rimTween.targets.length > 0) {
                this.rimTween.targets[0].x -= this.moveDistance; // Zugriff auf moveDistance über this
            }
        },
        onComplete: () => {
            initialDuration -= 100;
            if (initialDuration < 500) {
                initialDuration = 500;
            }
            if (this.rimTween) {
                this.rimTween.updateTweenData('duration', initialDuration);
                // Hier können Sie sicher auf die Tween-Dauer zugreifen
                console.log(this.rimTween.duration);
            }
        }
    });
}

startTweenSpeedIncreaseInterval() {
    // Starte ein Intervall, das alle 5 Sekunden die Tween-Geschwindigkeit erhöht
    this.tweenSpeedIncreaseInterval = this.time.addEvent({
        delay: 5000, // Ändern Sie die Verzögerung auf 5000 Millisekunden (5 Sekunden)
        callback: this.increaseTweenSpeed,
        callbackScope: this,
        loop: true
    });
}

increaseTweenSpeed() {
    if (this.rimTween && typeof this.rimTween.updateTweenData === 'function') {
        const percentageDecrease = 1000; // Zum Beispiel 20% Reduzierung
        const currentDuration = this.rimTween.duration; // Aktuelle Dauer des Tweens
        const newDuration = currentDuration * (1 - percentageDecrease); // Neue reduzierte Dauer
        this.rimTween.updateTweenData('duration', newDuration); // Aktualisieren Sie die Dauer des Tweens
    }
}



   
gameOver() {

    this.score = 0;
    this.shots = 0;
    this.misses = 0;
    // Anzeigen des "Game Over"-Texts auf dem Bildschirm
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.add.text(centerX, centerY, 'Game Over', { 
        fontSize: '64px', 
        fill: '#ff0000' }).setOrigin(0.5);

        // Button für den Neustart hinzufügen
    const restartButton = this.add.rectangle(this.sys.scale.width / 2, centerY + 100, 290, 50, 0x000000, 1);
    restartButton.setInteractive();
    const textButton = this.add.text(this.sys.scale.width / 2, centerY + 100, "Restart").setOrigin(0.5);

    // Eventlistener für den Restart-Button hinzufügen
    restartButton.on('pointerdown', () => {
        this.scene.start('SceneC'); // Spiel neu starten

        // Variablen und Zustände zurücksetzen
        this.isShooting = false; // Schussstatus zurücksetzen
        this.player.setPosition(this.initialBasketballPosition.x, this.initialBasketballPosition.y); // Spielerposition zurücksetzen
    });
}
 
} 

//#endregion

//#region Config
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: '100%',
        height: '100%'
    },
    width: 1280,
    height: 720,
    scene: [SceneA, SceneB, SceneC]
};

var game = new Phaser.Game(config);

//#endregion