let img;

function preload(){
    img = loadImage("dark.jpg");
}

function setup() {
	createCanvas(windowWidth, windowHeight,WEBGL);
    
	
}

function draw() {
	
	
	background(245, 245, 241);
	
	translate(width/2, height/2);

	texture(img);
	drawLiq(minute(),50,12,20);

	
}


function drawLiq(vNnum,nm,sm,fcm){
	
	push();
	rotate(frameCount/fcm * 0.1);
	
	let dr = TWO_PI/vNnum;
	beginShape();
	for(let i = 0; i  < vNnum + 3; i++){
		let ind = i%vNnum;
		let rad = dr *ind;
		let r = height*0.5 + noise(frameCount/nm + ind) * height*0.2 + sin(frameCount/sm + ind)*height*0.05;
		curveVertex(cos(rad)*r, sin(rad)*r);
	}
	endShape();
	pop();
	
}