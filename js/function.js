
  // Initialize Phaser, and create a 400x490px game
  var game = new Phaser.Game(400, 490, Phaser.CANVAS, 'gameDiv');

  // Create our 'main' state that will contain the game
  var mainState = {
  
      preload: function(){
          // This function will be executed at the beginning     
          // That's where we load the game's assets 
          
          // Change the background color of the game
          game.stage.backgroundColor = '#71c5cf';
  
          // Load the bird sprite
          game.load.image('hero', 'img/hero.png');
          game.load.image('kryptonite', 'img/kryptonite.png'); 
      },
  
      create: function(){ 
          // This function is called after the preload function     
          // Here we set up the game, display sprites, etc.  
          // Set the physics system
          game.physics.startSystem(Phaser.Physics.ARCADE);
  
          // Display the bird on the screen
          this.hero = this.game.add.sprite(53, 49, 'hero');
  
          // Add gravity to the bird to make it fall
          game.physics.arcade.enable(this.hero);
          this.hero.body.gravity.y = 1000;
  
          // Call the 'jump' function when the spacekey is hit
          var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          spaceKey.onDown.add(this.jump, this);
          game.input.onDown.add(this.jump, this);
          
          this.kryptonite = game.add.group(); // Create a group  
          this.kryptonite.enableBody = true;  // Add physics to the group  
          this.kryptonite.createMultiple(20, 'kryptonite'); // Create 20 pipes
          
          this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
          this.score = 0;  
          this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
          this.hero.anchor.setTo(-0.2, 0.5); 
      },
  
      update: function(){
          // This function is called 60 times per second    
          // It contains the game's logic 
          // If the bird is out of the world (too high or too low), call the 'restartGame' function
          if (this.hero.inWorld == false)
              this.restartGame();
          game.physics.arcade.overlap(this.hero, this.kryptonite, this.hitPipe, null, this);
          if (this.hero.angle < 20)  
          this.hero.angle += 1;
      },
      // Make the bird jump 
      jump: function(){  
          if (this.hero.alive == false)  
              return;
          // Add a vertical velocity to the bird
          this.hero.body.velocity.y = -350;
          // Create an animation on the bird
          var animation = game.add.tween(this.hero);
  
          // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
          animation.to({angle: -20}, 100);
  
          // And start the animation
          animation.start();  
      },
  
      // Restart the game
      restartGame: function(){  
          // Start the 'main' state, which restarts the game
          game.state.start('main');
      },
      addOnePipe: function(x, y) {  
          // Get the first dead pipe of our group
          var kryptonite = this.kryptonite.getFirstDead();
  
          // Set the new position of the pipe
          kryptonite.reset(x, y);
  
          // Add velocity to the pipe to make it move left
          kryptonite.body.velocity.x = -200; 
  
          // Kill the pipe when it's no longer visible 
          kryptonite.checkWorldBounds = true;
          kryptonite.outOfBoundsKill = true;
      },
      addRowOfPipes: function() {
        
          // Pick where the hole will be
          var hole = Math.floor(Math.random() * 5) + 1;
  
          // Add the 6 pipes 
          for (var i = 0; i < 8; i++)
              if (i != hole && i != hole + 1) 
                  this.addOnePipe(400, i * 60 + 20);     
              this.score += 1;  
          this.labelScore.text = this.score;
      },
      hitPipe: function() {  
          // If the bird has already hit a pipe, we have nothing to do
          if (this.hero.alive == false)
              return;
  
          // Set the alive property of the bird to false
          this.hero.alive = false;
  
          // Prevent new pipes from appearing
          game.time.events.remove(this.timer);
  
          // Go through all the pipes, and stop their movement
          this.kryptonite.forEachAlive(function(p){
              p.body.velocity.x = 0;
          }, this);
     }
  };
  
  // Add and start the 'main' state to start the game
  game.state.add('main', mainState);  
  game.state.start('main');