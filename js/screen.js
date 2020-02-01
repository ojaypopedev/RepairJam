

class Vector2{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}
class player{

    constructor(device_id,position,velocity,color)
    {
        this.device_id = device_id;
        this.position = position;
        this.velocity = velocity;
        this.color = color;
    }

    move()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
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

var init = function()
{
    airconsole = new AirConsole();

     airconsole.onMessage = function(device, data)
     {
         //console.log(device);

        }

    airconsole.onConnect = function(device_id){
 
        console.log("SOMETHING CONNECTED");

        spawnPlayer(device_id);

        var col = players[players.length-1].color;

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
                if(device_id = players[i].device_id){

                    spawnPulse(players[i].position);
                    players[i] = null;
                    break;
                }
            }
            
        }
        console.log("SOMETHING DISCONNECTED");
       
    
    }
}

    
function setup()
{

    createCanvas(800, 800);
    colorMode(RGB);
    var randColor = color(random(0,1),0.5,1);
    //log(airconsole);

   // playerTest = new player(new Vector2(300,300), new Vector2(0,0),randColor)
   
}




    
function draw() 
{
    background(200);

    keyboardControls();

  
    movePlayers();
    drawPlayers();
    drawPulses();

};

var spawnPulse = function(position){

    pulses.push(new pulse(new Vector2(position.x+10,position.y+10),20,80));
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

    for(var i = 0; i < players.length; i++){

        if(players[i] != null){

            var p = players[i];
            fill(p.color);
            rect(p.position.x,p.position.y,20,20);
        }
    
    }

}
var movePlayers= function()
{
    for(var i = 0; i < players.length; i++){

        if(players[i]!=null){
            var p = players[i];
            p.move();
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
    var randPos = new Vector2(round(random(100,700)),round(random(100,700)));
    players.push(new player(device_ID,randPos, new Vector2(0,0),randColor));
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

window.onload = init;









