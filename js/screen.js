


var blue_img;
var green_img;
var red_img;
var yellow_img;
var locked_img;
var unlocked_img;

var shadow_img;
function preload() {

    blue_img = loadImage("../assets/sq_blue.png");
    green_img = loadImage("../assets/sq_green.png");
    red_img = loadImage("../assets/sq_red.png");
    yellow_img = loadImage("../assets/sq_yellow.png");
    shadow_img = loadImage("../assets/Shadow.png");
    locked_img = loadImage("../assets/sq_locked.png");
    unlocked_img = loadImage("../assets/sq_unlocked.png");

}

class Vector2{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}
class player{

    constructor(device_id,position,color)
    {
        this.device_id = device_id;
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = color;
        this.movements = [];
    }

    move()
    {
        this.position.x += this.velocity.x*speed;
        this.position.y += this.velocity.y*speed;
    }

}
class pulse{

    constructor(position,smallSize, bigSize){
        this.position = position;
        this.smallSize = smallSize;
        this.bigSize = bigSize;
        this.value = 0;
        this.grow = true;
    }
}

class block
{
    constructor(ID,position,color, fixed){
        this.ID = ID;
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = color;
        this.fixed = fixed;
        
    }

    move()
    {
        this.position.x += this.velocity.x*speed;
        this.position.y += this.velocity.y*speed;
    }
}

var airconsole;
var movements = [];
var up = 0
var down =1
var left = 2
var right =3
var playerTest;

var speed =3;

var players = [];
var pulses = [];
var blocks = [];

var weight;

var level = 2;
var maxLevel = 2;
var reset = true;


var numMoveableBlocks = 0;


var playersize =20;
var blocksize = 100;

var debug = false;

var init = function()
{
    airconsole = new AirConsole();

     airconsole.onMessage = function(device, data)
     {


        //console.log("Message Recieved");

        if(data.type == "Movement")
        {

           // console.log("Message Type: Movement");
            var p;
            for(var i = 0; i < players.length; i++)
            {   
                if(players[i] != null){

                   
                    if(players[i].device_id == device)
                    {
                      p = players[i];
                      break;
                    }
                }
                
            }
            if(p!=null)
            {

               //console.log(data.vector);
                var tempx = data.vector.x;
                var tempy = data.vector.y;

              // p.velocity.x += data.vector.x;
              //  p.velocity.y += data.vector.y;

                //console.log(p.velocity);
                p.movements[data.direction].x = tempx;
                p.movements[data.direction].y = tempy;
              
                
            
                



            }

        }
        
        if(data.type =="Pulse")
        {

            for(var i=0;i < players.length;i++){
                var p = players[i];
                if(p!=null)
                {
                    if(p.device_id==device){
                        spawnPulse(p.position);
                    }
                }
            }

        }

        
        
        //console.log(data);

    }

    airconsole.onConnect = function(device_id){
 
       // console.log("SOMETHING CONNECTED");

        spawnPlayer(device_id);

        sendPuzzleColors();

        var p = players[players.length-1];
        var col = p.color;
        p.movements[0] = new Vector2(0,0);
        p.movements[1] = new Vector2(0,0);
        p.movements[2] = new Vector2(0,0);
        p.movements[3] = new Vector2(0,0);

       

       //console.log(players[players.length-1]);

         airconsole.message(device_id,
         {
             type:"Color",
             color_data:col
         });

        
    
    }

    airconsole.onDisconnect = function(device_id){
 
        for(var i = 0; i < players.length; i++)
        {
            if(players[i]!=null){

                if(device_id == players[i].device_id){

                    spawnPulse(players[i].position);
                    players[i] = null;
                    break;
                }
            }
            
        }
        //console.log("SOMETHING DISCONNECTED");
       
    
    }
}

    
function setup()
{

    createCanvas(800, 800);
    colorMode(RGB);
    var randColor = color(random(0,1),0.5,1);
    //log(airconsole);

   // playerTest = new player(new Vector2(300,300), new Vector2(0,0),randColor)

   blocks.push(new block(0,new Vector2(300,300),"red",false));
   blocks.push(new block(1,new Vector2(600,200),"green",false));
   blocks.push(new block(2,new Vector2(200,700),"yellow",false));
   blocks.push(new block(3,new Vector2(450,600),"blue",false));
   blocks.push(new block(4,new Vector2(500,500),"grey",true));
}


