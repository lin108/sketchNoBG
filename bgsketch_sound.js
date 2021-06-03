let startCanvas;

//shader
let theShader;
let Img;
let WebglCanvas;

//glitchjs
let scriptGlitch;


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


const minFreqHz = 200;//C3
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

	//glitchjs
	//scriptGlitch = new Glitch();

	startCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas.clear();


	createCanvas(windowWidth, windowHeight);
	//shader
    WebglCanvas = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();
    
	mic= loadSound("noise1min.mp3");
	historygram = createGraphics(windowWidth*5,height);
	fft = new p5.FFT(0.0, 8192);


	
	//dialog移动效果 （出现x，出现y，内容，字体, color, size 移动速度，出现时间，false）
	dialogs[0] = new Dialog(windowWidth,windowHeight/2,"訊號連結",chFont,"#fff", 18,  5,5000,false);
	dialogs[1] = new Dialog(windowWidth,windowHeight/3,"WEATHER/SNOOZE",enFont, "#fff", 16, 15,7000,false);
	dialogs[0] = new Dialog(windowWidth,windowHeight/2,"訊號連結",chFont, "#fff", 18, 5,9000,false);

	dialogs[2] = new Dialog(windowWidth,2*windowHeight/3,"WEATHER/SNOOZE ",enFont,"#fff", 16,  15,13000,false);
	dialogs[3] = new Dialog(windowWidth,windowHeight/3-100,"……[訊號接通]",chFont,"#fff", 16, 15,25000,false);
	dialogs[4] = new Dialog(windowWidth,windowHeight/3,"是誰？",chFont,"#fff", 16, 5,26000,false);


	//dialog popup效果 （x，y，内容，字体，color，size，出现时间，消失时间，false）
	dialogp[0] = new DialogP(9*windowWidth/10,windowHeight/2+50,"33591",enFont,"#fff", 16, 4500,5000,false);
	dialogp[1] = new DialogP(9*windowWidth/10,windowHeight/2-50,"NORAD ID",enFont,"#fff",16,4600,5000,false);
	dialogp[2] = new DialogP(windowWidth/5,1*windowHeight/4,"Int'I Code 2009-005A",enFont,"#fff",16,10000,12000,false);
	dialogp[3] = new DialogP(windowWidth/5,windowHeight/5,"137.100/1698.000  ",enFont,"#fff",16,15000,17000,false);
	
	dialogp[4] = new DialogP(4*windowWidth/5,3*windowHeight/4,"LAT: 6 ",enFont,"#fff",16,16000,18000,false);
	dialogp[5] = new DialogP(4*windowWidth/5,3*windowHeight/4+70,"SPD: 7.2 ",enFont,"#fff",16,18000,20000,false);

	dialogp[5] = new DialogP(windowWidth/2,windowHeight/4," AZIMUTH",enFont,"#fff",16,27000,30000,false);
	dialogp[6] = new DialogP(windowWidth/3,windowHeight/4," (不含有明確縮寫可以識別)",chFont,"#fff",25,25000,30000,false);
	dialogp[7] = new DialogP(windowWidth/2,windowHeight/2-400," 主機時間",chFont,"#fff",20,29000,50000,false);



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
	//clear(0,0,width*2,height)

	//push ();
	
//	pop ();


		vx=vx+5;
			
		spectrum = fft.analyze();


		for (let i = maxFreq; i >= minFreq; i--) {
			
			//var high = fft.getEnergy(2400);

			//let index = i - minFreq;
			let index = maxFreq - i;
			let intensity = (spectrum[i] - spectrum[500])*2;
			let intensityX= map(intensity,0,100,0.5,5);
			

			if(intensity>150){
				
			historygram.stroke(255-intensity,255-intensity,255-intensity);

			let y = index / (maxFreq - minFreq - 1) * height/2;

			historygram.line(vx-2+intensityX,y, vx+intensityX,y);
			//historygram.line(vx,y+3, vx+1,y); //1 
			
			if(intensity>200){
				let intensityY = map(i,900,1073,0,height);
				historygram.line(vx,0, vx,intensityY);
			}
		
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

		//glitch();
	
	script();
	image(scriptCanvas,0,0);

	if(frameCount%15 == 0){
		return;
	}
	else{
		scriptCanvas.clear(0,0,width,height);
	}
	
	if(frameCount%100 > 10 && frameCount%100 <15)
	{
		glitch();
		
	}
	if(frameCount%100>50 && frameCount%100<70){
		glitch1();
	}

	
		
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
		}
  }



  function glitch(){

	let y = floor(random(height));
	let h = floor(random(20, 30)); 
	let xChange = floor(random(-maxXChange/5, maxXChange/5));
	let yChange = floor(xChange/5);
	image(WebglCanvas, xChange - maxXChange, yChange - maxYChange + y, width, h, 0, y, width, h);


  }


  function glitch1(){
	//var x1 = floor(random(2/windowWidth,windowWidth));
	//var y1 = floor(random(height));

	var x1 = floor(random(windowWidth/2,windowWidth/2 +40));
	var y1 = floor(random(10,200));
  
	var x2 = round(x1 + random(-100, 100));
	var y2 = round(y1 + random(-50, 50));
  
	var w = floor(random(10, 300));
	var h = floor(random(10, 500));

	var col = get(x1, y1, w, h)
   
	set(x2, y2, col);
   
	
  }


  function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  }