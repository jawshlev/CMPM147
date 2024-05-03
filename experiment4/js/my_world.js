"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  if (isPond(i, j, worldSeed)) {
    // Skip processing clicks on pond tiles
    return;
  }
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let desertThreshold = 20;
  let desertProbability = map(j, desertThreshold - 5, desertThreshold, 0, 1);
  if (XXH.h32("desert:" + [i, j], worldSeed) % 100 < desertProbability * 100) {
    // Desert transition tiles
    fill(255, 218, 185); // Peach color
  } else if (j > desertThreshold) {
    // Desert biome
    fill(255, 218, 185); // Peach color
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    // Grass tile
    fill(76, 175, 80); // Darker shade of green
  } else {
    // Other tiles
    fill(144, 238, 144); // Lighter shade of green
  }
  if (XXH.h32("dessert:" + [i, j], worldSeed) % 4 == 0 && j > 20){
    fill(255, 165, 0); // Darker orangish color
  }
  
  // Check if the tile should contain a house
  if (isHouse(i, j, worldSeed)) {
    // Draw a house on the tile
    drawHouse(i, j);
  } else {
    // Check if the tile should contain a pond
    if (isPond(i, j, worldSeed)) {
      // Pond tile
      fill(65, 105, 225); // Blue color for pond
    } else {
      // Check if the tile should contain a rock
      if (isRock(i, j, worldSeed)) {
        // Draw a rock on the tile
        drawRock(i, j);
      }
    }
  }

  // Draw the tile shape
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    if (j > desertThreshold) {
      fill(50, 150, 50); // Green color for cactus
      rect(0, -20, 5, 60); // Stem
      rect(-10, -17, 5, 12); // Right Arm p1
      rect(-10, -10, 10, 5); // Right arm p2
      rect(10, -12, 5, 12); // Right Arm p1
      rect(5, -5, 10, 5); // Right arm p2
    } else {
      fill(0, 128, 0); // Green color for the stem
      rect(0, -20, 5, 30); // Stem
      fill(34, 139, 34); // Dark green color for the leaves
      ellipse(-5, -15, 20, 15); // Leaf 1
      ellipse(5, -20, 20, 15); // Leaf 2
      fill(255, 255, 0); // Yellow color for the flower
      ellipse(0, -20, 15, 15); // Flower
    }
  }
}

function isRock(i, j, worldSeed) {
  // Rocks spawn randomly in the desert biome
  if (j > 20) {
    return XXH.h32("rock:" + [i, j], worldSeed) % 100 == 0; // Adjust the divisor as needed
  }
  return false;
}

function drawRock(x, y) {
  let randomSeedValue = XXH.h32("rock:" + [x, y], worldSeed);
  randomSeed(randomSeedValue);

  fill(169); // Grey color for rock
  beginShape();
  vertex(x - random(5), y - random(5));
  vertex(x + random(10), y - random(5));
  vertex(x + random(5), y + random(5));
  vertex(x - random(10), y + random(5));
  endShape(CLOSE);
}



function isPond(i, j, worldSeed) {
  // Ponds do not spawn in the desert biome
  if (j > 15) {
    return false;
  }
  
  // Check if the current tile and its neighbors form a 2x2 group
  // You can adjust the condition based on your specific requirements
  return (
    isPondTile(i, j, worldSeed) ||
    isPondTile(i + 1, j, worldSeed) ||
    isPondTile(i, j + 1, worldSeed) ||
    isPondTile(i + 1, j + 1, worldSeed)
  );
}


// Function to check if a single tile represents a pond
function isPondTile(i, j, worldSeed) {
  // You can adjust this condition based on your specific requirements
  // For simplicity, let's say ponds spawn randomly with a certain probability
  return XXH.h32("pond:" + [i, j], worldSeed) % 100 == 0; // Adjust the divisor as needed
}

function drawHouse(x, y) {

  // Draw the base of the house
  push();
  fill(255, 0, 0); // Red color for the house base
  rect(x, y - 60, 80, 60); // Base of the house
  
  // Draw the door
  fill(102, 51, 0); // Brown color for the door
  rect(x + 30, y - 40, 20, 40); // Door
  
  // Draw the left window
  fill(173, 216, 230); // Light blue color for the window
  rect(x + 4, y - 40, 20, 20); // Window
  
  // Draw the right window
  fill(173, 216, 230); // Light blue color for the window
  rect(x + 56, y - 40, 20, 20); // Window
  pop();
  
  // Draw the roof of the house
  push();
  fill(255, 255, 0); // Yellow color for the roof
  triangle(x, y - 60, x + 40, y - 120, x + 80, y - 60); // Roof of the house
  pop();
}

function isHouse(i, j, worldSeed) {
  const minDistance = 3; // Minimum distance between houses and ponds

  // Check if there are any neighboring houses
  for (let ni = i - 1; ni <= i + 1; ni++) {
    for (let nj = j - 1; nj <= j + 1; nj++) {
      if (ni !== i || nj !== j) {
        if (XXH.h32("house:" + [ni, nj], worldSeed) % 100 == 0) {
          return false; // There is a neighboring house
        }
      }
    }
  }

  // Check if there are any neighboring ponds
  for (let ni = i - 1; ni <= i + 1; ni++) {
    for (let nj = j - 1; nj <= j + 1; nj++) {
      if (ni !== i || nj !== j) {
        if (isPondTile(ni, nj, worldSeed)) {
          return false; // There is a neighboring pond
        }
      }
    }
  }

  // Check the minimum distance from other houses and ponds
  for (let dx = -minDistance; dx <= minDistance; dx++) {
    for (let dy = -minDistance; dy <= minDistance; dy++) {
      if (dx !== 0 || dy !== 0) {
        if (XXH.h32("house:" + [i + dx, j + dy], worldSeed) % 100 == 0) {
          return false; // House is too close to another house
        }
        if (isPondTile(i + dx, j + dy, worldSeed)) {
          return false; // House is too close to a pond
        }
      }
    }
  }

  // No neighboring houses or ponds found within the minimum distance, house can be placed
  if (j < -20) {
    return XXH.h32("house:" + [i, j], worldSeed) % 100 == 0;
  }
}



function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
