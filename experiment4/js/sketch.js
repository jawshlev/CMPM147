/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

/* exported generateGrid, drawGrid */
/* global placeTile */

// Global variable for tile offset pairs
const lookup = [
  [0, 0], // 0000
  [0, 1], // 0001
  [0, -1], // 0010
  [0, 0], // 0011
  [1, 0], // 0100
  [1, 1], // 0101
  [1, -1], // 0110
  [0, 0], // 0111
  [-1, 0], // 1000
  [-1, 1], // 1001
  [-1, -1], // 1010
  [0, 0], // 1011
  [0, 0], // 1100
  [0, 0], // 1101
  [0, 0], // 1110
  [0, 0], // 1111
];

// Function to check if a location is inside the grid and matches the target
function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] === target;
  }
  return false;
}

// Function to form a 4-bit code using gridCheck on the neighbors
function gridCode(grid, i, j, target) {
  const northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  const southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  const eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  const westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}

// Function to draw context based on grid code and target
function drawContext(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}
  
function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  const roomMinSize = 5; // Minimum size of a room
  const roomMaxSize = 10; // Maximum size of a room
  const numRooms = 5; // Number of rooms
  const minDistanceBetweenRooms = 3; // Minimum distance between rooms

  // Helper function to check if a point is inside a room
  function isInsideRoom(x, y) {
    for (let room of rooms) {
      if (x >= room.x && x < room.x + room.width && y >= room.y && y < room.y + room.height) {
        return true;
      }
    }
    return false;
  }

  // Generate rooms
  let rooms = [];
  for (let i = 0; i < numRooms; i++) {
    let roomWidth = floor(random(roomMinSize, roomMaxSize));
    let roomHeight = floor(random(roomMinSize, roomMaxSize));
    let roomX = floor(random(1, numCols - roomWidth - 1));
    let roomY = floor(random(1, numRows - roomHeight - 1));
    
    // Check if the new room overlaps with existing rooms
    let overlaps = false;
    for (let room of rooms) {
      if (roomX < room.x + room.width + minDistanceBetweenRooms &&
          roomX + roomWidth + minDistanceBetweenRooms > room.x &&
          roomY < room.y + room.height + minDistanceBetweenRooms &&
          roomY + roomHeight + minDistanceBetweenRooms > room.y) {
        overlaps = true;
        break;
      }
    }

    // If the room doesn't overlap, add it to the grid
    if (!overlaps) {
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          grid[y][x] = "|";
        }
      }
      rooms.push({x: roomX, y: roomY, width: roomWidth, height: roomHeight});
    }
  }

  // Connect rooms with hallways
  for (let i = 0; i < rooms.length - 1; i++) {
    let room1 = rooms[i];
    let room2 = rooms[i + 1];

    let x1 = Math.floor(room1.x + room1.width / 2);
    let y1 = Math.floor(room1.y + room1.height / 2);
    let x2 = Math.floor(room2.x + room2.width / 2);
    let y2 = Math.floor(room2.y + room2.height / 2);

    while (x1 !== x2 || y1 !== y2) {
      if (!isInsideRoom(x1, y1)) {
        grid[y1][x1] = "|";
      }
      if (x1 < x2) x1++;
      else if (x1 > x2) x1--;
      if (y1 < y2) y1++;
      else if (y1 > y2) y1--;
    }
  }

  // Add borders around rooms and hallways
  for (let room of rooms) {
    for (let y = room.y - 1; y <= room.y + room.height; y++) {
      if (y >= 0 && y < numRows) {
        if (grid[y][room.x - 1] === "_") grid[y][room.x - 1] = "B"; // Left border
        if (grid[y][room.x + room.width] === "_") grid[y][room.x + room.width] = "B"; // Right border
      }
    }
    for (let x = room.x - 1; x <= room.x + room.width; x++) {
      if (grid[room.y - 1][x] === "_") grid[room.y - 1][x] = "B"; // Top border
      if (grid[room.y + room.height][x] === "_") grid[room.y + room.height][x] = "B"; // Bottom border
    }
  }

  return grid;
}



function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "|")) { // Check if current cell is part of the room
        placeTile(i, j, floor(random(4)), 0); // Place a random tile for the room
      } else { // Otherwise, handle transitions using autotiling logic
        drawContext(grid, i, j, "|", 2, 12);
      }
    }
  }
}


