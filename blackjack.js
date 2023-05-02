const cardValues = {
    'A': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10
  };
  
  let deck = [];
  let dealerCards = [];
  let playerCards = [];
  let splitCards = [];
  
  let dealerScore = 0;
  let playerScore = 0;
  let splitScore = 0;
  
  let gameStarted = false;
  let gameOver = false;
  let playerWon = false;
  
  const dealButton = document.getElementById('deal-button');
  dealButton.addEventListener('click', () => {
    if (gameStarted) {
      return;
    }
    
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    
    deck = createDeck();
    shuffleDeck(deck);
    
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];
    
    updateScores();
    renderDealerCards();
    renderPlayerCards();
    
    checkForEndOfGame();
  });
  
  const hitButton = document.getElementById('hit-button');
  hitButton.addEventListener('click', () => {
    if (gameOver) {
      return;
    }
    
    if (splitCards.length > 0) {
      splitCards.push(getNextCard());
      updateScores();
      renderSplitCards();
      
      if (splitScore > 21) {
        finishSplitHand();
      }
    } else {
      playerCards.push(getNextCard());
      updateScores();
      renderPlayerCards();
      
      if (playerScore > 21) {
        checkForSplitHand();
        checkForEndOfGame();
      }
    }
  });
  
  const standButton = document.getElementById('stand-button');
  standButton.addEventListener('click', () => {
    if (gameOver) {
      return;
    }
    
    if (splitCards.length > 0) {
      finishSplitHand();
    } else {
      while (dealerScore < 17) {
        dealerCards.push(getNextCard());
        updateScores();
        renderDealerCards();
      }
      
      gameOver = true;
      checkForEndOfGame();
    }
  });
  
  const splitButton = document.getElementById('split-button');
  splitButton.addEventListener('click', () => {
    if (gameStarted && playerCards.length === 2 && playerCards[0].value === playerCards[1].value) {
      splitCards = [playerCards.pop()];
      playerCards.push(getNextCard());
      splitCards.push(getNextCard());
      
      updateScores();
      renderPlayerCards();
      renderSplitCards();
    }
  });
  
  function createDeck() {
    const deck = [];
    
    for (let value in cardValues) {
      for (let suit of ['♠', '♣', '♥', '♦']) {
        deck.push({value, suit});
      }
    }
    
    return deck;
  }
  
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  
  function getNextCard() {
    return deck.shift();
  }
  
  function getCardString(card) {
    return card.value + card.suit;
  }
  
  function getScore(cards) {
    let score = 0;
    let hasAce = false;
    
    for (let card of cards) {
      score += cardValues[card.value];
      if (card.value === 'A') {
        hasAce = true;
      }
    }
    
    if (hasAce && score > 21) {
      score -= 10;
    }
    
    return score;
  }