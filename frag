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

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	${frag_functions_default}


	void main(){
		vec2 st = var_vertTexCoord.xy;
		vec3 color = vec3(0.);
		float d = distance(u_mouse,st);

		vec2 distorted_st = st;
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/5.+u_time/40.)*50.)+1.)*50.)/50.*(1.+u_mouse.x*1.5);
		distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/5.+u_time/20.)*50.)+1.)*100.)/50.*(1.+u_mouse.x*1.5);
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/20.+u_time/40.)*50.)+1.)*50.)/50.*(1.+u_mouse.x*1.5);
		distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/20.+u_time/20.)*50.)+1.)*100.)/50.*(1.+u_mouse.x*1.5);
		distorted_st.x+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/2.+u_time/40.)*50.)+1.)*50.)/100.*(1.+u_mouse.x*1.5);
		distorted_st.y+=cnoise(vec3(st.x*5000.,st.y*30000.,u_time))/(1.+(sin(sqrt(st.y/2.+u_time/20.)*50.)+1.)*100.)/100.*(1.+u_mouse.x*1.5);
		distorted_st.x += sin(distorted_st.y*(50.+sin(st.x)*20.)+u_time)*distorted_st.y*distorted_st.y/500.;


		color+=texture2D(tex0,distorted_st).rgb;
        
        //color.rgb=texture2D(color,distorted_st).rgb;
        
        //变黑
		color*=color;
		
		// color*=1.-d;
		
		//color.rgb=cnoise(vec3(st.x*5000.,st.y*3000.,u_time))+0.5;
		gl_FragColor= vec4(color,1.0);
	}
`




