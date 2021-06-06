//particle
let particles = [];

let overAllTexture;
let texture1;
let texture2;

let startCanvas;

//shader
let theShader;
let Img;
let WebglCanvas;
let WebglCanvas2;

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
	overAllTexture = loadImage('texture.png');
	texture1=loadImage("texture1.png")
	texture2=loadImage("texture2.png")


	enFont=loadFont('Font/Menlo-Regular.ttf');
	chFont=loadFont("Font/I.BMing-3.500.ttf");
	cloud1img = loadImage("cloud1.png");
	
	
	theShader0 = loadShader('shader1.vert', 'shader1.frag');
	//Shader
	theShader = new p5.Shader(this.renderer,vert,frag);
	Img = loadImage('purple.jpg');

}


function setup() {

	//glitchjs
	//scriptGlitch = new Glitch();

	startCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas = createGraphics(windowWidth,windowHeight);
	pixelDensity(1);
	noStroke();


	createCanvas(windowWidth, windowHeight);
	//shader
    WebglCanvas = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();

	WebglCanvas2 = createGraphics(windowWidth,windowHeight,WEBGL);
	pixelDensity(1);
	noStroke();
    
	mic= loadSound("noise1min.mp3");
	historygram = createGraphics(windowWidth*5,height);
	fft = new p5.FFT(0.0, 8192);


	
	//dialog移动效果 （出现x，出现y，内容，字体, color, size 移动速度，出现时间，false）
	dialogs[0] = new Dialog(windowWidth,windowHeight/2,"訊號連結",chFont,"#fff", 18,  5,5000,false);
	dialogs[1] = new Dialog(windowWidth,windowHeight/3,"WEATHER/SNOOZE",enFont, "#fff", 16, 15,7000,false);
	dialogs[0] = new Dialog(windowWidth,windowHeight/2,"訊號連結",chFont, "#fff", 18, 5,9000,false);

	dialogs[2] = new Dialog(windowWidth,2*windowHeight/3,"WEATHER/SNOOZE ",enFont,"#fff", 16,  15,15000,false);
	dialogs[3] = new Dialog(windowWidth,windowHeight/3-100,"……[訊號接通]",chFont,"#fff", 25, 15,30000,false);
	dialogs[4] = new Dialog(windowWidth,windowHeight/3,"是誰？",chFont,"#fff", 25, 10,45000,false);


	//dialog popup效果 （x，y，内容，字体，color，size，出现时间，消失时间，false）
	dialogp[0] = new DialogP(9*windowWidth/10,windowHeight/2+50,"33591",enFont,"#fff", 16, 4500,5000,false);
	dialogp[1] = new DialogP(9*windowWidth/10,windowHeight/2-50,"NORAD ID",enFont,"#fff",16,4600,5000,false);
	dialogp[2] = new DialogP(4*windowWidth/5,3*windowHeight/4,"Int'I Code 2009-005A",enFont,"#fff",16,10000,12000,false);
	dialogp[3] = new DialogP(windowWidth/5,windowHeight/5,"137.100/1698.000  ",enFont,"#fff",16,15000,17000,false);
	
	dialogp[4] = new DialogP(4*windowWidth/5,3*windowHeight/4,"LAT: 6 ",enFont,"#fff",16,20000,23000,false);
	dialogp[5] = new DialogP(4*windowWidth/5,3*windowHeight/4-30,"SPD: 7.2 ",enFont,"#fff",16,20000,23000,false);

	dialogp[5] = new DialogP(windowWidth/2,windowHeight/4," AZIMUTH",enFont,"#fff",16,30000,32000,false);
	dialogp[6] = new DialogP(windowWidth/5,windowHeight/4+100," (不含有明確縮寫可以識別)",chFont,"#fff",16,40000,50000,false);
	dialogp[7] = new DialogP(windowWidth/2,windowHeight/2-400," 主機時間",chFont,"#fff",20,46000,55000,false);



	//cloud image
	cloud1 = new Cloud(2*windowWidth,windowHeight/5,cloud1img);

	
}



