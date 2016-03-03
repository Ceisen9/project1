var turns = 0;
var clicks = 0;

var memory = {
  deck1: [],
  deck2: [],
  shuffleDeck: [],
  exposed: [],
  cardSelector: document.querySelectorAll(".box:not(.box1):not(.box18)"),
  buildDeck: function(matchQty){
    // generates matching lists for decks 1 & 2 and replaces it in the deck variables
    //look at code from high card project for generating cards in a deck
    //ultimately will need to accept an argument for how many cards to generate in the deck to incorporate flexible methodology
    for (var i =1; i<= matchQty; i++) {
      this.deck1.push(i);
      this.deck2.push(i);
    }
  },
  combineDeck: function(){
    // Combines decks into a deck to be shuffled
    for (var card1 in this.deck1) {
      this.shuffleDeck.push(card1);
    }
    for (var card2 in this.deck2) {
      this.shuffleDeck.push(card2);
    }
  },
  shuffle: function(){
    // shuffles the deck and replaces the order in the deck variables
    // look at code from high card project
    // assigns values from shuffled deck list to cards
    // Fisher-Yates (aka Knuth) Shuffle thanks to stackoverflow
    var currentIndex = this.shuffleDeck.length;
    var temporaryValue;
    var randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = this.shuffleDeck[currentIndex];
      this.shuffleDeck[currentIndex] = this.shuffleDeck[randomIndex];
      this.shuffleDeck[randomIndex] = temporaryValue;
    }
    // console.log(this.shuffleDeck);
  },
  eventHandler: function() {
    //accepts the mouseclick and adds an attirbute to the HTML box classes to be selected later
    for(var i = 0; i < this.cardSelector.length; i++){
      this.cardSelector[i].setAttribute("data-index",i);
      this.cardSelector[i].addEventListener("click", this.mouseClick);
    }
  },
  mouseClick: function() {
    //function to be passed into event listener
    // pushes the clicks into the 'exposed' list to be evaluated for matches
    //swaps in number into HTML of specific box element
    //increments clicks to initiate the match checker function
    memory.exposed.push({
      attr: this.getAttribute("data-index"),
      num: memory.shuffleDeck[this.getAttribute("data-index")]
    });
    this.textContent = memory.shuffleDeck[this.getAttribute("data-index")];
    clicks++;
    if (clicks%3===0) {
      memory.matchChecker();
      memory.turnsIncrementer();
    }
  },
  matchChecker: function () {
    // game handler. Tells the cards to remain flipped if they are successfully matched
    // checks if clicked cards are a match and flips them back over if not
    // also increments turn counter
    //get no-repeat clicks working
    //smelly code - break into more functions
    //put in timer function
    //remove event listener after clikc
    if(memory.exposed.length < memory.shuffleDeck.length) {
      clicks = 1;
      var card1 = memory.exposed[memory.exposed.length - 3]
      var card2 = memory.exposed[memory.exposed.length - 2]
      if ( card1.num === card2.num && card1.attr != card2.attr) {
          // console.log("match!");
          this.correctMatch();
        } else {
          this.notAMatch(card1,card2);
        }
      }
      this.gameEnd()
  },
  correctMatch: function(){
    var card1 = memory.cardSelector[memory.exposed[memory.exposed.length - 2].attr];
    var card2 = memory.cardSelector[memory.exposed[memory.exposed.length - 3].attr];
    this.makeTransparent(card1,card2);
  },
  notAMatch: function(card1,card2) {
    memory.cardSelector[card1.attr].innerHTML="";
    memory.cardSelector[card2.attr].innerHTML="";
    memory.exposed.shift();
    memory.exposed.shift();
  },
  turnsIncrementer: function () {
    turns++;
    document.querySelector(".turns").textContent = ("Turns: " + turns);
  },
  makeTransparent: function(card1,card2){
    card1.style.backgroundColor = 'transparent';
    card1.style.color = 'transparent';
    card1.style.textShadow = 'none';
    card2.style.backgroundColor = 'transparent';
    card2.style.color = 'transparent';
    card2.style.textShadow = 'none';
  },
  gameEnd: function () {
    if (memory.exposed.length === 17) {
      this.correctMatch();
      document.querySelector('.container').style.backgroundImage = "url(http://i.imgur.com/Vp9Q38k.gif)";
    }
  },
  runMemory: function(){
    // initializes game
    // can be called to rerun the game and reset the timers/counters
    this.buildDeck(8);
    this.combineDeck();
    this.shuffle();
    this.eventHandler();
  }
};

memory.runMemory();
