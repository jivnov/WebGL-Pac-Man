let wallTexture;
let foodTexture;
let superFoodTexture;
let pacmanTexture;
let ghost1Texture;
let ghost2Texture;
let ghost3Texture;
let ghost4Texture;

// Scaling factors
const sx = 0.5;
const sy = 0.5;
const sz = 0.5;

// Vertices defining the faces
const vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
];

// Vertex indices defining the triangles
const cubeVertexIndices = [

    0, 1, 2, 0, 2, 3,    // Front face

    4, 5, 6, 4, 6, 7,    // Back face

    8, 9, 10, 8, 10, 11,  // Top face

    12, 13, 14, 12, 14, 15, // Bottom face

    16, 17, 18, 16, 18, 19, // Right face

    20, 21, 22, 20, 22, 23  // Left face
];

// Texture coordinates for the quadrangular faces
const textureCoords = [

    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

// Vertex normals
const normals = [

    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  //v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  //v0-v3-v4-v5 right
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  //v0-v5-v6-v1 top
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  //v1-v6-v7-v2 left
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  //v7-v4-v3-v2 bottom
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   //v4-v7-v6-v5 back
];

// Viewer position
const pos_Viewer = [0.0, 0.0, 0.0, 1.0];

// Model Material Features

// Ambient coef.
const kAmbi = [0.8, 0.8, 0.8];

// Diffuse coef.
const kDiff = [0.8, 0.8, 0.8];

// Specular coef.
const kSpec = [0.7, 0.7, 0.7];

// Phong coef.
const nPhong = 100;


function initCubeBuffer() {

    // Coordinates

    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = vertices.length / 3;

    // Textures

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    // Vertex indices

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    // Vertex Normal Vectors

    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = normals.length / 3;
}

function handleLoadedTexture(texture) {

    // Bind textures
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTextures() {

    // Wall texture
    wallTexture = gl.createTexture();
    wallTexture.image = new Image();
    wallTexture.image.onload = function () {
        handleLoadedTexture(wallTexture)
    }

    wallTexture.image.src = "assets/bounds.jpg";

    // Food texture
    foodTexture = gl.createTexture();
    foodTexture.image = new Image();
    foodTexture.image.onload = function () {
        handleLoadedTexture(foodTexture)
    }

    foodTexture.image.src = "assets/food.png";

    // Super food texture
    superFoodTexture = gl.createTexture();
    superFoodTexture.image = new Image();
    superFoodTexture.image.onload = function () {
        handleLoadedTexture(superFoodTexture)
    }

    superFoodTexture.image.src = "assets/super-food.png";

    // Pacman texture
    pacmanTexture = gl.createTexture();
    pacmanTexture.image = new Image();
    pacmanTexture.image.onload = function () {
        handleLoadedTexture(pacmanTexture)
    }

    pacmanTexture.image.src = "assets/pacman.png";

    ghost1Texture = createGhostTexture("assets/ghosts/gh1.png")
    ghost2Texture = createGhostTexture("assets/ghosts/gh2.png")
    ghost3Texture = createGhostTexture("assets/ghosts/gh3.png")
    ghost4Texture = createGhostTexture("assets/ghosts/gh4.png")
}

function createGhostTexture(asset) {
    let texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    }

    texture.image.src = asset;

    return texture
}