function draw() {


	

	theShader.setUniform('u_resolution',[width/1000,height/1000])
	theShader.setUniform('u_time',millis()/1000)
	theShader.setUniform('tex0',WebglCanvas)
	WebglCanvas2.shader(theShader)
	// webGLGraphics2.rect(00,width,height)
	WebglCanvas2.rect(-width/2,-height/2,width,height)



	
	
	//shader 
	WebglCanvas.shader(theShader0);
	theShader0.setUniform("iResolution", [width, height]);
	theShader0.setUniform("iFrame", frameCount);
	theShader0.setUniform('tex',Img)
		// rect gives us some geometry on the screen
		WebglCanvas.rect(0,0,width, height);
		image(WebglCanvas,0,0);	

	
		
  


		if(frameCount%100 > 10 && frameCount%100 <15)
	{
		glitch();
		
	}
	

  
	startCanvas.textSize(16);
	startCanvas.textFont(enFont);
	startCanvas.text("press any key to start",20,50);
	startCanvas.fill(100);
	//image(startCanvas,0,0);
	//clear(0,0,width*2,height)

	//push ();
	//pop ();


		vx=vx+5;	
		spectrum = fft.analyze();

		for(let vol = 0; vol<256; vol++)
		
		{
			let index = 256 - vol;
			let y = index / (255 - 1) * height;
			let high = fft.getEnergy(2400);
			let low = fft.getEnergy(1000);
			let intensity = high -low;
			console.log(intensity);
			

			let lowWid = map(low,100,255,5,10);
			
			let intensityX = map(intensity,100,200,0.5,5);
			let transp = map(intensity,50,200,0,255);
			let ellipseWid = map(intensity,240,255,10,25);


			let index2 =  (256 - vol) * random(15,25);
			let y2 = floor(index2 / (255-1) * height);
			

			historygram.stroke(low,low,low,low/3);
			historygram.line(vx+lowWid,y,vx,y);

			if(intensity>170){

				let color = map(intensity,100,200,-100,100);
				let colorR = 83 + color;
				let colorG = 63 + color;
				let colorB = 142 + color;
				
				//historygram.fill(random(15,200),transp,transp,transp/2);

				historygram.fill(colorR,colorG,colorB);
				historygram.ellipse(vx,y,intensityX/3,10);
				historygram.ellipse(vx,y,2,intensityX);

				if(intensity>199)
				{
					

					//historygram.fill(255,255,255,transp/2);
					historygram.fill(colorR-10,colorG+30,colorB+10);

					//historygram.rect(vx,y2,ellipseWid,8);

					historygram.ellipse(vx,y2,intensityX,30);
					historygram.ellipse(vx,y2+random(10,20),10,intensityX*3);

					// Particle system
					//createParticles(vx);


					if(intensity>210){
						historygram.stroke(157,40,20);
						//historygram.line(vx+4,0,vx,height);
					}

					
				}
				
			}

		}



/*
		for (let i = maxFreqHz; i >= minFreqHz; i--) {
			
			//var high = fft.getEnergy(2400);

			//let index = i - minFreq;
			let index = maxFreq - i;
			let intensity = (spectrum[i] - spectrum[500])*3;
			let intensityX= map(intensity,0,100,0.5,5);

			
			

			if(intensity>150){
				
			let transp = map(intensity,150,255,0,100);
			historygram.stroke(intensity/3,intensity/3,intensity/3,transp);
			//historygram.stroke(intensity,intensity,ntensity,transp);

			let y = index / (maxFreq - minFreq - 1) * height;

			historygram.line(vx-2+intensityX,y, vx+intensityX,y);
			//historygram.line(vx,y+3, vx+1,y); //1 
			
			if(intensity>240){
				//historygram.stroke(255-intensity,255-intensity,255-intensity,transp);
				historygram.stroke(intensity,intensity,intensity,transp/3);

				let y = index / (maxFreq - minFreq - 1) * height;

				historygram.line(vx-20+intensityX,y, vx+intensityX,y);
				historygram.noStroke();

				historygram.fill(255,255,255,transp/5);
				let widthhis = map(intensity,240,255,1,5);
				historygram.rect(vx,y,widthhis,8);

				let radius = map(intensity,240,255,5,1);
			
				historygram.ellipse(vx,y,widthhis);
				

				/*
				let intensityY = map(i,900,1073,0,height);
				historygram.line(vx,0, vx,intensityY);
			
				}
			}
			//反向透明

		}
	*/

	


	image(WebglCanvas2,0,0,width,height);
	push()
		blendMode(DARKEST)
		// image(texture1,0,0,width,height)
		image(texture1,0,0,width,height)
		// image(texture1,0,0,width,height)
		image(texture2,0,0,width,height)
	
		pop()

	image(historygram, windowWidth-vx,0);
	//image(historygram, windowWidth-vx,height/2);
	



		

	
		// info text
		textSize(16);
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

		image(overAllTexture,0,0,width,height);

	
	script();
	image(scriptCanvas,0,0);

	if(frameCount%15 == 0){
		return;
	}
	else{
		scriptCanvas.clear(0,0,width,height);
	}
	

	
	

	if(frameCount%100>80 && frameCount%100<95){
		glitch1();
	}


}






  function keyPressed() {

	if (keyCode === LEFT_ARROW) {
		if (mic.isPlaying()) {
			// .isPlaying() returns a boolean
			mic.stop();
		  } else {
			mic.play();
			mic.amp(1);
		   // mic.loop();
		  }
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
   



/*
	function createParticles(vx){
		// particle system
		
			let p = new Particle(vx);
			console.log(m);
			particles.push(p);
			particles[m].update();
			particles[m].show();
		
	
	}


  class Particle{

	constructor(x){
		this.x = x;
		this.y = 500;
		this.px = 5;
		this.alpha = 100;
		//this.py = 5;
	}

	update(){
		this.x += this.px;
		//this.y += this.py;
		this.alpha -= 5;
	}
	show(){
		historygram.noStroke();
		historygram.fill(255,this.alpha);
		historygram.ellipse(this.x,this.y,50);
	}
  }
*/