var numMoveables = function()
{

    var temp = 0;
    for(var j = 0;j< blocks.length; j++)
    {
        if(blocks[j]!=null)
        {
           
            if(blocks[j].fixed==false)
            {

                temp++;

            }
        }
    }

    return temp;
}

    
function draw() 
{
   


  textSize(canvas.width);
  text(level, 0, 0);
  
   
   
    background(255);

    //keyboardControls();

  
    drawGrid();
    updateVelocities();
    movePlayers();
   // drawShadows();
    drawBlocks();
    moveBlocks();
    drawPlayers();
    drawPulses();

    var numPlayers = 0;
    

    for(var i =0; i < players.length;i++)
    {
        if(players[i]!=null){
            numPlayers++;
        }
    }

   // console.log(numMoveables());

  
    weight = round(numPlayers/numMoveables());


    //console.log(weight);


    // 0 1 // R Y //
    // 2 3 // B G //
     
    if(reset==true){
        reset = false;
        blocks=[];

        if(level==1){

            blocks.push(new block(0,new Vector2(50,400),"red",false));
            blocks.push(new block(1,new Vector2(650,400),"yellow",false));
            
            //g("Level one set");
        }

        if(level==2){

            blocks.push(new block(0,new Vector2(50,400),"red",false));
            blocks.push(new block(1,new Vector2(650,400),"yellow",false));
            blocks.push(new block(100,new Vector2(350,400),"grey",true));
            
            //console.log("Level two set");
        }

        if(level == 3){
            blocks.push(new block(0,new Vector2(100,100),"red",false));
            blocks.push(new block(1,new Vector2(600,600),"yellow",false));
            blocks.push(new block(2, new Vector2(300,300),"blue",false));
        }

        if(level == 4)
        {

            blocks.push(new block(0,new Vector2(300,500),"red",false));

            blocks.push(new block(100,new Vector2(300-blocksize,500),"grey",true));
            blocks.push(new block(101,new Vector2(300,500+blocksize),"grey",true));
            blocks.push(new block(102,new Vector2(300,500-blocksize),"grey",true));


            blocks.push(new block(1,new Vector2(300,90),"yellow",false));
            blocks.push(new block(3,new Vector2(100,700),"green",false));
          
        }


        if(level == 5)
        {
            blocks.push(new block(0,new Vector2(50,50),"red",false));

            blocks.push(new block(1,new Vector2(700,50),"yellow",false));

            blocks.push(new block(2,new Vector2(50,700),"blue",false));

            blocks.push(new block(3,new Vector2(700,700),"green",false));
        }


        if(level == 6)
        {
            blocks.push(new block(0,new Vector2(500,700),"red",false));
            blocks.push(new block(1,new Vector2(650,400),"yellow",false));
            

            blocks.push(new block(200,new Vector2(300,300),"lightgrey",false));
            blocks.push(new block(3,new Vector2(300-blocksize,300),"green",false));
            blocks.push(new block(201,new Vector2(300-2*blocksize,300),"lightgrey",false));
            blocks.push(new block(202,new Vector2(300-blocksize,300+blocksize),"lightgrey",false));
            blocks.push(new block(203,new Vector2(300-blocksize,300-blocksize),"lightgrey",false));
        }

        if(level ==7)
        {

            blocks.push(new block(0,new Vector2(50,50),"red",false));

            blocks.push(new block(1,new Vector2(700,50),"yellow",false));

            blocks.push(new block(2,new Vector2(50,700),"blue",false));

            blocks.push(new block(3,new Vector2(700,700),"green",false));


            blocks.push(new block(200, new Vector2(playersize*1.5,400),"lightgrey",false));

            for(var i = 100; i<600;i+=blocksize)
            {
                blocks.push(new block(200+i, new Vector2(playersize*1.5+i,400),"grey",true));
            }

            blocks.push(new block(200, new Vector2(600+playersize*1.5,400),"lightgrey",false));

        

        }

        if(level == 8)
        {


             blocks.push(new block(0,new Vector2(200,200),"red",false));

             blocks.push(new block(1,new Vector2(200,300),"yellow",false));

             blocks.push(new block(2,new Vector2(700,100),"blue",false));

             blocks.push(new block(3,new Vector2(550,500),"green",false));

            for(var i = 50; i<=500;i+=blocksize)
            {                

                blocks.push(new block(200+i, new Vector2(100,i),"grey",true));
                //blocks.push(new block(200+i, new Vector2(300,i),"grey",true));
            }

        }
        




        

        //sendPuzzleColors();

    }


    checkRepair();


   

    
   

};


