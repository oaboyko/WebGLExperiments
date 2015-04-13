var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    '	gl_Position = a_Position;\n' +
    '	gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE=
    'precision mediump float;\n' +
    'uniform vec4 u_FragmentColor;\n' +
    'void main(){\n' +
    '	gl_FragColor = u_FragmentColor;\n ' +
    '}\n';

var g_points = [];
var g_colors = [];

function main(){
    var canvas = document.getElementById("webgl");
    var gl;
    try{
        gl = canvas.getContext("experimental-webgl");
    }
    catch(e){
        alert(e);
    }
    
    var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    
    var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    
    var program = gl.createProgram();
    
    if(!gl){
        alert("Could not get webgl context.");
        return;
    }
    
    gl.shaderSource(vertex_shader, VSHADER_SOURCE);
    gl.shaderSource(fragment_shader, FSHADER_SOURCE);
    
    gl.compileShader(vertex_shader);
    gl.compileShader(fragment_shader);
    
    if(!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)){
        alert("ERROR: vertex shader: " + gl.getShaderInfoLog(vertex_shader));
        return false;
    }
    
    if(!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)){
        alert("ERROR: fragment shader: " + gl.getShaderInfoLog(fragment_shader));
        return false;
    }
    
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    
    gl.linkProgram(program);
    
    gl.useProgram(program);
    
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    var u_FragmentColor = gl.getUniformLocation(program, 'u_FragmentColor');

    if(a_Position < 0){
        console.log('Failed to get the storage location of the a_Position attribute');
	alert("Failed to get storage location of the a_Position attribute");
        return;
    }

    canvas.onmousedown = function(event){
        click(event, gl, canvas, a_Position, u_FragmentColor);
    };


    gl.vertexAttrib1f(a_PointSize, 10.0);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //gl.drawArrays(gl.POINTS, 0, 1);
    
    gl.useProgram(program);
    
    //gl.flush();
}

function click(event, gl, canvas, a_Position, u_FragmentColor){

    var x = event.clientX;
    var y = event.clientY;

    var rectangle = event.target.getBoundingClientRect();

    x = ((x - rectangle.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rectangle.top)) / (canvas.height / 2);

    g_points.push([x, y]);
    
    if(x >= 0.0 && y >= 0.0){
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    }
    else if(x < 0.0 && y < 0.0){
	g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }
    else {
	g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }


    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;

    for(var i = 0; i < len; i++){
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
	gl.uniform4f(u_FragmentColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
	gl.drawArrays(gl.POINTS, 0, 1);
    }

}
