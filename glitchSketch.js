
//glitchshader
let glitchShader;
let WebglCanvas1;
let Img1;
let Img2;




//draw
var vx =0;
const micSampleRate = 44100;
const freqDefinition = 8192;
const minFreqHz = 400;//C3
const maxFreqHz = 3103;//C7
const minFreq = Math.floor(minFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
const maxFreq = Math.floor(maxFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
let mic, fft, spectrum;
let historygram;





function preload(){
	mic= loadSound("noise.mp3");
	Img1 = loadImage('light.jpg');
	Img2= loadImage('cloud1.png');

	//glitchshader
	glitchShader = loadShader('glitchShader.vert','glitchShader.frag');
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	 
	
	historygram = createGraphics(windowWidth*5,height);
	fft = new p5.FFT(0.0, 8192);

	
	//glitchshader
	WebglCanvas1 = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();
	
}



function draw() {
	background(Img2);
	fill (255);
	text('press any key to start',100,100);
	
	
	


	//glitchshader:  historygram is the graphics for sound stroke； Img1 is the glitched component
	WebglCanvas1.shader(glitchShader);
	//WebglCanvas1.background(255);
	glitchShader.setUniform("iResolution", [width, height]);
	glitchShader.setUniform("iFrame", frameCount);
	glitchShader.setUniform("iTime", millis()*.01);
	//glitchShader.setUniform("iChannel0", Img2);
	glitchShader.setUniform("iChannel1", Img1);
	WebglCanvas1.rect(0,0,width, height);
	image(WebglCanvas1,0,0);
	


  
	
	vx=vx+5;
	spectrum = fft.analyze();
	
	for (let i = maxFreq; i >= minFreq; i--) {

		let index = maxFreq - i;
		let intensity = (spectrum[i] - spectrum[500])*3  ;
	
		if(intensity>150){
		historygram.stroke(255-intensity,255-intensity,255-intensity);

		let y = index / (maxFreq - minFreq - 1) * height/2;
	
		historygram.line(vx-2,y, vx,y);
		historygram.line(vx,y+3, vx+1,y); //1 
		
	}
	}



	image(historygram, windowWidth-vx,0);
	image(historygram, windowWidth-vx,height/2);


}






  function keyPressed() {

	if (mic.isPlaying()) {
	  // .isPlaying() returns a boolean
	  mic.stop();
	} else {
	  mic.play();
	  mic.amp(1);
	}

  }
  