var drawShadows = function()
{

    for(var i =0; i < blocks.length; i++)
    {
        var b = blocks[i];
        if(b!=null)
        {
           // tint(255, 255*(0.3));
            image(shadow_img,b.position.x,b.position.y,blocksize*(1.8),blocksize*(1.8));
        }

       
    }
    tint(255, 255);
}

var sendPuzzleColors =function() 
{
   

   
}

var checkRepair = function()
{

    var targetPositions = [];
    targetPositions[0] = new Vector2(0,0);
    targetPositions[1] = new Vector2(0,0);
    targetPositions[2] = new Vector2(0,0);
    targetPositions[3] = new Vector2(0,0);

    if(blocks.length>0)
    {
        for(var i = 0; i <blocks.length;i++)
        {
            if(blocks[i]!=null){
                if(blocks[i].ID==0){
                    targetPositions[0] =blocks[i].position;
                }
            }
        }
        
    }
   

    targetPositions[1].x = targetPositions[0].x + blocksize;
    targetPositions[1].y = targetPositions[0].y;

    targetPositions[2].x = targetPositions[0].x;
    targetPositions[2].y = targetPositions[0].y +blocksize;

    targetPositions[3].x = targetPositions[0].x +blocksize;
    targetPositions[3].y = targetPositions[0].y +blocksize;



    if(debug==true){
    
        noFill();
        strokeWeight(2);
        stroke(50);
        rect(targetPositions[1].x, targetPositions[1].y,blocksize,blocksize);
        rect(targetPositions[2].x, targetPositions[2].y,blocksize,blocksize);
        rect(targetPositions[3].x, targetPositions[3].y,blocksize,blocksize);

    }


    var complete = true;

    for (var j = 0; j<=3 ;j++){

        for(var i = 0; i < blocks.length;i++)
        {
        
            if(blocks[i]!=null)
            {
                var b = blocks[i];
                var identity = j
                if(b.ID == identity )
                {

                    if(distance(b.position, targetPositions[identity])<10)
                    {
                        //something here

                    }else{
                        complete = false;
                        break;
                    }
                }


            }
        }
        
    } 

    //console.log("Complete: "+complete);

    if(complete){
        level ++;
        if(level > maxLevel){
            level = 1;
        }
        reset = true;
    }


}

var drawGrid= function(){
    
    for (var x = 0; x < width; x += width /20 ){
		for (var y = 0; y < height; y += height /(20)) {
			stroke(230);
			strokeWeight(2);
			line(x+40, 0, x+40, height);
			line(0, y+40, width, y+40);
		}
	}
}

var drawBlocks = function()
{
    
    
   
    for(var i = 0; i < blocks.length; i++)
    {
        var b = blocks[i];

        if(b!=null)
        {



            strokeWeight(2);
            stroke(0);
           
             var img = null;
            if(b.color == "red"){

                img = red_img;
            }
            if(b.color =="yellow")
            {
                img = yellow_img;
            }
            if(b.color == "green")
            {
                img = green_img;
            }
            if(b.color =="blue")
            {
                img = blue_img;
                
            }
            if(b.color=="grey")
            {
                img = locked_img;
            }
            if(b.color=="lightgrey"){
                img = unlocked_img;
            }

            if(img == null){
                fill(b.color);
                rect(b.position.x, b.position.y,blocksize,blocksize);
            }else{
                image(img,b.position.x,b.position.y,blocksize,blocksize);
            }

            

            fill(0);
            noStroke();
            textSize(32);
            //textAlign(0,0);



            if(!b.fixed)
            {

                var txt = (weight-abs(b.velocity.x)-abs(b.velocity.y));
                //console.log(txt);

                text(txt, b.position.x+blocksize/2, b.position.y+blocksize/2);
            }
           
        }

    }
    

}

