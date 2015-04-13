var VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    '	gl_Position = a_Position;\n' +
    '	gl_PointSize = 10.0;\n' +
    '}\n';

var FSHADER_SOURCE=
    'void main(){\n' +
    '	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n ' +
    '}\n';

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

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    if(a_Position < 0){
	console.log('Failed to get the storage location of the a_Position attribute');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //gl.useProgram(program);

    var n = initVertexBuffers(gl, program);
    if(n < 0){
	console.log("Failed to set the position of the verticies.");
    }

    gl.useProgram(program);

    gl.drawArrays(gl.POINTS, 0, n);

}

function initVertexBuffers(gl, program){

    var vertices = new Float32Array([
	0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ]);


    var n = 3;

    var vertex_buffer = gl.createBuffer();

    if(!vertex_buffer){
        alert('Failed to create vertex buffer.');
	return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    if(a_Position < 0){
	console.log('Failed to get the storage location of the a_Position attribute in buffers.');
        return -1;
    }
    
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;

}
