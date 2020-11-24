"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var normals = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),//0
    vec4( -0.5,  0.5,  0.5, 1.0 ),//1
    vec4(  0.5,  0.5,  0.5, 1.0 ),//2
    vec4(  0.5, -0.5,  0.5, 1.0 ),//3
    vec4( -0.5, -0.5, -0.5, 1.0 ),//4
    vec4( -0.5,  0.5, -0.5, 1.0 ),//5
    vec4(  0.5,  0.5, -0.5, 1.0 ),//6
    vec4(  0.5, -0.5, -0.5, 1.0 )//7
];

var ambientColor = [0.33, 0.22, 0.03];
var diffuseColor = [0.78, 0.57, 0.11];
var specularColor = [0.99, 0.91, 0.81];
var lightPosition = [1.0, 1.0, 1.0];

var ambientArm1 = [0.0, 0.40, 0.0]
var diffuseArm1 = [0.0, 0.95, 0.0];


var ambientArm2 = [0.40, 0.0, 0.0]
var diffuseArm2 = [0.95, 0.0, 0.0];

// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 0.5;
var BASE_RADIUS       = 0.5;
var LOWER_ARM_HEIGHT = 2.0;
var LOWER_ARM_WIDTH  = 0.3;
var UPPER_ARM_HEIGHT = 2.0;
var UPPER_ARM_WIDTH  = 0.3;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix, normalMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;

var sideview = true;
var sideProjection, topProjection;

var theta= [ 0, 0, 0];

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, nBuffer;

//----------------------------------------------------------------------------

//each face
function quad(  a,  b,  c,  d ) {
    
    points.push(vertices[a]);

    points.push(vertices[b]);
    
    points.push(vertices[c]);
    
    points.push(vertices[a]);
    
    points.push(vertices[c]);
    
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    normals.push(vec3(0, 0, 1.0));
    normals.push(vec3(0, 0, 1.0));
    normals.push(vec3(0, 0, 1.0));
    normals.push(vec3(0, 0, 1.0));
    normals.push(vec3(0, 0, 1.0));
    normals.push(vec3(0, 0, 1.0));
    quad( 2, 3, 7, 6 ); 
    normals.push(vec3(1.0, 0, 0));
    normals.push(vec3(1.0, 0, 0));
    normals.push(vec3(1.0, 0, 0));
    normals.push(vec3(1.0, 0, 0));
    normals.push(vec3(1.0, 0, 0));
    normals.push(vec3(1.0, 0, 0));
    quad( 3, 0, 4, 7 );
    normals.push(vec3(0, -1.0, 0));
    normals.push(vec3(0, -1.0, 0));
    normals.push(vec3(0, -1.0, 0));
    normals.push(vec3(0, -1.0, 0));
    normals.push(vec3(0, -1.0, 0));
    normals.push(vec3(0, -1.0, 0));
    quad( 6, 5, 1, 2 );
    normals.push(vec3(0, 1.0, 0));
    normals.push(vec3(0, 1.0, 0));
    normals.push(vec3(0, 1.0, 0));
    normals.push(vec3(0, 1.0, 0));
    normals.push(vec3(0, 1.0, 0));
    normals.push(vec3(0, 1.0, 0));
    quad( 4, 5, 6, 7 );
    normals.push(vec3(0, 0, -1.0));
    normals.push(vec3(0, 0, -1.0));
    normals.push(vec3(0, 0, -1.0));
    normals.push(vec3(0, 0, -1.0));
    normals.push(vec3(0, 0, -1.0));
    normals.push(vec3(0, 0, -1.0));
    quad( 5, 4, 0, 1 );
    normals.push(vec3(-1.0, 0, 0));
    normals.push(vec3(-1.0, 0, 0));
    normals.push(vec3(-1.0, 0, 0));
    normals.push(vec3(-1.0, 0, 0));
    normals.push(vec3(-1.0, 0, 0));
    normals.push(vec3(-1.0, 0, 0));
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    gl.useProgram( program );
    
    //populate positions with cylinder points and colors with cylinder colors
    buildCylinder();
    
    colorCube();
    
    // Load shaders and use the resulting shader program
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    normalMatrix = mat4();
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"),  false, flatten(normalMatrix));

    // Create and initialize  buffer objects
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var inputNormal = gl.getAttribLocation( program, "inputNormal" );
    gl.vertexAttribPointer(inputNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(inputNormal);
    
    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("slider2").onchange = function(event) {
        theta[1] = event.target.value;
    };
    document.getElementById("slider3").onchange = function(event) {
        theta[2] =  event.target.value;
    };
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    
    sideProjection = ortho(-10, 10, -10, 10, -10, 10);
    topProjection = mult(rotateX(-90), sideProjection);

    // gl.uniform3fv(gl.getUniformLocation(program, "ambientColor"), ambientColor);
    // gl.uniform3fv(gl.getUniformLocation(program, "diffuseColor"), diffuseColor);
    gl.uniform3fv(gl.getUniformLocation(program, "specularColor"), specularColor);
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), lightPosition);

    render();
}

//----------------------------------------------------------------------------

//index where cube model starts

function base() {
    var s = scale4(BASE_RADIUS, BASE_HEIGHT, BASE_RADIUS);
    // s = mult(rotate(90, 1, 0 , 0), s);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );

    var r = inverse4(modelViewMatrix);
    r = transpose(r);    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"),  false, flatten(r));

    gl.uniform3fv(gl.getUniformLocation(program, "diffuseColor"), diffuseColor);
    gl.uniform3fv(gl.getUniformLocation(program, "ambientColor"), ambientColor);

    gl.drawArrays( gl.TRIANGLES, 0, cylinderPointsCount);
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );

    var r = inverse4(modelViewMatrix);
    r = transpose(r);    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"),  false, flatten(r));

    gl.uniform3fv(gl.getUniformLocation(program, "diffuseColor"), diffuseArm1);
    gl.uniform3fv(gl.getUniformLocation(program, "ambientColor"), ambientArm1);
    
    gl.drawArrays( gl.TRIANGLES, cylinderPointsCount, NumVertices );
}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );

    var r = inverse4(modelViewMatrix);
    r = transpose(r);    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"),  false, flatten(r));

    gl.uniform3fv(gl.getUniformLocation(program, "diffuseColor"), diffuseArm2);
    gl.uniform3fv(gl.getUniformLocation(program, "ambientColor"), ambientArm2);

    gl.drawArrays( gl.TRIANGLES, cylinderPointsCount, NumVertices );
}

//----------------------------------------------------------------------------


var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    modelViewMatrix = rotate(theta[Base], 0, 1, 0 );

    if(sideview){
        projectionMatrix = sideProjection;
    } else {
        projectionMatrix = topProjection;
    }

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, 0, 1 ));
    lowerArm();

    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 0, 1) );
    upperArm();

    requestAnimFrame(render);
}

function change(){
    var elem = document.getElementById("myButton1");
    if (elem.value=="Top View"){
        elem.value = "Side View";
        sideview = false;
    }
    else {
        elem.value = "Top View";
        sideview = true;
    }
}