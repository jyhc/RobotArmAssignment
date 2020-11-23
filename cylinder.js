//code adapted from http://www.songho.ca/opengl/gl_cylinder.html

const sectorCount = 48;
var cylinderPointsCount = 0;

// generate a unit circle on XY-plane
function getUnitCircleVertices()
{
    sectorStep = 2 * Math.PI / sectorCount;
    var sectorAngle;  // radian

    unitCircleVertices = new Array();
    for(var i = 0; i < sectorCount; ++i)
    {
        sectorAngle = i * sectorStep;
        unitCircleVertices.push(Math.sin(sectorAngle) * 0.5); // x
        unitCircleVertices.push(0);// y
        unitCircleVertices.push(Math.cos(sectorAngle) * 0.5); // z
    }
    return unitCircleVertices;
}

// generate points for a cylinder
function buildCylinder()
{
    // get unit circle vectors on XY-plane
    unitVertices = getUnitCircleVertices();

    var h1 = -0.5;           // z value; -h/2 to h/2
    var h2 = 0.5;           // z value; -h/2 to h/2

    for(var j = 0, k = 0; j < sectorCount; j++, k += 3)
    {
        var ux1 = unitVertices[k % (sectorCount*3)];
        var uy1 = unitVertices[(k+1) % (sectorCount*3)];
        var uz1 = unitVertices[(k+2) % (sectorCount*3)];
        var ux2 = unitVertices[(k+3) % (sectorCount*3)];
        var uy2 = unitVertices[(k+4) % (sectorCount*3)];
        var uz2 = unitVertices[(k+5) % (sectorCount*3)];
        
        //bottom face-----------------------------------------------
        // position vector: vx, vy, vz, 1.0
        p1 = vec4(ux1, h1, uz1, 1.0);
        p2 = vec4(ux2, h1, uz2, 1.0);
        p3 = vec4(0, h1, 0, 1.0);
        points.push(p1);
        points.push(p2);
        points.push(p3);
        cylinderPointsCount+=3;
        //color
        // colors.push(vertexColors[1]);
        // colors.push(vertexColors[1]);
        // colors.push(vertexColors[1]);
        // normal vector
        normals.push(vec3(0.0, 1.0, 0.0)); 
        normals.push(vec3(0.0, 1.0, 0.0)); 
        normals.push(vec3(0.0, 1.0, 0.0)); 

        //top face ---------------------------------------------------
        // position vector: vx, vy, vz, 1.0
        p1 = vec4(ux1, h2, uz1, 1.0);
        p2 = vec4(ux2, h2, uz2, 1.0);
        p3 = vec4(0, h2, 0, 1.0);
        points.push(p1);
        points.push(p2);
        points.push(p3);
        cylinderPointsCount+=3;
        //color
        // colors.push(vertexColors[1]);
        // colors.push(vertexColors[1]);
        // colors.push(vertexColors[1]);
        // normal vector
        normals.push(vec3(0.0, 1.0, 0.0)); 
        normals.push(vec3(0.0, 1.0, 0.0)); 
        normals.push(vec3(0.0, 1.0, 0.0)); 

        //body-------------------------------------------------------
        p1 = vec4(ux1, h1, uz1, 1.0);
        p2 = vec4(ux2, h1, uz2, 1.0);
        p3 = vec4(ux1, h2, uz1, 1.0);
        points.push(p1);
        points.push(p2);
        points.push(p3);
        cylinderPointsCount+=3;
        //color
        // colors.push(vertexColors[3]);
        // colors.push(vertexColors[3]);
        // colors.push(vertexColors[3]);
        // normal vector
        normals.push(vec3(ux1, 0.0, uz1)); 
        normals.push(vec3(ux2, 0.0, uz2)); 
        normals.push(vec3(ux1, 0.0, uz1)); 

        p1 = vec4(ux1, h2, uz1, 1.0);
        p2 = vec4(ux2, h2, uz2, 1.0);
        p3 = vec4(ux2, h1, uz2, 1.0);
        points.push(p1);
        points.push(p2);
        points.push(p3);
        cylinderPointsCount+=3;
        //color
        // colors.push(vertexColors[3]);
        // colors.push(vertexColors[3]);
        // colors.push(vertexColors[3]);
        // normal vector
        normals.push(vec3(ux1, 0.0, uz1)); // nx
        normals.push(vec3(ux2, 0.0, uz2)); // ny
        normals.push(vec3(ux2, 0.0, uy2)); // nz
    }  
}
