//background
var Unit;
var Counter;
var MX, MY;
var x,y,size;



var vx =0;

let light;
let dark;

let theShader;
let WebglGraphics;
let info=[];

//var x = 0;
let bg;

const maxXChange = 125;
const maxYChange = 5;
const yNoiseChange = 0.01;
const mouseYNoiseChange = 0.3;
const timeNoiseChange = 0.013;

let inverted = false;



const micSampleRate = 44100;

const freqDefinition = 8192;


const minFreqHz = 530;//C3
const maxFreqHz = 3103;//C7
const minFreq = Math.floor(minFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
const maxFreq = Math.floor(maxFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
//Andy update, the default number of frequency bins is 1024 , so maybe something with that?
const magconvertNumber = 2/1.445;


let mic, fft, spectrum;
let historygram;

let enFont;
let chFont;





function preload(){
mic= loadSound("noise.mp3");
light=loadImage("light.jpg");
dark=loadImage("dark.jpg");
enFont=loadFont('Font/Menlo-Regular.ttf');
chFont=loadFont("Font/I.BMing-3.500.ttf");
	
//Shader

}

function setup() {

	
	createCanvas(windowWidth, windowHeight);
	
	historygram = createGraphics(windowWidth*5,height);
	mic.play();
	fft = new p5.FFT(0.0, 8192);
	mic.connect(fft);

	// bg	
	Unit=128;
	Counter=0;


	
}


function draw() {
	background(dark);
	Counter+=0.002;
	for (let j=0; j<height; j+=Unit) {
   for (let i=0; i<width; i+=Unit) {
	 DrawRect(i, j, Unit);
		   
   }
 }
   



	vx=vx+5;
	
	

	
	spectrum = fft.analyze();
	


	//DRAW HISTORYGRAM
	//TRANSLATE
	
	
	//historygram.image(historygram, -2,0);
	
	//historygram.translate(5-x,0);
	for (let i = maxFreq; i >= minFreq; i--) {
	 //historygram.translate(5-x,0);
		let index = i - minFreq;
		let intensity = (spectrum[i] - spectrum[400])*2  ;
		
		if(intensity>220){
		historygram.stroke(255-intensity,255-intensity,255-intensity);

		if(frameCount==100){
			console.log(vx);
		}

		
	//	var weight = map(intensity,0,255,0.5,2);
	//	historygram.strokeWeight(weight);
		let y = index / (maxFreq - minFreq - 1) * height;
		//historygram.line(600+x,y, 603+x,y); // right to left
	// historygram.line(600+x,y+2, 600+x,y); // vertical
	// historygram.line(width+x,y+2, width+x,y); // right to left	
		
		historygram.line(vx-3,y, vx,y);
		historygram.line(vx,y+2, vx,y); //1 
		historygram.line(vx,y, vx+2,y);
		
		//historygram.fill(255-intensity,255-intensity,255-intensity,intensity/4);
		//historygram.rect(vx,y,1,3);
	}
	}

	image(historygram, windowWidth-vx,0);
//	x= x -2;
	//drawStreak();
	
	

	
	if(frameCount%40==0){
	drawStreak();}

	

		// info text
	textSize(18);
	textFont(enFont);
	fill(255);
	text("2020-12-30--10-12-11--593_pX.fots",1/25*width,15/20*height);
	textSize(18);
	text("age:2s",1/25*width,16/20*height);
	text("ctr_s:5[nc]",1/25*width,50/60*height);
	text("ctr_f: 1759",1/25*width,52/60*height);
	text("lat:-77.04°",1/25*width,54/60*height);
	text("lst:13.89 hrs",1/25*width,56/60*height);
	fill(255);
	
	textSize(18);
	text("age:2s",5/25*width,16/20*height);
	text("ctr_s:5[nc]",5/25*width,50/60*height);
	text("ctr_f: 1759",5/25*width,52/60*height);
	text("lat:-77.04°",5/25*width,54/60*height);
	text("lst:13.89 hrs",5/25*width,56/60*height);
	fill(255);
		
/*
		//info DOM
		let h1 = createElement("h1","2020-12-30--10-12-11--593_pX.fots" );
		h1.style('color','white');
		h1.style('font-size','18px');
		h1.style('font-family','Menlo-Regular');
		h1.position(1/25*width,7/10*height);


		let h2 = createElement("h2","age:2s" );
		h1.style('color','white');
		h1.style('font-size','18px');
		h1.style('font-family','Menlo-Regular');
		h1.position(1/25*width,8/10*height);
*/	

}



function drawStreak() {
	let y = floor(random(height));
	let h = floor(random(20, 30)); //floor(random(1, 100));
	let xChange = floor(map(noise(y * yNoiseChange, (mouseY * mouseYNoiseChange + frameCount) * timeNoiseChange), 0.06, 0.94, -maxXChange, maxXChange)); //floor(random(-maxXChange, maxXChange));
	let yChange = floor(xChange * (maxYChange / maxXChange) * random() > 0.1 ? -1 : 1);

	if (random() < dist(pmouseX, pmouseY, mouseX, mouseY) / width * 0.3 + 0.0015) filter(POSTERIZE, floor(random(2, 6)));
	if (mouseIsPressed && abs(mouseY - y) < 60) {
		if (!inverted) filter(INVERT);
		inverted = true;
	} else {
		if (inverted) filter(INVERT);
		inverted = false
	}
	
	//It looks better with the line below IMO but it runs a lot slower (not quite real time)
	//if(random()<0.07)tint(random(255), random(255), random(255));
	
	image(historygram, xChange - maxXChange, -maxYChange + y + yChange, historygram.width, h, 0, y, historygram.width, h);
	//copy(img, 0, y, img.width, h, xChange - maxXChange, -maxYChange + y + yChange, img.width, h);
}

function DrawRect(x, y, size){
	let cx=x+size/2; 
	let cy=y+size/2;
	let n=noise(cx/width, cy/height, mag(cx, cy)/height-Counter);
	let threshold=map(size, Unit, 4, 0.5, 0.09 );
		if (abs(n-0.5)>threshold) {
	   rect(x, y, size, size);
	   fill(205,207,195);
	   noStroke();
	 } else {
	   size=size/2;
	   if (size>=4) { // smallest size of a square = 4pixels
		 DrawRect(x     , y     , size);
		 DrawRect(x+size, y     , size);
		 DrawRect(x     , y+size, size);
		 DrawRect(x+size, y+size, size);
		fill(205,207,195);
		noStroke();
	   }
	 }
   }
   
   



