// Setup gameBoard object with game array as an IIFE, since there's only one
const gameBoard = (function() {
    
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function currentState() {
        // This creates a deep copy instead of passing the reference to board
        return JSON.parse(JSON.stringify(board));
    }

    function placeMarker(row, column, marker) {
        console.log(`Attempting to place ${marker} at row ${row}, column ${column}`);
        console.log(`Is position empty? ${ifEmpty(row, column)}`);
        if (ifEmpty(row, column)) {
            board[row][column] = marker;
            console.log(`After placement: ${board[row][column]}`);
        }
    }

    function ifEmpty(row, column) {
        return board[row][column] === "" ? true : false;
    }

    function resetBoard() {
        for(let row = 0; row < 3; row++) {
            for(let column = 0; column < 3; column++) {
                board[row][column] = "";
            }
        }
    }

    //make methods available publicly
    return {
        currentState,
        placeMarker,
        ifEmpty,
        resetBoard
    };

})();

// Testing Gameboard functionality
console.log("Initial board state:");
console.log(gameBoard.currentState());
console.log("\nPlacing X at position (0,0):");
gameBoard.placeMarker(0,0,"X");
console.log("Board state after placing X:");
console.log(gameBoard.currentState());
console.log("\nResetting board:");
gameBoard.resetBoard();
console.log("Board state after reset:");
console.log(gameBoard.currentState());

// Setup Player object - Player 1 has X and Player 2 has O

// const players = (function() {

// })();


// Setup Game Flow object as IIFE since there's only one