let spawnBlock = []

// w -> wall; n -> nothing; sp -> special fields for ghosts; f -> food; s -> super-food; p -> portal
const w = 'w';
const f = 'f';
const s = 's';
const p = 'p';
const n = 'n';
const sp = 'sp';

let field_structure = [
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
    [w, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, w],
    [w, s, w, w, f, w, w, w, f, w, f, w, w, w, f, w, w, s, w],
    [w, f, w, w, f, w, w, w, f, w, f, w, w, w, f, w, w, f, w],
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    [w, f, w, w, f, w, f, w, w, w, w, w, f, w, f, w, w, f, w],
    [w, f, f, f, f, w, f, f, f, w, f, f, f, w, f, f, f, f, w],
    [w, w, w, w, f, w, w, w, f, w, f, w, w, w, f, w, w, w, w],
    [n, n, n, w, f, w, f, f, f, f, f, f, f, w, f, w, n, n, n],
    [w, w, w, w, f, w, f, w, w, f, w, w, f, w, f, w, w, w, w],
    [p, f, f, f, f, f, f, w, sp, sp, sp, w, f, f, f, f, f, f, p],
    [w, w, w, w, f, w, f, w, w, w, w, w, f, w, f, w, w, w, w],
    [n, n, n, w, f, w, f, f, f, f, f, f, f, w, f, w, n, n, n],
    [w, w, w, w, f, w, f, w, w, w, w, w, f, w, f, w, w, w, w],
    [w, f, f, f, f, f, f, f, f, w, f, f, f, f, f, f, f, f, w],
    [w, f, w, w, f, w, w, w, f, w, f, w, w, w, f, w, w, f, w],
    [w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
    [w, w, f, w, f, w, f, w, w, w, w, w, f, w, f, w, f, w, w],
    [w, f, f, s, f, w, f, f, f, w, f, f, f, w, f, s, f, f, w],
    [w, f, w, w, w, w, w, w, f, w, f, w, w, w, w, w, w, f, w],
    [w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
    [w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
];

const possibleMoves = [
    {
        'x': 1,
        'z': 0,
        'key': 39
    }, {
        'x': -1,
        'z': 0,
        'key': 37
    }, {
        'x': 0,
        'z': 1,
        'key': 40
    }, {
        'x': 0,
        'z': -1,
        'key': 38
    }
];

const field = {
    structure: [],
    height: 0,
    width: 0,
    xBlockSize: 1.0,
    zBlockSize: 1.0,
    speed: 0.025,
    init: function (structure, height, width) {
        this.structure = structure;
        this.height = height;
        this.width = width;
    }
}

// Game flags and values
let remainingFood = 0;
let difficulty = 0;
let portals = [];

// Light threshold in hard mode
const threshold = 4.0;

// Chars objects
let pacman;
let ghosts = [];
let deadGhosts = [];


function FieldBlockConstructor(type, xPos, yPos, zPos) {
    // Block type
    this.type = type;
    // Block coordinates
    this.x = xPos;
    this.z = zPos;
    // Possible moves on that block
    this.moves = [];
}

function CharacterConstructor(id) {
    // Char coordinates
    this.x = 0.0;
    this.z = 0.0;
    // Char direction
    this.xDirection = 0.0;
    this.zDirection = 0.0;
    this.key = -1.0;
    // Next direction to take, when possible
    this.nextDirection = {};
    // Reference to the current block
    this.currentBlock = {};
    // Char identificator
    this.id = id;
    // Teleportation indicator
    this.teleportation = false;

    this.init = function (x, z) {

        // Find the structure matrix indexes
        const i = parseInt(x + (field.width / 2));
        const j = parseInt(z + (field.height / 2));

        // Initialize char position and block
        this.x = field.structure[j][i].x;
        this.z = field.structure[j][i].z;
        this.currentBlock = field.structure[j][i];
    };

    this.updateDirection = function (moveX, moveZ, key) {

        // Schedule next direction
        this.nextDirection['x'] = moveX;
        this.nextDirection['z'] = moveZ;
        this.nextDirection['key'] = key;
    };

    this.updatePosition = function () {

        // Update the current block, based on the direction taken
        this.currentBlock = field.structure[this.currentBlock.z + this.zDirection][this.currentBlock.x + this.xDirection];
    };
}

function randomCoordinates() {
    let x, z;

    // Find coordinates of a random possible block (food, super-food or portal)
    do {
        x = Math.floor(Math.random() * field.width);
        z = Math.floor(Math.random() * field.height);
    } while (field.structure[z][x].type === 'w' || field.structure[z][x].type === 'n');
    return {'x': x - (field.width / 2), 'z': z - (field.height / 2)}
}

function randomCoordinatesGhost() {
    let x, z;

    // Find coordinates of a random possible block (food, super-food or portal)
    do {
        x = Math.floor(Math.random() * field.width);
        z = Math.floor(Math.random() * field.height);
    } while (field.structure[z][x].type !== 'sp');
    return {'x': x - (field.width / 2), 'z': z - (field.height / 2)}
}

function createFieldStructure(structure) {
    const width = structure[0].length;
    const height = structure.length;
    const newField = [];

    // Create field structure
    for (let i = 0; i < height; i++) {
        const line = [];
        for (let j = 0; j < width; j++) {
            const fieldBlock = new FieldBlockConstructor(structure[i][j], j, 0, i);
            line.push(fieldBlock);

            // Count food present on field
            if (structure[i][j] === 'f' || structure[i][j] === 's') {
                remainingFood++;
            }

            // Save the portal in the portals array
            if (structure[i][j] === 'p') {
                portals.push(fieldBlock);
            }

            // Save the spawn block coordinates
            if (structure[i][j] === 'sp') {
                spawnBlock.push({'x': i, 'z': j});
            }
        }
        newField.push(line);
    }
    return newField;

}