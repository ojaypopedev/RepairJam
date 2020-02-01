class Vector2{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

var airconsole;
//up = 0
//down =1
//left = 2
//right =3

var init = function()
{
    console.log("Controller INIT");
    airconsole = new AirConsole();


    airconsole.onMessage = function(device, data)
    {
        if(data.type=="Color")
         {
            console.log(data.color_data);

            var a = data.color_data.levels[0];
            var b = data.color_data.levels[1];
            var c = data.color_data.levels[2];
        
           // console.log(a+"_"+b+"_"+c);

            document.body.style.backgroundColor = "rgb("+a+","+b+","+c+")";
            
           
                
               
        }

    }
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