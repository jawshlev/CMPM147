// project.js - Purpose is to randomly generate and outfit for a randomly selected location
// Author: Josh Levano
// Date: 4/8/24

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
function main() {
  const fillers = {
    Person: ["Bloke", "Dawgie", "Dude", "Bro", "Brosef", "Gurl", "Girlie Pop", "Miss Ma'am", "Bruh"],
    Compliments: ["swag", "kewl", "epic", "sauced up", "dapper", "fresh", "suave", "gangstalicious", "clean", "crisp", "based", "fly", "steezy"],
    Dress: ["wearing", "adorning", "rocking", "to don", "to put on"],
    Hat: ["UCSC real tree hat", "All Fur Trapper", "Knight Helmet", "Skull Beanie", "Fitted Hat", "X-Ray Vision goggles", "Chrome Hearts Ski Goggles", "NY Yankee 360 Brim", "Fortnite Hat", "Spongebob Beanie", "Hatsune Miku Wig", "Digimon Bandana", "Coors Light Top Hat", "Redditor Fedora"],
    Tops: ["Is it 2010 yet? Tee", "Plain White Tank Top", "JPG Mesh Top", "Juice Wrld Tee", "Grumpy Cat Full Graphic Tee", "Affliction Tee", "I <3 NY Tee", "Fortnite Forever Tee", "Josh Wine Tee", "Maison Margiela Artisinal Kiss Shirt", "Purple Rain Prince Tee", "I paused my game to be here Tee", "Trollface Tee"],
    Outerwear: ["Junya Watanabe x Comme Des Garcons stripped mohair sweater", "14th Addiction Cross Zip", "Yasuyuki Ishii Riders Jacket","Period Accurate British Coatails from American revolutionary war", "UCSC Rainbow Hoodie", "Carhartt Workwear Cybery2k Jacket", "Punk Battle Jacket", "Nyan Cat Hoodie", "Mincraft Creepr Hoodie", "Straightjacket"],
    Bottoms: ["IfSixWasNine Mud Max Pants", "True Religion Jeans", "JNCO jeans", "Carhartt Double Knee", "Fortnite Pjama Pants", "Acid Washed Ripped Stacked Denim Skinny Jeans", "Neon Green Nike Dry-Fit Shorts", "Balenciaga Raver Jeans", "Miu Miu Pleated Skirt", "Kilt", "Spongebob Short Shorts", "Chaps with Flared Jeans", "Funyuns sweat pants", "camo pants"],
    Socks: ["Rainbow socks", "Rick and Morty Socks", "Black Socks", "White Socks", "Leggings from Spirit Halloween", "Soquette socks", "Fortnite Socks", "Minecraft Socks", "no socks"],
    Shoes: ["Rick Owens Kiss Boors", "Jordan 1s", "Platform Boots", "Steel-Toe Boots", "Timbs", "5-toe shoes", "Converse", "Addidas Sambas", "Lightning McQueen Crocs", "Midievel Greaves", "Buckled Shoes", "Sketchers Light Up Shoes", "Doc Martens"],
    location: ["Bus Stop", "MCHenry Library", "House of Representatives", " set of 90's hit American Sitcom Friends", "Dentist Office", "Financial Aid Office","BART Station", "Kava Bar", "Castle of Vilheim the Dark Lord", "Trader Joes", "7/11", "Dragon's Lair"],
  };
  
  const template = `$Person, have you ever wanted a $Compliments fit, something to look $Compliments?
  
  Try $Dress, a $Hat with a $Tops, and a $Outerwear on top!
  
  Pairing this with some $Bottoms, $Socks, and $Shoes.
  
  With the power of this fit you will be the most $Compliments at the $location
  
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();