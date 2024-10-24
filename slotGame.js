// General Steps for the game
// 1. user deposits some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot
// 5. check if user won or not
// 6. give their winning and subtract the bet * lines from their balance
// 7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
}

const SYMBOL_VALUES = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2
}



// step 1 - Collecting deposit from the user

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter your deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again");
    } else {
      return numberDepositAmount;
    }
  }
};

//Step 2 - Determine number of lines to bet on
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines , try again");
    } else {
      return numberOfLines;
    }
  }
};

//Step 3 - Collect a bet amount
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter bet amount per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet < 0 || numberBet > balance / lines) {
      console.log("Invalid bet, Try again");
    } else {
      return numberBet;
    }
    
  }
};

//Step 4. Spin the slot
const spin = () => {
  const symbols = [];
  // generating an array with all elements we can pick from when we randomly choose an element for each reel
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++){
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++){
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++){
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
}

//Step - 5. check if user won or not
//transpose the generated reels or columns to get a matrix of rows to check which row won
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++){
    rows.push([]);
    for (let j = 0; j < COLS; j++){
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
}

//printing the slot in better way(helper function to convert all of our columns to rows of corresponding index)
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
   console.log(rowString);
  }
}

// chech if the user won or not, if a user bet on 1 line we check the 1st line,and if 2 we check the 1st 2 lines and if 3 we chechk all 3 lines
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
}

//Step 6 & 7. give their winning orsubtract the bet amount * number of lines and then ask if they want to play again
const game = () => {
  let balance = deposit();
  while (true) {
    console.log("Your current balance is $" + balance)
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    // console.log(reels);
    // console.log(rows);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("Insuficient balance");
      break;
    }

    const playAgain = prompt("Do You Want to play again? (y/n) ");
    if (playAgain != "y") break;
  }
}

game();
