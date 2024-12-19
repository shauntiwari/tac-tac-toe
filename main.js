// Setup gameBoard object with game array as an IIFE, since there's only one
const gameBoard = (function() {
    
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function currentState() {
        // returns a deep copy instead of the reference to board so I can see current status of board even if it will be changed later
        return JSON.parse(JSON.stringify(board));
    }

    function placeMarker(row, column, marker) {
        if (ifEmpty(row, column)) {
            board[row][column] = marker;
            return true;
        } else {
            return false; //failed to place marker, try again
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

    function printBoard() {
        const currentBoard = board;
        console.log('\nCurrent board:');
        for(let row = 0; row < 3; row++) {
            console.log(currentBoard[row].join(' | '));
            if(row < 2) console.log('---------');
        }
        console.log('\n');
    }

    //make methods available publicly
    return {
        currentState,
        placeMarker,
        ifEmpty,
        resetBoard,
        printBoard
    };

})();

// Setup player object factory function
const player = function(name, marker) {
    
    function getName() {
        return name;
    }

    function getMarker() {
        return marker;
    }

    function makeMove(row, column) {
        return gameBoard.placeMarker(row, column, marker);
    }
    
    return {getName, getMarker, makeMove};

};

// Setup Game Flow object as IIFE since there's only one
const gameFlow = (function() {
    const playerOne = player("Player One", "X");
    const playerTwo = player("Player Two", "O");
    let activePlayer = playerOne;

    function takeTurn() {
        console.log(activePlayer.getName() + " it is your turn!");
        let validMove = false;

        while (!validMove) {
            let row = prompt("Enter the row (0 - 2)");
            let column = prompt("Enter the column (0 - 2)");
            validMove = activePlayer.makeMove(row, column);

            if(!validMove) {
                console.log("That position is already taken! Try again!");
            }
        }
        
        gameBoard.printBoard();
        gameDisplay.displayBoard();
    }

    function checkWin() {
        const board = gameBoard.currentState();
        
        for (let condition of winConditions) {
            const [[a,b], [c,d], [e,f]] = condition;
            
            const posOne = board[a][b];
            const posTwo = board[c][d];
            const posThree = board[e][f];
            
            if (posOne !== '' && posOne === posTwo && posOne === posThree) {
                return true; // winner found
            }
        }
        return false; // no winner found, continue the game
    }

    function checkTie() {
        const board = gameBoard.currentState();
        
        // Check if all positions are filled (no empty strings)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    return false;  // Found an empty space, so not a tie
                }
            }
        }
        return true;  // All spaces filled and no winner = tie
    }

    function switchPlayer() {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    }

    function playGame() {
        let gameOver = false;
        
        while (!gameOver) {
            takeTurn();

            if (checkTie()) {
                console.log("Tie game!");
                gameOver = true;
            } else if (checkWin()) {
                 console.log(activePlayer.getName() + " wins!");
                 gameOver = true;
            } else {
                switchPlayer();
            }
        }     
    }

    const winConditions = [
        // Rows (horizontal wins)
        [[0,0], [0,1], [0,2]], // Top row
        [[1,0], [1,1], [1,2]], // Middle row
        [[2,0], [2,1], [2,2]], // Bottom row
        
        // Columns (vertical wins)
        [[0,0], [1,0], [2,0]], // Left column
        [[0,1], [1,1], [2,1]], // Middle column
        [[0,2], [1,2], [2,2]], // Right column
        
        // Diagonals
        [[0,0], [1,1], [2,2]], // Top-left to bottom-right
        [[0,2], [1,1], [2,0]]  // Top-right to bottom-left
    ];

    return {playGame}; // Return an object containing publicly available function
})();


// Setup Game Display object as IIFE since there's only one
const gameDisplay = (function() {

    // function to display the board on the webpage
    function displayBoard() {
        
        //remove existing grid if there is one
        const container = document.getElementById("container");
        const existingGrid = document.getElementById("grid");
        if (existingGrid) {
            container.removeChild(existingGrid);
        }
        
        //create new grid
        const grid = document.createElement("div");
        grid.id = 'grid';

        //set grid display elements to their corresponding board items
        const grid00 = document.createElement("div")
        grid00.innerHTML = gameBoard.currentState()[0][0];
        const grid01 = document.createElement("div")
        grid01.innerHTML = gameBoard.currentState()[0][1];
        const grid02 = document.createElement("div")
        grid02.innerHTML = gameBoard.currentState()[0][2];
        const grid10 = document.createElement("div")
        grid10.innerHTML = gameBoard.currentState()[1][0];
        const grid11 = document.createElement("div")
        grid11.innerHTML = gameBoard.currentState()[1][1];
        const grid12 = document.createElement("div")
        grid12.innerHTML = gameBoard.currentState()[1][2];
        const grid20 = document.createElement("div")
        grid20.innerHTML = gameBoard.currentState()[2][0];
        const grid21 = document.createElement("div")
        grid21.innerHTML = gameBoard.currentState()[2][1];
        const grid22 = document.createElement("div")
        grid22.innerHTML = gameBoard.currentState()[2][2];
        
        grid.appendChild(grid00);
        grid.appendChild(grid01);
        grid.appendChild(grid02);
        grid.appendChild(grid10);
        grid.appendChild(grid11);
        grid.appendChild(grid12);
        grid.appendChild(grid20);
        grid.appendChild(grid21);
        grid.appendChild(grid22);
        
        container.appendChild(grid);
    }

    return {displayBoard};

})();

gameFlow.playGame();