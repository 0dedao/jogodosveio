// Elementos do DOM
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');
const winnerAnnouncement = document.getElementById('winner-announcement');
const winnerPhrase = document.getElementById('winner-phrase');
const soundL = document.getElementById('sound-l');
const soundPistol = document.getElementById('sound-pistol');
const soundDraw = document.getElementById('sound-draw');

// Jogadores
const PLAYER_L = 'L';
const PLAYER_PISTOL = '🔫';

// Estado do jogo
let currentPlayer = PLAYER_L;
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = {
    'L': 0,
    '🔫': 0,
    'draw': 0
};

// Combinações vencedoras
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function setBackground(image) {
    document.body.style.backgroundImage = `url('${image}')`;
}

function showWinnerPhrase(text, className) {
    winnerPhrase.textContent = text;
    winnerPhrase.className = 'winner-phrase ' + className;
    setTimeout(() => winnerPhrase.classList.add('show'), 100);
}

function showDraw() {
    setBackground('lula bolsonaro.jpg');
    showWinnerPhrase('Paz e Amor', 'draw');
    soundDraw.play();

    // Confete branco
    const duration = setInterval(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffffff']
        });
    }, 200);

    setTimeout(() => clearInterval(duration), 2000);
}

// Funções do jogo
function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameState[index] !== '' || !gameActive) return;

    // Fazer jogada
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Verificar vitória
    if (checkWin()) {
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();
        showWinner();
        return;
    }

    // Verificar empate
    if (gameState.every(cell => cell !== '')) {
        gameActive = false;
        scores.draw++;
        updateScores();
        message.textContent = 'Empate!';
        showDraw();
        return;
    }

    // Próximo jogador
    currentPlayer = currentPlayer === PLAYER_L ? PLAYER_PISTOL : PLAYER_L;
    message.textContent = `Vez do jogador ${currentPlayer}`;
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState[index] === currentPlayer);
    });
}

function showWinner() {
    message.textContent = `Jogador ${currentPlayer} venceu!`;
    
    if (currentPlayer === PLAYER_L) {
        // Efeitos para vitória do L
        setBackground('lula.jpg');
        showWinnerPhrase('Faz o L', 'l-wins');
        soundL.play();

        // Estrelas vermelhas
        const duration = setInterval(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                shapes: ['star'],
                colors: ['#ff0000', '#cc0000']
            });
        }, 200);

        setTimeout(() => clearInterval(duration), 2000);
    } else {
        // Efeitos para vitória da pistola
        setBackground('bolsonaro.jpg');
        showWinnerPhrase('ACABOU PORRA', 'pistol-wins');
        soundPistol.play();

        // Cores do Brasil
        const duration = setInterval(() => {
            // Verde
            confetti({
                particleCount: 40,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: ['#009c3b']
            });
            
            // Amarelo
            confetti({
                particleCount: 40,
                angle: 90,
                spread: 55,
                origin: { x: 0.5, y: 0.6 },
                colors: ['#ffdf00']
            });

            // Azul
            confetti({
                particleCount: 40,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#002776']
            });
        }, 200);

        setTimeout(() => clearInterval(duration), 2000);
    }
}

function updateScores() {
    scoreX.textContent = scores['L'];
    scoreO.textContent = scores['🔫'];
    scoreDraw.textContent = scores.draw;
}

function restart() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = PLAYER_L;
    cells.forEach(cell => cell.textContent = '');
    message.textContent = `Vez do jogador ${currentPlayer}`;
    winnerAnnouncement.innerHTML = '';
    winnerAnnouncement.classList.remove('show');
    winnerPhrase.classList.remove('show');
    setBackground('lula.jpg'); // Volta para o fundo padrão
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restart);

// Inicializar jogo
message.textContent = `Vez do jogador ${currentPlayer}`;
updateScores();
