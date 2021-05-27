
   
// move class
class Dialog{
	
	constructor(x,y,text,font, color, size, speed,time,isDisplayed){
		this.x = x;
		this.y = y;
		this.text = text;
		this.font = font;
		this.color = color;
		this.size = size;
		this.speed = speed;
		this.isDisplayed =isDisplayed;
		setTimeout(() => {this.display(true)},time); //匿名函数
	//	setTimeout(this.display,time);
        this.history = [];

	}

 	 display(isDisplayed){
	//	console.log('hihihihihihihi');
	//	console.log(this.time);
		this.isDisplayed = isDisplayed;
	}


	move(){
		if(this.isDisplayed==false){
			return;
		}	
	}


	show(){
		if(this.isDisplayed==false){
			return;
		}

		scriptCanvas.textSize(this.size);
		scriptCanvas.textFont(this.font);
		scriptCanvas.fill(this.color);
        this.x = this.x - this.speed;
		this.y = this.y + random(-1,1);	
        scriptCanvas.text(this.text,this.x,this.y);

		/*
		textSize(18);
		fill(255,80);
        text(this.text,this.x+5,this.y);
		text(this.text,this.x+10,this.y);

		textSize(18);
		fill(255,60);
		text(this.text,this.x+15,this.y);
		text(this.text,this.x+20,this.y);
      */
	}
}



//popup class
class DialogP{
	constructor(x,y,text,font,color,size,borntime,deadtime,isDisplayed){
		this.x=x;
		this.y=y;
		this.text =text;
		this.font = font;
		this.color = color;
		this.size =size;
		this.isDisplayed = isDisplayed;
		this.blur = blur;
		setTimeout(() => {this.display(true)},borntime); //匿名函数
		//setTimeout(() => {this.blur(true)},borntime+1000); //匿名函数
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
		textSize(this.size);
		textFont(this.font);
	    fill(this.color);
		//this.y = this.y + random(-1,1);	
		//this.x = this.x + random(-1,1);	
		
		text(this.text,this.x,this.y);
		text(this.text,this.x+10,this.y-10);
		text(this.text,this.x-10,this.y+10);
	
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


