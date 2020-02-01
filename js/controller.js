class Vector2{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

function setup()
{
    var canvas = createCanvas(windowHeight/2.5, windowHeight/2.5);
    canvas.parent('sketch-holder');

    var x = (windowWidth - width) / 2;
    canvas.position(x,10);
}

function draw() 
{
    background(200);

    noFill();
    noStroke();
  //  stroke(0);
    //strokeWeight(5);
    rect(0,0,width,height);

    fill("red");
    rect(0,0,width/2,height/2);

    fill("yellow");
    rect(width/2,0,width/2,height/2);

    fill("blue");
    rect(0,height/2,width/2,height/2);

    fill("green");
    rect(width/2,height/2,width/2,height/2);

    noFill();
     stroke(0);
    strokeWeight(5);
    rect(0,0,width,height);

    fill("Black");
    noStroke();
    textSize(50);
    textAlign(0, 0);
    text("REPAIR",width/8,(height/2)+25);


}


var colors= [];


var airconsole;
//up = 0
//down =1
//left = 2
//right =3

var init = function()
{
   // console.log("Controller INIT");
    airconsole = new AirConsole();


    airconsole.onMessage = function(device, data)
    {

        if(data.type!=null){
            if(data.type=="Color")
            {
               //(data.color_data);
   
               var a = data.color_data.levels[0];
               var b = data.color_data.levels[1];
               var c = data.color_data.levels[2];
           
              // console.log(a+"_"+b+"_"+c);
   
               document.body.style.backgroundColor = "rgb("+a+","+b+","+c+")";    
           }
   
   
        
        }
       

    }
}




function pulse()
{
    airconsole.message(AirConsole.SCREEN,
        {
            
            type : "Pulse"
           
            
        }
    ) 
}



function startmove(dir)
{
    
    airconsole.message(AirConsole.SCREEN,
        {
            
            type : "Movement",
            direction:dir,
            vector:dirFromInt(dir)
        }
    )

   // console.log("Start: ("+dirFromInt(dir).x+","+dirFromInt(dir).y+").");

}

function endmove(dir)
{
    airconsole.message(AirConsole.SCREEN,
        {

            type : "Movement",
            direction: dir,
            vector: new Vector2(0,0)
        }
    )

   // console.log("End: ("+dirFromInt(dir).x+","+dirFromInt(dir).y+").");
}

function dirFromInt(number){
    if(number == 0) return new Vector2(0,1);//up
    if(number == 1) return new Vector2(0,-1);//down
    if(number == 2) return new Vector2(-1,0);//left
    if(number == 3) return new Vector2(1,0);//right

    else return new Vector2(0,0);
}



window.onload = init;