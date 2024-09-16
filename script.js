const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const scoreboardBody = document.getElementById('scoreboard-body');
const congratulations = document.createElement('div');
congratulations.className = 'congratulations';
document.body.appendChild(congratulations);

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let round = 0;
let scores = { X: 0, O: 0, Draw: 0 };

const checkWin = () => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (const [a, b, c] of winPatterns) {
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    return gameBoard.includes('') ? null : 'Draw';
};

const showNotification = (message) => {
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    notification.style.top = '10px';
    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = 1;
            notification.style.top = '-50px';
        }, 500);
    }, 3000);
};

const updateScoreboard = (winner) => {
    if (round < 10) {
        round++;
        scores[winner]++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${round}</td>
            <td>${winner === 'Draw' ? 'Draw' : winner}</td>
        `;
        scoreboardBody.appendChild(row);
    }

    if (round === 10) {
        setTimeout(() => {
            const highScore = scores.X > scores.O ? 'X' : scores.O > scores.X ? 'O' : 'No one';
            const message = scores.X === scores.O ? 'It\'s a draw for the game!' : `Congratulations ${highScore} for winning the game!`;
            showCongratulations(message);
        }, 100);
    }
};

const showCongratulations = (message) => {
    congratulations.textContent = message;
    congratulations.style.display = 'block';
    setTimeout(() => {
        congratulations.style.opacity = 0;
        setTimeout(() => {
            congratulations.style.display = 'none';
            congratulations.style.opacity = 1;
        }, 500);
    }, 3000); // Show for 3 seconds
};

const handleClick = (index) => {
    if (gameBoard[index] || checkWin()) return;
    
    gameBoard[index] = currentPlayer;
    document.querySelector(`.cell[data-index="${index}"]`).textContent = currentPlayer;

    const result = checkWin();
    if (result) {
        setTimeout(() => {
            showNotification(result === 'Draw' ? 'It\'s a draw!' : `${result} wins!`);
            updateScoreboard(result === 'Draw' ? 'Draw' : result);
            if (round < 10) {
                setTimeout(createBoard, 1000); // Automatically reset the board after a delay
            }
        }, 100);
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const createBoard = () => {
    board.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
    }
};

const resetAll = () => {
    round = 0;
    scores = { X: 0, O: 0, Draw: 0 };
    scoreboardBody.innerHTML = ''; // Clear the scoreboard
    createBoard();
};

resetButton.addEventListener('click', resetAll);

createBoard();
