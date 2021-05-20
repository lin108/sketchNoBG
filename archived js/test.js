let img;
let startCanvas;

function preload(){
    img = loadImage("dark.jpg");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	startCanvas = createGraphics(windowWidth,windowHeight);
    
	
}

function draw() {
	


	background(255);
	textSize(32);
	text('word', 10, 30);
	fill(0, 102, 153);


	
	startCanvas.textSize(40);
	startCanvas.text("press any key to start",10,50);
	startCanvas.fill(0);
	image(startCanvas,0,0);

	
}

