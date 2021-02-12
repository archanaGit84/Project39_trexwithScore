//variables for images

var trex_running, trex_collided, groundImage, cloudImage, obstacle1,obstacle2,obstacle3,obstacle4,
obstacle5,obstacle6, restartImg, gameOverImg;
var gameState = "PLAY";
var score = 0;

localStorage.setItem("HighestScore", 0);
var highScore;


function preload() {
  trex_running = loadAnimation("/images/trex1.png", "/images/trex3.png", "/images/trex4.png");
  trex_collided = loadAnimation("/images/trex_collided.png");

  groundImage = loadImage("/images/ground2.png");

  cloudImage = loadImage("/images/cloud.png");

  obstacle1 = loadImage("/images/obstacle1.png");
  obstacle2 = loadImage("/images/obstacle2.png");
  obstacle3 = loadImage("/images/obstacle3.png");
  obstacle4 = loadImage("/images/obstacle4.png");
  obstacle5 = loadImage("/images/obstacle5.png");
  obstacle6 = loadImage("/images/obstacle6.png");

  restartImg = loadImage("/images/restart.png");
  gameOverImg = loadImage("/images/gameOver.png");

}

function setup(){
  
  createCanvas(windowWidth, windowHeight-20);

  trex = createSprite(width/4, height - 50, 20, 30);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 50);
  trex.debug = false;
  
  ground = createSprite(width/2, height - 40, width, 20);
  ground.addImage(groundImage);
  

  invisibleGround = createSprite(ground.width/2,height - 30, ground.width,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width/2, height/2+40);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Width",width);
  console.log("ground.width",ground.width)
  console.log(localStorage.getItem("HighestScore"))
}

function draw(){
  background("white");
  textSize(15);
  text("Score: " + score, windowWidth / 2 + camera.position.x - 200, 120);
  highScore = localStorage.getItem("HighestScore");
  text("Highest Score : " + highScore, windowWidth / 2 + camera.position.x - 200, 100);

  if(gameState === "PLAY"){
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round(getFrameRate() / 60);
    trex.velocityX = 4;
    camera.position.x = trex.x;
  
    if(trex.x + width/2 > ground.x + ground.width/2){
      ground.x = camera.x;
      invisibleGround.x = camera.x;
    }

    if(keyDown("space")&& trex.y > height - 146){
      //console.log(height)
      trex.velocityY = -10
    }

    trex.velocityY += 0.8;
   // console.log(round(camera.position.x))
  
    if(round(camera.position.x) % 15 === 0){
       spawnClouds();
    }
    if(frameCount % 80 === 0){
      spawnObstacles();
    }

    if(trex.isTouching(obstaclesGroup)){
      gameState = "END";
    }
  }

  else if(gameState === "END"){
   
     gameOver.visible = true;
      restart.visible = true;
      gameOver.x = trex.x;
      restart.x = gameOver.x;
      trex.changeAnimation("collided", trex_collided);
      trex.setVelocity(0,0);
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
  
      if (mousePressedOver(restart)) {
        reset();
      }
    
  }
  trex.collide(invisibleGround)
   drawSprites();
}

function spawnClouds() {
  
  var cloud = createSprite(camera.position.x + width/2 , 120, 40, 10);
  cloud.y = Math.round(random(50, height - 100));
  cloud.addImage(cloudImage);
  cloud.scale = 0.5;
  cloud.lifetime = round(width / cloud.velocityX);
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;


  cloudsGroup.add(cloud);
}

function spawnObstacles() {

    var obstacle = createSprite(camera.position.x + width/2,height - 60,20,20 );
    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = round(width / obstacle.velocityX);
    obstaclesGroup.add(obstacle);
  
}



function reset() {
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;

  trex.changeAnimation("running", trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  if (score > highScore) {
    localStorage.setItem("HighestScore", score);
  }

  score = 0;
  
}