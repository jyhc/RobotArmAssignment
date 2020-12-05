
var spherePointsCount = 0;


// generate points for a cylinder
function buildSphere()
{
    var unit_Angle = 2*Math.PI / sectorCount;
    var radius = 0.5;           // z value; -h/2 to h/2

    //top and bottom cap
    for(var i = 0; i < sectorCount; i++)
    {
        var theta = unit_Angle;
        var phi1 = unit_Angle * i;
        var phi2 = unit_Angle * (i + 1);
        
        p1 = vec3(0.0, 0.0, radius);//center
        p2 = sphereToCarteCoord(theta, phi1);
        p3 = sphereToCarteCoord(theta, phi2);
        points.push(vec4(p1));
        points.push(vec4(p2));
        points.push(vec4(p3));
        normals.push(p1); 
        normals.push(p2); 
        normals.push(p3); 

        theta = Math.PI + unit_Angle;
        p1 = vec4(0.0, 0.0, -radius, 1.0);//center
        p2 = sphereToCarteCoord(theta, phi1);
        p3 = sphereToCarteCoord(theta, phi2);
        points.push(vec4(p1));
        points.push(vec4(p2));
        points.push(vec4(p3));
        normals.push(p1); 
        normals.push(p2); 
        normals.push(p3); 

        spherePointsCount += 6;
    }
    
    //side
    for(var i = 1; i < sectorCount-1; i++)
    {
        var theta1 = unit_Angle * i;
        var theta2 = unit_Angle * (i + 1);
        for(var j = 0; j < sectorCount; j++)
        {
            var phi1 = unit_Angle * j;
            var phi2 = unit_Angle * (j + 1);

            p1 = sphereToCarteCoord(theta1, phi1);
            p2 = sphereToCarteCoord(theta1, phi2);
            p3 = sphereToCarteCoord(theta2, phi2);
            points.push(vec4(p1));
            points.push(vec4(p2));
            points.push(vec4(p3));
            normals.push(p1); 
            normals.push(p2); 
            normals.push(p3); 

            p1 = sphereToCarteCoord(theta1, phi1);
            p2 = sphereToCarteCoord(theta2, phi1);
            p3 = sphereToCarteCoord(theta2, phi2);
            points.push(vec4(p1));
            points.push(vec4(p2));
            points.push(vec4(p3));
            normals.push(p1); 
            normals.push(p2); 
            normals.push(p3);     

            spherePointsCount += 6;
        }
    }
}

function sphereToCarteCoord(theta, phi){
    var radius = 0.5;
    x = Math.sin(theta) * Math.cos(phi) * radius;
    y = Math.sin(theta) * Math.sin(phi)* radius;
    z = Math.cos(theta) * radius;
    return vec3(x, y, z);
}