// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

/* exported setup, draw */
let seed = 1738;

const grassColor = "#858290";
const stoneColor = "#71ad00";
const waterColor = "#0077be";
const treeColor = "#6f8c0b";
let waveOffset = 0;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

$("#reimagine").click(function() {
  seed++;
});

function setup() {  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  //grass
  fill(grassColor);
  rect(0, height * 0.5, width, height * 0.5);
  
  // Calculate wave offset based on mouseX
  let waveOffsetMouse = map(mouseX, 0, width, -PI, PI);
  
  //water
  fill(waterColor);
  beginShape();
  vertex(0, height * 0.8);
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.85 + sin(x * 0.06 + waveOffset + waveOffsetMouse) * 10;
    vertex(x, y);
  }
  vertex(width, height * 0.8);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  //terrace
  fill(stoneColor);
  const terraceCount = 8;
  const terraceHeight = (height * 0.8) / terraceCount;
  for (let i = 0; i < terraceCount; i++) {
    beginShape();
    vertex(0, height * 0.8 - i * terraceHeight);
    for (let j = 0; j < width; j += random(20, 40)) {
      let y = height * 0.8 - i * terraceHeight - random(0, 20);
      vertex(j, y);
    }
    vertex(width, height * 0.8 - i * terraceHeight);
    vertex(width, height * 0.8 - (i + 1) * terraceHeight);
    vertex(0, height * 0.8 - (i + 1) * terraceHeight);
    endShape(CLOSE);
  }
  //tree
  fill(treeColor);
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let y = height * 0.45 - random(10, 90);
    ellipse(x, y, random(10, 20), random(20, 40));
  }
}
