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

    //make methods available publicly
    return {
        currentState,
        placeMarker,
        ifEmpty,
        resetBoard,
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

// Setup Game Flow object as IIFE since there's only one, manages game state & logic
const gameFlow = (function() {
    const playerOne = player("Player One", "X");
    const playerTwo = player("Player Two", "O");
    let activePlayer = playerOne;
    let gameOver = false;

    function handlePlayerMove(row, col) {
        if (gameOver) return;

        if (activePlayer.makeMove(row, col)) {
            gameDisplay.displayBoard();
            
            if (checkWin()) {
                gameDisplay.updateStatus(`${activePlayer.getName()} wins!`);
                gameOver = true;
            } else if (checkTie()) {
                gameDisplay.updateStatus("Tie game!");
                gameOver = true;
            } else {
                switchPlayer();
                gameDisplay.updateStatus(`${activePlayer.getName()}'s turn, click to place an ${activePlayer.getMarker()}`);
            }
        }
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

    function resetGame() {
        gameBoard.resetBoard();
        gameOver = false;
        activePlayer = playerOne;
        gameDisplay.displayBoard();
        gameDisplay.updateStatus(`${activePlayer.getName()}'s turn`);
    }

    function playGame() {
        gameOver = false;
        gameDisplay.displayBoard();
        gameDisplay.updateStatus(`${activePlayer.getName()}'s turn, click to place an ${activePlayer.getMarker()}`);
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

    return {playGame, handlePlayerMove, resetGame}; // Return an object containing publicly available function
})();


// Setup Game Display object as IIFE since there's only one, handles UI updates and user interaction
const gameDisplay = (function() {

    function displayBoard() {
        const container = document.getElementById("container");

        //clear any existing grid
        const existingGrid = document.getElementById("grid");
        if (existingGrid) {
            container.removeChild(existingGrid);
        }
        
        //create new grid
        const grid = document.createElement("div");
        grid.id = 'grid';

        //create cells and add click handlers in grid
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.innerHTML = gameBoard.currentState()[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleClick);
                grid.appendChild(cell);
            }
        }

        container.appendChild(grid);
    }

    function handleClick(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        gameFlow.handlePlayerMove(row, col);
    }

    function updateStatus(message) {
        const status = document.getElementById("status");
        status.textContent = message;
    }

    // Event listener for reset button
    document.getElementById('reset-button').addEventListener('click', gameFlow.resetGame);

    return {displayBoard, updateStatus};

})();

gameFlow.playGame();