var updateVelocities = function()
{

    for(var i = 0; i < players.length; i++)
    {

        var vel = new Vector2(0,0);

        if(players[i]!=null)
        {

            

            for(var j = 0; j < players[i].movements.length; j++)
            {
                if(players[i]!=null){

                    vel.x += players[i].movements[j].x;
                    vel.y -= players[i].movements[j].y;

                }
                
            }

            //console.log(vel);

            players[i].velocity = vel;

            if(players[i].velocity.x!=0 || players[i].velocity.y!=0)
                
                {
                    //console.log(players[i].velocity);
                }
            
        }
    }
}


var moveBlocks = function()
{
        
    for(var i =0; i < blocks.length; i++)
    {
        if(blocks[i]!=null)
        {

            noStroke();
            var warningCol = color(255,0,0,0.5);
            fill("grey");
            var b = blocks[i];

            
          
            


            if((abs(b.velocity.y)+abs(b.velocity.x)+0.5)>weight)
            {
                b.move();
            }
                
            
           
            b.velocity = new Vector2(0,0);

            if(b.position.x < playersize*1.5){
                b.position.x = playersize*1.5;

              
                rect(0,0,playersize*2,height);
               
            }

            if(b.position.x > width-blocksize-playersize*1.5)
            {
                b.position.x = width-blocksize-playersize*1.5;
               
               
                rect(width-playersize*2,0,playersize*2,height);
            }

            if(b.position.y < playersize*1.5){
                b.position.y = playersize*1.5;

                rect(0,0,width,playersize*2);
                
            }

            if(b.position.y > height-blocksize-playersize*1.5)
            {
                b.position.y = height-blocksize-playersize*1.5;
                
            }

            for(var j=0; j<players.length;j++)
            {
                if(players[j]!=null){

                    var p = players[j];

                    if(p.position.x > b.position.x-playersize && p.position.x < b.position.x + blocksize){
    
                        if(p.position.y > b.position.y-playersize)
                        {
                            if(abs((p.position.y -(b.position.y-playersize))<10))
                            {
                                p.position.y = b.position.y-playersize;
                            }
                            
                        
                        }
    
    
                        if(p.position.y < b.position.y+blocksize)
                        {
                            
                                if((((p.position.y - (b.position.y+blocksize))>-10)))
                                {
                                p.position.y = b.position.y+blocksize
                                }
                        }
                    }
    
                    if(p.position.y > b.position.y-playersize && p.position.y < b.position.y + blocksize){
    
                        if(p.position.x > b.position.x-playersize)
                        {
                            if(abs((p.position.x -(b.position.x-playersize))<10))
                            {
                                p.position.x = b.position.x-playersize;
                            }
                            
                        
                        }
    
    
                        if(p.position.x < b.position.x+blocksize)
                        {
                            
                                if((((p.position.x - (b.position.x+blocksize))>-10)))
                                {
                                p.position.x = b.position.x+blocksize
                                }
                        }
                    }
                }
                
            }

            for(var k=0; k<blocks.length;k++)
            {
                if(blocks[k]!=null){


                
    

                    var bl = blocks[k];

                    if(bl.fixed == false){
                        if( bl.position.x > b.position.x-playersize &&  bl.position.x < b.position.x + blocksize){
    
                            if( bl.position.y > b.position.y-playersize)
                            {
                                if(abs(( bl.position.y -(b.position.y-blocksize))<10))
                                {
                                    bl.position.y = b.position.y-blocksize;
                                }
                                
                            
                            }
        
        
                            if(bl.position.y < b.position.y+blocksize)
                            {
                                
                                    if((((bl.position.y - (b.position.y+blocksize))>-10)))
                                    {
                                     bl.position.y = b.position.y+blocksize
                                    }
                            }
                        }
        
                        if(bl.position.y > b.position.y-blocksize && bl.position.y < b.position.y + blocksize){
        
                            if(bl.position.x > b.position.x-blocksize)
                            {
                                if(abs((bl.position.x -(b.position.x-blocksize))<10))
                                {
                                    bl.position.x = b.position.x-blocksize;
                                }
                                
                            
                            }
        
        
                            if(bl.position.x < b.position.x+blocksize)
                            {
                                
                                    if((((bl.position.x - (b.position.x+blocksize))>-10)))
                                    {
                                    bl.position.x = b.position.x+blocksize
                                    }
                            }
                        }
                    }

                    else
                    {
                        if(b.position.x > bl.position.x-blocksize && b.position.x < bl.position.x + blocksize){
    
                            if(b.position.y > bl.position.y-blocksize)
                            {
                                if(abs((b.position.y -(bl.position.y-blocksize))<10))
                                {
                                    b.position.y = bl.position.y-blocksize;
                                }
                                
                            
                            }


                            if(b.position.y < bl.position.y+blocksize)
                            {
                                
                                    if((((b.position.y - (bl.position.y+blocksize))>-10)))
                                    {
                                     b.position.y = bl.position.y+blocksize
                                    }
                            }
                        }

                        if(b.position.y > bl.position.y-blocksize && b.position.y < bl.position.y + blocksize){

                            if(b.position.x > bl.position.x-blocksize)
                            {
                                if(abs((b.position.x -(bl.position.x-blocksize))<10))
                                {
                                    b.position.x = bl.position.x-blocksize;
                                }
                                
                            
                            }


                            if(b.position.x < bl.position.x+blocksize)
                            {
                                
                                    if((((b.position.x - (bl.position.x+blocksize))>-10)))
                                    {
                                    b.position.x = bl.position.x+blocksize
                                    }
                            }
                        }

                    }


                    
                }
            }




        }






    }
}   

