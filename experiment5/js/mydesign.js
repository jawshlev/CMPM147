/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Burger Woman", 
      assetUrl: "img/burgerwoman.jpeg",
      credit: "Pinterest"
    },
    {
      name: "Mr Business Cat", 
      assetUrl: "img/mrbusinesscat.jpeg",
      credit: "Pinterest"
    },
    {
      name: "Pengoon", 
      assetUrl: "img/pengoon.jpeg",
      credit: "Flickr, Famzoo Staff"
    },
    {
      name: "Cheese", 
      assetUrl: "img/cheese.jpeg",
      credit: "Robert Gober, 2020"
    },
    {
      name: "Vegetables",
      assetUrl: "img/vegetable.jpeg",
      credit: "stock photo via pinterest"
    },
  ];
}

function initDesign(inspiration) {
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/4}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 200; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width/2),
      h: random(height/2),
      fill: random(255)})
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  
  for(let box of design.fg) {
    fill(box.fill, 128);
    if(inspiration.name == "Burger Woman"){
      for (let i = 0; i < 10; i ++) {
        ellipse(box.x, box.y, box.w, box.h);
        rotate(PI/3);
      }
      
    }
    if(inspiration.name == "Mr Business Cat"){
      let numRects = 4;
      for (let i = 0; i < numRects; i++) {
        let x = box.x / 2 - box.w / 2 * i;
        let y = box.y / 2 - box.h / 2 * i;
        let w = box.w * i;
        let h = box.h * i;
        rect(x, y, w, h);
      }
    }
    if(inspiration.name == "Pengoon"){
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          rect(box.x, box.y, box.w, box.h);
        }
      }
    }
    if(inspiration.name == "Cheese"){
      for(let i = 0; i < 10; i++){
        if(i <= 5){
          ellipse(box.y, box.x, box.h/i, box.w/i);
        }
        else{
          rect(box.y, box.x, box.h/i, box.w/i);
        }
      }
    }
    if(inspiration.name == "Vegetables"){
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ellipse(box.x, box.y, box.w, box.h);
        }
      }
    }
    
  }
}


function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);

    switch(inspiration.name) {
    case "Burger Woman":
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, width/4, width/2, rate);
      box.h = mut(box.h, height/4, height/2, rate);
      break;
    case "Pengoon":
      box.x = mut(box.x, 0, width/2, rate);
      box.y = mut(box.y, 0, height/2, rate);
      box.w = mut(box.w, width/4, width/2, rate);
      box.h = mut(box.h, height/4, height/2, rate);
      break;
    case "Mr Business Cat":
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width/2, rate);
      box.h = mut(box.h, 0, height/2, rate);
      break;
    case "Cheese":
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, width/8, width/4, rate);
      box.h = mut(box.h, height/8, height/4, rate);
      break;
    case "Vegetables":
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, width/4, width/2, rate);
      box.h = mut(box.h, height/4, height/2, rate);
      break;
      
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}