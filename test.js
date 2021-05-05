var sound;
function preload(){
    sound=loadSound("noise.mp3");
}

function setup(){
    createCanvas(200,200);
    sound.play();
}
function draw(){
    background(0);  
}