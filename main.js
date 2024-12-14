// Setup Gameboard object with game array as IIFE since there's only one
const gameBoard = (function() {
    
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function currentState() {
        return board;
    }

    function placeMarker(row, column, marker) {
        if (ifEmpty(row, column)) {
            board[row - 1][column - 1] = marker;
        }
    }

    function ifEmpty(row, column) {
        return board[row - 1][column - 1] === "" ? true : false;
    }

    function resetBoard() {
        for(let row = 1; row < 4; row++) {
            for(let column = 1; column < 4; column++) {
                board[row - 1][column - 1] = "";
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
console.log(gameBoard.currentState());
gameBoard.placeMarker(3,2,"X");
console.log(gameBoard.currentState());

// Setup Player object - Player 1 has X and Player 2 has O

// const players = (function() {

// })();


// Setup Game Flow object as IIFE since there's only one