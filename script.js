// Define game settings
const GRID_SIZE = 9;
const NUM_MINES = 10;

// Initialize game board
let board = [];
for (let i = 0; i < GRID_SIZE; i++) {
    board.push([]);
    for (let j = 0; j < GRID_SIZE; j++) {
        board[i].push({
            x: i,
            y: j,
            isMine: false,
            revealed: false,
            flagged: false,
            numNeighboringMines: 0
        });
    }
}

// Place mines randomly
let numMinesPlaced = 0;
while (numMinesPlaced < NUM_MINES) {
    let x = Math.floor(Math.random() * GRID_SIZE);
    let y = Math.floor(Math.random() * GRID_SIZE);
    if (!board[x][y].isMine) {
        board[x][y].isMine = true;
        numMinesPlaced++;
    }
}

// Calculate number of neighboring mines for each cell
for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        if (!board[i][j].isMine) {
            let numNeighboringMines = 0;
            for (let x = Math.max(0, i - 1); x <= Math.min(GRID_SIZE - 1, i + 1); x++) {
                for (let y = Math.max(0, j - 1); y <= Math.min(GRID_SIZE - 1, j + 1); y++) {
                    if (board[x][y].isMine) {
                        numNeighboringMines++;
                    }
                }
            }
            board[i][j].numNeighboringMines = numNeighboringMines;
        }
    }
}

// Render game board
const container = document.querySelector('.game-container');
for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-x', i);
        cell.setAttribute('data-y', j);
        container.appendChild(cell);
    }
}

// Add event listeners to cells
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
    cell.addEventListener('contextmenu', handleRightClick);
});

// Handle left click
function handleClick(e) {
    const x = parseInt(e.target.getAttribute('data-x'));
    const y = parseInt(e.target.getAttribute('data-y'));
    revealCell(x, y);
}

// Handle right click
function handleRightClick(e) {
    e.preventDefault();
    const x = parseInt(e.target.getAttribute('data-x'));
    const y = parseInt(e.target.getAttribute('data-y'));
    toggleFlag(x, y);
}

// Reveal cell
function revealCell(x, y) {
    if (board[x][y].revealed || board[x][y].flagged) {
        return;
    }
    board[x][y].revealed = true;
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('revealed');
    if (board[x][y].isMine) {
        cell.classList.add('mine');
        alert('Game over!');
    } else {
        cell.innerHTML = board[x][y].numNeighboringMines;
        if (board[x][y].numNeighboringMines === 0) {
            for (let i = Math.max(0, x - 1); i <= Math.min(GRID_SIZE - 1, x + 1); i++) {
                for (let j = Math.max(0, y - 1); j <= Math.min(GRID_SIZE - 1, y + 1); j++) {
                    revealCell(i, j);
                }
            }
        }
    }
}

// Toggle flag
function toggleFlag(x, y) {
    if (board[x][y].revealed) {
        return;
    }
    board[x][y].flagged = !board[x][y].flagged;
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.classList.toggle('flagged');
}

// Reset game
function resetGame() {
    location.reload();
}

// Add event listener to reset button
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetGame);

// Add event listener to game container
container.addEventListener('contextmenu', e => {
    e.preventDefault();
}
);