var spawnPulse = function(position){

    pulses.push(new pulse(new Vector2(position.x+10,position.y+10),playersize,80));
}
var drawPulses = function()
{
    
    for(var i =0; i < pulses.length; i++)
    {
        var p = pulses[i];
        if(p.value >= 0){


           // console.log(p.value);
             noFill();
             strokeWeight(2);
             stroke(0);
            
             var size = lerp(p.smallSize, p.bigSize, p.value)
             var increment;
             if(p.value > 1) {p.grow =false}
             if(p.grow){increment = 0.2}else{increment = -0.2}
             
             rect(p.position.x-size/2, p.position.y-size/2, size, size);
             p.value += increment;
        }
      
        
        
    }
}

var drawPlayers= function(){


    strokeWeight(2);
    stroke(0);
    for(var i = 0; i < players.length; i++){

        if(players[i] != null){

            var p = players[i];
            fill(p.color);
            strokeWeight(3);
            stroke(20);
            rect(p.position.x,p.position.y,playersize,playersize,4);
        }
    
    }

}

var movePlayers = function()
{
    for(var i = 0; i < players.length; i++){

        if(players[i]!=null){
            var p = players[i];
            p.move();

            if(p.position.x < 0){
                p.position.x = 0;
            }
            if(p.position.x > width-playersize){
                p.position.x = width-playersize;
            }


            if(p.position.y < 0){
                p.position.y = 0;
            }
            if(p.position.y > height-0){
                p.position.y = height-0;
            }


            
             for(var j = 0; j < blocks.length; j++)
             {
                    var b = blocks[j];

                    if(b!=null)
                    {
                        if(b.fixed==true)
                        {

                            if(p.position.x > b.position.x-playersize && p.position.x < b.position.x + blocksize){
    
                                if(p.position.y > b.position.y-playersize)
                                {
                                    if(abs((p.position.y -(b.position.y-playersize))<10))
                                    {
                                        p.position.y = b.position.y-playersize;
                                    }
                                    
                                
                                }


                                if(p.position.y < b.position.y+blocksize)
                                {
                                    
                                        if((((p.position.y - (b.position.y+blocksize))>-10)))
                                        {
                                        p.position.y = b.position.y+blocksize
                                        }
                                }
                            }

                            if(p.position.y > b.position.y-playersize && p.position.y < b.position.y + blocksize){
    
                                if(p.position.x > b.position.x-playersize)
                                {
                                    if(abs((p.position.x -(b.position.x-playersize))<10))
                                    {
                                        p.position.x = b.position.x-playersize;
                                    }
                                    
                                
                                }


                                if(p.position.x < b.position.x+blocksize)
                                {
                                    
                                        if((((p.position.x - (b.position.x+blocksize))>-10)))
                                        {
                                        p.position.x = b.position.x+blocksize
                                        }
                                }
                            }

         
                            
                        } 
                        else
                        {

                            if(p.position.x > b.position.x-playersize && p.position.x < b.position.x + blocksize){
    
                                if(p.position.y > b.position.y-playersize)
                                {
                                    if(abs((p.position.y -(b.position.y-playersize))<10))
                                    {
                                        b.velocity.y += (p.velocity.y*speed)/3;
                                        p.position.y -= p.velocity.y*speed;
                                    }
                                    
                                
                                }


                                if(p.position.y < b.position.y+blocksize)
                                {
                                     if(abs((p.position.y -(b.position.y))>-10))
                                     {
                                        b.velocity.y += (p.velocity.y*speed)/3;
                                        p.position.y -= p.velocity.y*speed;
                                     }
                                     
                                }
                            }

                            if(p.position.y > b.position.y-playersize && p.position.y < b.position.y + blocksize){
    
                                if(p.position.x > b.position.x-playersize)
                                {
                                    if(abs((p.position.x -(b.position.x-playersize))<10))
                                    {
                                        b.velocity.x += (p.velocity.x*speed)/3;
                                        p.position.x -= p.velocity.x*speed;
                                    }
                                    
                                
                                }


                                if(p.position.x < b.position.x+blocksize)
                                {
                                     if(abs((p.position.x -(b.position.x))>-10))
                                     {
                                        b.velocity.x += (p.velocity.x*speed)/3;
                                        p.position.x -= p.velocity.x*speed;
                                     }
                                     
                                }
                            }

                            //b.position.x += p.velocity.x/2;

                          
                           // p.position.x -= p.velocity.y/2;
                           
                            

                        }
                    }
                } 

        

        }
      
        //console.log(p.velocity);
    }
}

