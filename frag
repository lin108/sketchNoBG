const frag = `
	precision highp float;

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform vec3 u_lightDir;
	uniform vec3 u_col;
	uniform mat3 uNormalMatrix;
	uniform float u_pixelDensity;
	uniform sampler2D tex0;
	uniform sampler2D tex1;

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	${frag_functions_default}


	void main(){
		vec2 st = var_vertTexCoord.xy;
		vec3 color = vec3(0.);
		float d = distance(u_mouse,st);


		//材質
		vec3 canvasTexture =  texture2D(tex1,mod(st*2.,1.)).rgb;
		vec3 redBlueNoise1 = vec3(cnoise(vec3(st.x*6. + u_time/50.,st.y*4.+ u_time/50.,u_time/2.)),
														 0,
														 cnoise(vec3(st.x*6.+ u_time/50.,st.y*4.+ u_time/50.,u_time/2.+5000.))/3. );
		vec3 redBlueNoise2 = vec3(cnoise(vec3(st.x*16. + u_time/80.,st.y*10.+ u_time/80.,u_time/2.)),
														 0,
														 cnoise(vec3(st.x*16.+ u_time/80.,st.y*10.+ u_time/80.,u_time/2.+5000.))/3. );
		//紅色藍色噪聲
		color += canvasTexture *canvasTexture * (redBlueNoise1+redBlueNoise2*0.2)*0.45 ;
		
		//從圖像層複製圖像，加上模糊filter
		vec2 distorted_st = st;
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/10.+u_time/40.)*50.)+1.)*50.)/50.*(0.25+u_mouse.x*1.5);
		distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/10.+u_time/20.)*50.)+1.)*100.)/50.*(0.25+u_mouse.x*1.5);
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/25.+u_time/40.)*50.)+1.)*50.)/50.*(0.25+u_mouse.x*1.5);
		distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/25.+u_time/20.)*50.)+1.)*100.)/50.*(0.25+u_mouse.x*1.5);
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/5.+u_time/40.)*50.)+1.)*50.)/100.*(0.25+u_mouse.x*1.5);
		// distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/5.+u_time/20.)*50.)+1.)*100.)/100.*(0.25+u_mouse.x*1.5);
		distorted_st.x += sin(distorted_st.y*(50.+sin(st.x)*20.)+u_time)*distorted_st.y*distorted_st.y/500.;
		
		//混成一部份原始圖像跟噪聲圖像
		vec3 filteredGraphics = texture2D(tex0,distorted_st).rgb+texture2D(tex0,st).rgb*0.1;
		color+=filteredGraphics;
		
		
		
		// color*=cnoise(vec3(st.x*0.1,st.y*0.1,u_time/10.))+0.8;
		
		//color*=vec3(60,30,36);
		// color*=1.-d;
		
		// color*=cnoise(vec3(st.x*5000.,st.y*3000.,u_time))+0.5;
		gl_FragColor= vec4(color,1.0);
	}
`



