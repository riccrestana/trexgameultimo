var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trexcolidido
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var gameover, gameoversprite, restart, restartsprite

var pontuacao;

var morte, salto, checkpoint


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  gameover = loadImage("gameOver.png")
  
  restart = loadImage("restart.png")

  trexcolidido = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  morte = loadSound("die.mp3")
  
  salto = loadSound("jump.mp3")
  
  checkpoint = loadSound("checkPoint.mp3")

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50, height-100, 20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("trexcolidindo", trexcolidido)

  trex.scale = 0.5;
  
  restartsprite = createSprite(width/2, height/2)
  gameoversprite = createSprite(width/2, height/2-35)
  
  restartsprite.addImage(restart)
  gameoversprite.addImage(gameover)
  
  restartsprite.scale = 0.4
  gameoversprite.scale = 0.5
  
  solo = createSprite(width/2,height-100,width,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
    
  soloinvisivel = createSprite(width/2,height-80,width,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  pontuacao = 0;
  
  
  trex.setCollider("circle",0, 0, 50)
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, width-110,height-500);
  if (pontuacao %500 === 0 && pontuacao>0){
    checkpoint.play()
  }
  
  if(estadoJogo === JOGAR){
  
    solo.velocityX = -(8 + pontuacao/1000)
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60);
    //console.log(frameRate)
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if((touches.lenght<0 || keyDown("space"))&& trex.y >= height-120) {
       trex.velocityY = -12;
      salto.play()
      touches=[];
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR;
      morte.play()
    }
      
    restartsprite.visible = false
    gameoversprite.visible = false
  }
    
  
     if (estadoJogo === ENCERRAR) {
     
      solo.velocityX = 0;
      trex.velocityY = 0;
       
      trex.changeAnimation("trexcolidindo", trexcolidido);
          
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0); 
       
      grupodenuvens.setLifetimeEach(-1)
      grupodeobstaculos.setLifetimeEach(-1)
       
    restartsprite.visible = true
    gameoversprite.visible = true
       
    if (mousePressedOver(restartsprite)){
        reset();
       
        }
  }


     
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);
  


  
    
  

  drawSprites();
}

 function reset(){
    estadoJogo = JOGAR
   grupodeobstaculos.destroyEach()
   grupodenuvens.destroyEach()
   pontuacao = 0
   trex.changeAnimation("running", trex_correndo)
  }

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(width,height-110,10,40);
  obstaculo.velocityX = -(8 + pontuacao/1000);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,1,40,10);
    nuvem.y = height-Math.round(random(400,300));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = width; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

