const GameBoard = (function() {
    const VALID_MARKERS = ["X", "O"];
    let board = [];

    const init = function() {
        board = ['', '', '', '', '', '', '', '', ''];
    }

    const getBoard = () => board;

    const WIN_COMBOS = [
        [0,1,2], [3,4,5], [6,7,8],  // rows
        [0,3,6], [1,4,7], [2,5,8],  // columns
        [0,4,8], [2,4,6]            // diagnoals
    ]
    
    const placeMarker = function(marker, index) {
        if (!VALID_MARKERS.includes(marker)) {
            throw Error("You can only play with 'X' and 'O' markers.");
        }
        
        if (index > 8) {
            throw Error(
                `Cannot place marker on board as the index is out of bounds. 
                You tried to insert at index ${index}, but the maximum index is 8.`);
            }
            
            board[index] = marker;
     };
    
    return { init, getBoard, placeMarker, WIN_COMBOS }
    
})();
        
const GameController = (function() {
    let _hasStarted = false;
    const hasStarted = () => _hasStarted;

    let round = 0;
    let activePlayer = {};
    const getActivePlayer = () => activePlayer;
    let players = [];

    const init = function(player1Name, player2Name) {
        players = createPlayers(player1Name, player2Name);
        activePlayer = players[0];
        _hasStarted = true;
        round = 0;

        GameBoard.init();
        DisplayController.init();
    }

    function createPlayers(player1Name, player2Name) {
        const player1 = { name: player1Name, marker: "X" };
        const player2 = { name: player2Name, marker: "O" };
        return [player1, player2];
    }

    const switchPlayerTurn = () => activePlayer = (activePlayer === players[0] ? players[1] : players[0]);

    const playRound = function(markerInsertIndex) {
        if (GameBoard.getBoard()[markerInsertIndex] === '') {
            GameBoard.placeMarker(activePlayer.marker, markerInsertIndex);
            round += 1;
        } else {
            alert('That spot is already taken. Please choose a different spot.')
            return;
        }

        const winner = getWinner();

        if (round > 8 && winner === null) {
            alert("The game ended in a tie.");
            return;
        }

        if (winner !== null) {
            alert(`The winner is ${winner.name}!`);
            return;
        }

        switchPlayerTurn();
    }

    // Player wins when they mark all three spaces of a row, column or diagonal of the grid
    const getWinner = function() {
        const winCombos = GameBoard.WIN_COMBOS
        console.log(`winCombos = ${winCombos}`)

        // Check if for ANY of the wincombos, ALL board cells of these indices contain the activePlayer's marker 
        const winnerExists = winCombos.some(combo => {
            const board = GameBoard.getBoard();
            const winner = combo.every(index => board[index] === activePlayer.marker);
            return winner;
        });

        if (winnerExists) {
            return activePlayer;
        } else {
            return null
        }
    };

    return { init, playRound, getActivePlayer, hasStarted }
    
})();

const DisplayController = (function() {
    const game = GameController;
    const playerTurn = document.querySelector('.turn')
    const boardDiv = document.querySelector('.board');
    const startRestartButton = document.querySelector('.start-restart');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');

    const init = function() {
        updateScreen();
    }

    const updateScreen = function() {
        startRestartButton.textContent = game.hasStarted() ? "Restart" : "Start game";

        // Clear board before updating with most recent state
        boardDiv.textContent = ''

        // Get state
        const board = GameBoard.getBoard();
        const activePlayer = GameController.getActivePlayer();

        // Display player turn on screen
        playerTurn.textContent = `It's ${activePlayer.name}'s turn.`;

        // Render board cells
        board.forEach((value, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell")
            cellButton.dataset.index = index;
            cellButton.dataset.marker = value;
            cellButton.textContent = value;
            boardDiv.appendChild(cellButton);
        });
    };

    // Listen for click events
    function boardClickHandler(event) {
        const selectedCellIndex = Number(event.target.dataset.index);
        game.playRound(selectedCellIndex);
        updateScreen();
    }

    boardDiv.addEventListener("click", boardClickHandler);

    function startButtonClickHandler(event) {
        const player1Name = player1Input.value;
        const player2Name = player2Input.value;
        GameController.init(player1Name, player2Name);
    }

    startRestartButton.addEventListener("click", startButtonClickHandler);

    return { init }
})();

