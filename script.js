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
        const first = board.slice(0,3);   // 0, 1, 2
        const second = board.slice(3,6);  // 3, 4, 5
        const third = board.slice(6,9);   // 6, 7, 8
        
        return { first, second, third }
    };
    
    const getCols = function() {
        const col = (arr, start) => 
            arr.filter((elem, index) => index % 3 === start);
        
        const first = col(board, 0);   // 0, 3, 6
        const second = col(board, 1);  // 1, 4, 7
        const third = col(board, 2);  // 2, 5, 8
        
        return { first, second, third }
    };
    
    const getDiagonals = function() {
        const firstDiagIndices = [0, 4, 8];
        const secondDiagIndices = [2, 4, 6];
        
        const first = firstDiagIndices.map(index => board[index]); // 0, 4, 8
        const second = secondDiagIndices.map(index => board[index]); // 2, 4, 6
        
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
            
            board.splice(index, 1, marker);
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
        
        // let winnerIsX = []
        // let winnerIsO = []
        
        // // Check if X is winner
        // for (const [track, countX] of Object.entries(markerCountX)) {
        //     if (countX.includes(3)) {
        //         winnerIsX.push(true)
        //     }
        // }
        
        // // Check if O is winner
        // for (const [track, countO] of Object.entries(markerCountO)) {
        //     if (countO.includes(3)) {
        //         winnerIsO.push(true)
        //     }
        // }
        
        // if (winnerIsX.includes(true)) {
        //     console.log("The winner is X")
        // } else if (winnerIsO.includes(true)) {
        //     console.log("The winner is O")
        // } 

        if (hasThree(markerCountX)) console.log("The winner is X");
        else if (hasThree(markerCountO)) console.log("The winner is O")
    };
    
    return { checkWinner }
    
})();

function createPlayer(marker) {
    
}