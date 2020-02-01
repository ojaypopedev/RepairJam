function setup()
{

    createCanvas(400, 400);
}

function preload() {
    var blue_img = loadImage("../assets/sq_blue.png");
    var green_img = loadImage("../assets/sq_green.png");
    var red_img = loadImage("../assets/sq_red.png");
    var yellow_img = loadImage("../assets/sq_yellow.png");


}

function draw()
{
    background(200);
    image(img, 10, 10, 120, 120);
}