//shader
let theShader;
let Img;
let WebglCanvas;


//text
let dialog1;
let dialog2;
let dialog3;
let dialog4;
let dialog5;

// cloud image
let cloud1;
let cloud1img;


//background
var Unit;
var Counter;
var MX, MY;
var x,y,size;



var vx =0;

let light;
let dark;
let mix;



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

mix = loadImage("background.jpg");
enFont=loadFont('Font/Menlo-Regular.ttf');
chFont=loadFont("Font/I.BMing-3.500.ttf");
cloud1img = loadImage("cloud1.png");
	
//Shader
theShader = loadShader('shader1.vert', 'shader1.frag');
Img = loadImage('light.jpg');


}

function setup() {

	createCanvas(windowWidth, windowHeight);
	//shader
    WebglCanvas = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();
    
	mic= loadSound("noise.mp3");
	
	
	historygram = createGraphics(windowWidth*5,height);

	//mouseClicked(togglePlay);
	//mic.play();
	fft = new p5.FFT(0.0, 8192);
	//fft = new p5.FFT(0.0, 1024);
	//mic.connect(fft);

	// bg	
	Unit=128;
	Counter=0;


	//dialog
	dialog1 = new Dialog(windowWidth,windowHeight/2,"33591",5,2500,false);
	dialog2 = new Dialog(windowWidth,windowHeight/3,"NORAD ID",6,5000,false);

	dialog3 = new DialogP(2*windowWidth/3,windowHeight/4,"訊號連結",chFont,8000,13000,false);
	dialog4 = new DialogP(2*windowWidth/3,windowHeight/3,"WEATHER/SNOOZE",enFont,9000,13000,false);
	dialog5 = new DialogP(windowWidth/3,windowHeight/3,"Int'I Code 2009-005A",enFont,13000,16000,false);
	

	//cloud image
	cloud1 = new Cloud(4*windowWidth,windowHeight/5,cloud1img);


	
}


function draw() {

	//shader 
	WebglCanvas.shader(theShader);
	theShader.setUniform("iResolution", [width, height]);
	theShader.setUniform("iFrame", frameCount);
	theShader.setUniform('tex',Img)
		// rect gives us some geometry on the screen
		WebglCanvas.rect(0,0,width, height);
		image(WebglCanvas,0,0);	
  
  
	

	//historygram.clear(0,0,width,height);
	//background(mix);


	vx=vx+5;
	
	

	
	spectrum = fft.analyze();
	
	for (let i = maxFreq; i >= minFreq; i--) {

		let index = i - minFreq;
		let intensity = (spectrum[i] - spectrum[500])*3  ;

		if(frameCount%40==0){
			console.log(spectrum[500]);
		}
		
		if(intensity>150){
		historygram.stroke(255-intensity,255-intensity,255-intensity);

		let y = index / (maxFreq - minFreq - 1) * height;
	
		historygram.line(vx-2,y, vx,y);
		historygram.line(vx,y+1, vx+1,y); //1 
	//	historygram.line(vx,y, vx+2,y);
		
		
	}
	}

	image(historygram, windowWidth-vx,0);

	
	
	
	
	//if(frameCount%40==0){
	//drawStreak();}

	
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
		//dialog
		
		if (mic.isPlaying()){
		dialog1.move();
		dialog1.show();
		//console.log(dialog1.isDisplayed);
		dialog2.move();
		dialog2.show();

		
		dialog3.show();
		dialog4.show();
		dialog5.show();

		cloud1.move();
		cloud1.show();
		}
	


}




   



  function mousePressed() {
	if (mic.isPlaying()) {
	  // .isPlaying() returns a boolean
	  mic.stop();
	} else {
	  mic.play();
	  mic.amp(1);
	}

  }
  
   
   
// move class
class Dialog{
	
	constructor(x,y,text,speed,time,isDisplayed){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.text = text;
		this.isDisplayed =isDisplayed;
		setTimeout(() => {this.display(true)},time); //匿名函数
	//	setTimeout(this.display,time);

	}

 	 display(isDisplayed){
		console.log('hihihihihihihi');
		console.log(this.time);
		this.isDisplayed = isDisplayed;
	}


	move(){
		if(this.isDisplayed==false){
			return;
		}	
		this.x = this.x - this.speed;
		this.y = this.y + random(-1,1);	
	}


	show(){
		if(this.isDisplayed==false){
			return;
		}
		
		textSize(18);
		//textFont(enFont);
		fill(255);
		text(this.text,this.x,this.y);
	}
}


//popup class
class DialogP{
	constructor(x,y,text,font,borntime,deadtime,isDisplayed){
		this.x=x;
		this.y=y;
		this.text =text;
		this.font = font;
		this.isDisplayed = isDisplayed;
		setTimeout(() => {this.display(true)},borntime); //匿名函数
		setTimeout(() => {this.remove(false)},deadtime); //匿名函数
	}
	display(isDisplayed){
		this.isDisplayed = isDisplayed;
	}
	remove(isDisplayed){
		this.isDisplayed = isDisplayed;
	}
	show(){
		if(this.isDisplayed==false){
			return;
		}
		
		textSize(18);
		textFont(this.font);
		fill(255);
		text(this.text,this.x,this.y);
	}
}



class Cloud{
	constructor(x,y,img){
		this.x = x;
		this.y = y;
		this.img = img;
	}
	move(){
		this.x = this.x - 5;
	}
	show(){
		image(this.img,this.x,this.y,this.img.width/2,this.img.height/2);
	}
}


