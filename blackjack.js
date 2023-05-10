// Declaring all variables
var dealerSum = 0;
var player1Sum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

//allows the player to draw while yourSum <= 21
var canHit = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

// Function for creating a deck /A-C -> K-C, A-D -> K-D
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
    // console.log(deck);
}

// Function for shuffling the deck  / (0-1) * 52 => (0-51.999999)
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
// Main Function for playing the Game
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
// creating the image tag and implementing the dealer and player1 sums with the img 
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        player1Sum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("player1-cards").append(cardImg);
    }

    console.log(player1Sum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

// Function for the hit button to create new cards
function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    player1Sum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("player1-cards").append(cardImg);

    if (reduceAce(player1Sum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

// Function for the stay button to end the game and not allow the player to continue to hit
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    player1Sum = reduceAce(player1Sum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
// Outcome Messages
    let message = "";
    if (player1Sum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21 
    else if (player1Sum == dealerSum) {
        message = "Tie!";
    }
    else if (player1Sum > dealerSum) {
        message = "You Win!";
    }
    else if (player1Sum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player1-sum").innerText = player1Sum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}