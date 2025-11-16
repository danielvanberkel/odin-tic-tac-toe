// only need 1 instance? wrap in IIFE so that it cannot be reused

const GameBoard = (function() {
    let board = ['', '', '', '', '', '', '', '', ''];
    
    const fillWithDummyData = function() {
        board = ['', '', '', '', '', '', '', '', ''];
        const options = ["X", "O"];
        
        for (let i = 0; i < 9; i++) {
            const randomIndex = Math.floor(Math.random() * options.length);
            const randomMarker = options[randomIndex];
            placeMarker(randomMarker, i)
        }
    }
    
    const getBoard = function() {
        return board;
    };
    
    const logBoard = function() {
        let result = ''
        
        board.forEach((marker, index) => {
            result += `[${marker}]`;
            if ((index + 1) % 3 === 0) result += '\n';
        });
        
        console.log(result);
    };
    
    const getRows = function() {
        const first = [board[0], board[1], board[2]];
        const second = [board[3], board[4], board[5]];
        const third = [board[6], board[7], board[8]];
        
        return { first, second, third }
    };
    
    const getCols = function() {
        const first = [board[0], board[3], board[6]];
        const second = [board[1], board[4], board[7]];
        const third = [board[2], board[5], board[8]];
        
        return { first, second, third }
    };
    
    const getDiagonals = function() {
        const first = [board[0], board[4], board[8]];
        const second = [board[2], board[4], board[6]];
        
        return { first, second } 
    };
    
    const placeMarker = function(marker, index) {
        if (marker !== "X" && marker !== "O") {
            throw Error("You can only play with 'X' and 'O' markers.");
        }
        
        if (index > 8) {
            throw Error(
                `Cannot place marker on board as the index is out of bounds. 
                You tried to insert at index ${index}, but the max is 8.`);
            }
            
            board[index] = marker;
            logBoard();
            Game.checkWinner();
    };
        
    const getMarkerCount = function(marker) {
        if (marker !== "X" && marker !== "O") {
            throw Error("You can only play with 'X' and 'O' markers.");
        }
        
        const rows = getRows();
        const cols = getCols();
        const diags = getDiagonals();
        
        const countAll = obj => 
            Object.values(obj).map(track => countOccurences(track, marker));

        const countInRows = countAll(getRows());
        const countInCols = countAll(getCols());
        const countInDiags = countAll(getDiagonals());
        
        return { countInRows, countInCols, countInDiags }
        
    };

    function countOccurences(array, searchValue) {
        return array.reduce(
            (accumulator, currentValue) => (currentValue === searchValue ? accumulator + 1 : accumulator), 0);
    }
    
    return { fillWithDummyData, getBoard, logBoard, getRows, getCols, getDiagonals, placeMarker, getMarkerCount }
    
})();
        
const Game = (function() {
    // Player wins when they mark all three spaces of a row, column or diagonal of the grid
    const checkWinner = function() {
        const markerCountX = GameBoard.getMarkerCount("X");
        const markerCountO = GameBoard.getMarkerCount("O");

        const hasThree = markerCounts => 
            Object.values(markerCounts).some(track => track.includes(3));

        if (hasThree(markerCountX)) console.log("The winner is X");
        else if (hasThree(markerCountO)) console.log("The winner is O")
    };
    
    return { checkWinner }
    
})();

function createPlayer(marker) {
    
}