var spawnPlayer = function(device_ID){

    colorMode(RGB);
    var r = round(random(125, 255));
    var g = round(random(125, 255));
    var b = round(random(125, 255));

    var randColor = color(r,g,b);

    var test = false;

    var randPos;

    while(test == false){

        randPos = new Vector2(round(random(100,700)),round(random(100,700)));
      //  spawnPulse(randPos);

        for(var i = 0; i < blocks.length;i++)
        {
            if(distance(randPos,blocks[i].position)>blocksize*1.5){

                test = true;

            }else{

                test = false;
                break;
            }
        }

    }
   

    players.push(new player(device_ID,randPos,randColor));
    spawnPulse(randPos);

}

var keyboardControls= function(){

    var temp = new Vector2(0,0);

    if(keyIsDown(LEFT_ARROW)){
        temp.x +=-1;
    }
    if(keyIsDown(RIGHT_ARROW))
    {
        temp.x +=1;
    }
    if(keyIsDown(UP_ARROW))
    {
        temp.y +=-1;
    }
    if(keyIsDown(DOWN_ARROW))
    {
        temp.y +=1;
    }

    temp.x *=speed;
    temp.y *= speed;    

    //console.log(temp);
    
    
};


var distance = function(v1,v2)
{
    var xDis = v2.x - v1.x;
    var yDis = v2.y - v1.y;
    return sqrt(xDis*xDis + yDis*yDis);
}

window.onload = init;









