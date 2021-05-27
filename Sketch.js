let startCanvas;

//shader
let theShader;
let Img;
let WebglCanvas;


//text
let scriptCanvas;
let dialogp = []; //popup
let dialogs = []; //move






// cloud image
let cloud1;
let cloud1img;



var vx =0;
let info=[];



//glitch
const maxXChange = 125;
const maxYChange = 5;
const yNoiseChange = 0.01;
const mouseYNoiseChange = 0.3;
const timeNoiseChange = 0.013;

let inverted = false;

const micSampleRate = 44100;

const freqDefinition = 8192;


const minFreqHz = 400;//C3
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
	enFont=loadFont('Font/Menlo-Regular.ttf');
	chFont=loadFont("Font/I.BMing-3.500.ttf");
	cloud1img = loadImage("cloud1.png");
		
	//Shader
	theShader = loadShader('shader1.vert', 'shader1.frag');
	Img = loadImage('light.jpg');

}


function setup() {

	startCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas.clear();


	createCanvas(windowWidth, windowHeight);
	//shader
    WebglCanvas = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();
    
	mic= loadSound("noise1.mp3");
	historygram = createGraphics(windowWidth*5,height);
	fft = new p5.FFT(0.0, 8192);


	
	//dialog移动效果 （出现x，出现y，内容，移动速度，出现时间，false）
	dialogs[0] = new Dialog(windowWidth,windowHeight/2,"33591",5,4500,false);
	dialogs[1] = new Dialog(windowWidth,windowHeight/3,"NORAD ID",6,6000,false);
	dialogs[2] = new Dialog(windowWidth,2*windowHeight/3,"137.100/1698.000 ",5,27000,false);
	dialogs[3] = new Dialog(windowWidth,2*windowHeight/3-100," LAT: 6",5,28000,false);
	dialogs[4] = new Dialog(windowWidth,windowHeight/3,"SPD: 7.2 ",5,29000,false);


	//dialog popup效果 （x，y，内容，字体，出现时间，消失时间，false）
	dialogp[0] = new DialogP(3*windowWidth/5,100,"訊號連結",chFont,13000,16000,false);
	dialogp[1] = new DialogP(4*windowWidth/5,200,"WEATHER/SNOOZE",enFont,15000,17000,false);
	dialogp[2] = new DialogP(windowWidth/3,2*windowHeight/4,"Int'I Code 2009-005A",enFont,17000,20000,false);
	dialogp[3] = new DialogP(windowWidth/2,windowHeight/2,"訊號連結 ",chFont,21000,24000,false);
	dialogp[4] = new DialogP(windowWidth/5,3*windowHeight/4,"AZIMUTH ",enFont,25000,27000,false);
	dialogp[5] = new DialogP(windowWidth/2,2*windowHeight/4," [發送信息：機器型號]",chFont,30000,33000,false);
	dialogp[6] = new DialogP(windowWidth/3,3*windowHeight/4," ……[訊號接通]",chFont,32000,36000,false);
	dialogp[7] = new DialogP(windowWidth/2,1*windowHeight/4," 是誰？",chFont,36000,43000,false);



	//cloud image
	cloud1 = new Cloud(2*windowWidth,windowHeight/5,cloud1img);


	
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
  
  
	startCanvas.textSize(16);
	startCanvas.textFont(enFont);
	startCanvas.text("press any key to start",20,50);
	startCanvas.fill(100);
	//image(startCanvas,0,0);

	image(scriptCanvas,0,0);
	

	vx=vx+5;
	
	spectrum = fft.analyze();
	
	
	for (let i = maxFreq; i >= minFreq; i--) {
		
		var high = fft.getEnergy(2400);

		//let index = i - minFreq;
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


	
	script();

}






  function keyPressed() {

	if (mic.isPlaying()) {
	  // .isPlaying() returns a boolean
	  mic.stop();
	} else {
	  mic.play();
	  mic.amp(1);
	 // mic.loop();
	}

  }
  

  function script(){
	if (mic.isPlaying()){
		for(i=0;i<5;i++) {
			dialogs[i].move();
			dialogs[i].show();
		}
		for(z=0;z<8;z++) {
		
			dialogp[z].show();
		}



/*
		dialog1.move();
		dialog1.show();
		//console.log(dialog1.isDisplayed);
		dialog2.move();
		dialog2.show();

		
		dialog3.show();
		//dialog3.blur();
		dialog4.show();
		//dialog4.blur();
		dialog5.show();
		//dialog5.blur();

		cloud1.move();
		cloud1.show();
		*/
		}
  }
   
