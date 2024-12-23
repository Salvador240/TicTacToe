// Initialize game state variables
let currentPlayer = 'X';
let playerXSelections = [];
let playerOSelections = [];

// Define winning combinations
const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

// Load sound effects
const clickSound = new Audio('click.mp3');
const winSound = new Audio('win.mp3');

// Handle cell click event
const handleClick = function (event) {
    const cell = event.target;
    if (cell.innerHTML !== '') return; // Prevent overwriting moves

    cell.innerHTML = currentPlayer; // Mark the cell with the current player's symbol
    cell.classList.add('clicked'); // Add animation class
    clickSound.play(); // Play click sound

    const playerSelections = currentPlayer === 'X' ? playerXSelections : playerOSelections;
    playerSelections.push(Number(cell.id)); // Record the player's selection

    if (checkWinner(playerSelections)) {
        document.getElementById('message').innerHTML = `Player ${currentPlayer} wins!`; // Display win message
        highlightWinningCombination(playerSelections); // Highlight the winning combination
        drawWinningLine(playerSelections); // Draw the winning line
        winSound.play(); // Play win sound
        disableBoard(); // Disable further moves
    } else if (playerXSelections.length + playerOSelections.length === 9) {
        document.getElementById('message').innerHTML = 'It\'s a draw!'; // Display draw message
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        document.getElementById('message').innerHTML = `Player ${currentPlayer}'s turn`; // Display current player's turn
    }
}

// Check if the current player has won
const checkWinner = function (playerSelections) {
    return winningCombinations.some(combination => 
        combination.every(number => playerSelections.includes(number))
    );
}

// Highlight the winning combination
const highlightWinningCombination = function (playerSelections) {
    winningCombinations.forEach(combination => {
        if (combination.every(number => playerSelections.includes(number))) {
            combination.forEach(number => {
                document.getElementById(number).style.backgroundColor = 'lightgreen';
            });
        }
    });
}

// Draw the winning line
const drawWinningLine = function (playerSelections) {
    const winningCombination = winningCombinations.find(combination => 
        combination.every(number => playerSelections.includes(number))
    );

    if (winningCombination) {
        const line = document.getElementById('winning-line');
        const [start, , end] = winningCombination;
        const startCell = document.getElementById(start);
        const endCell = document.getElementById(end);

        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        const tableRect = document.querySelector('table').getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2 - tableRect.left;
        const y1 = startRect.top + startRect.height / 2 - tableRect.top;
        const x2 = endRect.left + endRect.width / 2 - tableRect.left;
        const y2 = endRect.top + endRect.height / 2 - tableRect.top;

        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top = `${(y1 + y2) / 2}px`;
        line.style.left = `${(x1 + x2) / 2 - length / 2}px`;
        line.style.display = 'block';
    }
}

// Disable further moves on the board
const disableBoard = function () {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

// Reset the game to its initial state
const resetGame = function () {
    currentPlayer = 'X';
    playerXSelections = [];
    playerOSelections = [];
    document.getElementById('message').innerHTML = `Player ${currentPlayer}'s turn`;
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.backgroundColor = '';
        cell.classList.remove('clicked');
        cell.addEventListener('click', handleClick);
    });
    document.getElementById('winning-line').style.display = 'none';
}

// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', resetGame);

// Add event listeners to all cells
const cells = document.querySelectorAll('td');
cells.forEach(cell => cell.addEventListener('click', handleClick));

// Display the initial message
document.getElementById('message').innerHTML = `Player ${currentPlayer}'s turn`;