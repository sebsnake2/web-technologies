const icons = [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍒",
    "🥝",
    "🍍",
    "🥥",
    "🍉",
    "🍋",
    "🍑",
    "🥭",
    "🐶",
    "🐱",
    "🐼",
    "🦊",
    "🐸",
    "🐵",
];

const difficultyTime = {
    easy: 180,
    normal: 120,
    hard: 60,
};

const defaultSettings = {
    playersCount: 1,
    playerOneName: "Player 1",
    playerTwoName: "Player 2",
    rows: 3,
    columns: 4,
    difficulty: "easy",
    rounds: 1,
};

let game = {
    settings: { ...defaultSettings },
    players: [],
    currentRound: 1,
    currentPlayerIndex: 0,
    cards: [],
    openedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: null,
    timeLeft: 0,
    roundResults: [],
    isBoardLocked: false,
};

const elements = {
    settings: document.getElementById("settings"),
    gameSection: document.getElementById("gameSection"),
    resultsSection: document.getElementById("resultsSection"),
    playersCount: document.getElementById("playersCount"),
    playerOneName: document.getElementById("playerOneName"),
    playerTwoName: document.getElementById("playerTwoName"),
    playerTwoBlock: document.getElementById("playerTwoBlock"),
    rowsCount: document.getElementById("rowsCount"),
    columnsCount: document.getElementById("columnsCount"),
    difficulty: document.getElementById("difficulty"),
    roundsCount: document.getElementById("roundsCount"),
    startGameBtn: document.getElementById("startGameBtn"),
    resetSettingsBtn: document.getElementById("resetSettingsBtn"),
    settingsError: document.getElementById("settingsError"),
    currentRound: document.getElementById("currentRound"),
    totalRounds: document.getElementById("totalRounds"),
    timer: document.getElementById("timer"),
    movesCount: document.getElementById("movesCount"),
    currentPlayer: document.getElementById("currentPlayer"),
    scorePanel: document.getElementById("scorePanel"),
    gameBoard: document.getElementById("gameBoard"),
    restartBtn: document.getElementById("restartBtn"),
    roundResults: document.getElementById("roundResults"),
    finalWinner: document.getElementById("finalWinner"),
};

const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const isEvenNumber = (number) => {
    return number % 2 === 0;
};

const getPairsCount = (rows, columns) => {
    return (rows * columns) / 2;
};

const createCardValues = (pairsCount) => {
    const selectedIcons = icons.slice(0, pairsCount);
    return shuffleArray([...selectedIcons, ...selectedIcons]);
};

const createPlayers = (settings) => {
    const firstPlayer = {
        name: settings.playerOneName || "Player 1",
        score: 0,
        totalWins: 0,
    };

    const secondPlayer = {
        name: settings.playerTwoName || "Player 2",
        score: 0,
        totalWins: 0,
    };

    return settings.playersCount === 2
        ? [firstPlayer, secondPlayer]
        : [firstPlayer];
};

const getRoundWinner = (players) => {
    if (players.length === 1) {
        return players[0].name;
    }

    if (players[0].score > players[1].score) {
        return players[0].name;
    }

    if (players[1].score > players[0].score) {
        return players[1].name;
    }

    return "Нічия";
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
};

const validateSettings = (settings) => {
    const totalCards = settings.rows * settings.columns;

    if (settings.rows < 3 || settings.columns < 4) {
        return "Мінімальний розмір поля — 3x4.";
    }

    if (!isEvenNumber(totalCards)) {
        return "Кількість карток має бути парною.";
    }

    if (getPairsCount(settings.rows, settings.columns) > icons.length) {
        return "Занадто велике поле. Недостатньо зображень для пар.";
    }

    if (settings.rounds < 1) {
        return "Кількість раундів має бути мінімум 1.";
    }

    return "";
};

const readSettingsFromForm = () => {
    return {
        playersCount: Number(elements.playersCount.value),
        playerOneName: elements.playerOneName.value.trim() || "Player 1",
        playerTwoName: elements.playerTwoName.value.trim() || "Player 2",
        rows: Number(elements.rowsCount.value),
        columns: Number(elements.columnsCount.value),
        difficulty: elements.difficulty.value,
        rounds: Number(elements.roundsCount.value),
    };
};

const updatePlayerTwoVisibility = () => {
    const isTwoPlayers = Number(elements.playersCount.value) === 2;
    elements.playerTwoBlock.classList.toggle("hidden", !isTwoPlayers);
};

const resetSettingsForm = () => {
    elements.playersCount.value = defaultSettings.playersCount;
    elements.playerOneName.value = defaultSettings.playerOneName;
    elements.playerTwoName.value = defaultSettings.playerTwoName;
    elements.rowsCount.value = defaultSettings.rows;
    elements.columnsCount.value = defaultSettings.columns;
    elements.difficulty.value = defaultSettings.difficulty;
    elements.roundsCount.value = defaultSettings.rounds;
    elements.settingsError.textContent = "";
    updatePlayerTwoVisibility();
};

const renderBoard = () => {
    elements.gameBoard.innerHTML = "";
    elements.gameBoard.style.gridTemplateColumns = `repeat(${game.settings.columns}, 95px)`;

    game.cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.id = card.id;

        cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${card.value}</div>
      </div>
    `;

        cardElement.addEventListener("click", () => handleCardClick(card.id));
        elements.gameBoard.appendChild(cardElement);
    });
};

const renderGameInfo = () => {
    elements.currentRound.textContent = game.currentRound;
    elements.totalRounds.textContent = game.settings.rounds;
    elements.timer.textContent = formatTime(game.timeLeft);
    elements.movesCount.textContent = game.moves;
    elements.currentPlayer.textContent =
        game.players[game.currentPlayerIndex].name;
};

const renderScorePanel = () => {
    elements.scorePanel.innerHTML = "";

    game.players.forEach((player, index) => {
        const scoreItem = document.createElement("div");
        scoreItem.className = "score-item";

        if (index === game.currentPlayerIndex) {
            scoreItem.classList.add("active-player");
        }

        scoreItem.innerHTML = `
      <strong>${player.name}</strong>: ${player.score} пар
    `;

        elements.scorePanel.appendChild(scoreItem);
    });
};

const updateCardClass = (cardId, className, shouldAdd) => {
    const cardElement = document.querySelector(`[data-id="${cardId}"]`);

    if (!cardElement) {
        return;
    }

    cardElement.classList.toggle(className, shouldAdd);
};

const createCards = () => {
    const pairsCount = getPairsCount(game.settings.rows, game.settings.columns);
    const cardValues = createCardValues(pairsCount);

    return cardValues.map((value, index) => ({
        id: index,
        value,
        isOpened: false,
        isMatched: false,
    }));
};

const startTimer = () => {
    clearInterval(game.timer);

    game.timer = setInterval(() => {
        game.timeLeft -= 1;
        elements.timer.textContent = formatTime(game.timeLeft);

        if (game.timeLeft <= 0) {
            finishRound();
        }
    }, 1000);
};

const resetPlayersScore = () => {
    game.players = game.players.map((player) => ({
        ...player,
        score: 0,
    }));
};

const startRound = () => {
    clearInterval(game.timer);

    game.cards = createCards();
    game.openedCards = [];
    game.matchedPairs = 0;
    game.moves = 0;
    game.currentPlayerIndex = 0;
    game.timeLeft = difficultyTime[game.settings.difficulty];
    game.isBoardLocked = false;

    resetPlayersScore();
    renderBoard();
    renderGameInfo();
    renderScorePanel();
    startTimer();
};

const startGame = () => {
    const settings = readSettingsFromForm();
    const error = validateSettings(settings);

    if (error) {
        elements.settingsError.textContent = error;
        return;
    }

    game.settings = settings;
    game.players = createPlayers(settings);
    game.currentRound = 1;
    game.roundResults = [];

    elements.settings.classList.add("hidden");
    elements.resultsSection.classList.add("hidden");
    elements.gameSection.classList.remove("hidden");

    startRound();
};

const restartGame = () => {
    game.currentRound = 1;
    game.roundResults = [];
    game.players = createPlayers(game.settings);
    startRound();
};

const switchPlayer = () => {
    if (game.players.length < 2) {
        return;
    }

    game.currentPlayerIndex = game.currentPlayerIndex === 0 ? 1 : 0;
};

const closeOpenedCards = () => {
    game.openedCards.forEach((card) => {
        card.isOpened = false;
        updateCardClass(card.id, "opened", false);
    });

    game.openedCards = [];
};

const markCardsAsMatched = () => {
    game.openedCards.forEach((card) => {
        card.isMatched = true;
        updateCardClass(card.id, "matched", true);
    });

    game.players[game.currentPlayerIndex].score += 1;
    game.matchedPairs += 1;
    game.openedCards = [];
};

const handlePairResult = () => {
    const [firstCard, secondCard] = game.openedCards;
    const isPair = firstCard.value === secondCard.value;

    if (isPair) {
        markCardsAsMatched();
        renderScorePanel();

        if (
            game.matchedPairs ===
            getPairsCount(game.settings.rows, game.settings.columns)
        ) {
            finishRound();
        }

        game.isBoardLocked = false;
        return;
    }

    setTimeout(() => {
        closeOpenedCards();
        switchPlayer();
        renderGameInfo();
        renderScorePanel();
        game.isBoardLocked = false;
    }, 800);
};

const handleCardClick = (cardId) => {
    if (game.isBoardLocked) {
        return;
    }

    const card = game.cards.find((item) => item.id === cardId);

    if (!card || card.isOpened || card.isMatched) {
        return;
    }

    card.isOpened = true;
    game.openedCards.push(card);
    updateCardClass(card.id, "opened", true);

    if (game.openedCards.length === 2) {
        game.moves += 1;
        game.isBoardLocked = true;
        renderGameInfo();
        handlePairResult();
    }
};

const saveRoundResult = () => {
    const winner = getRoundWinner(game.players);
    const timeUsed = difficultyTime[game.settings.difficulty] - game.timeLeft;

    game.roundResults.push({
        round: game.currentRound,
        winner,
        moves: game.moves,
        timeUsed,
        players: game.players.map((player) => ({
            name: player.name,
            score: player.score,
        })),
    });

    game.players.forEach((player) => {
        if (player.name === winner) {
            player.totalWins += 1;
        }
    });
};

const finishRound = () => {
    clearInterval(game.timer);
    saveRoundResult();

    if (game.currentRound < game.settings.rounds) {
        game.currentRound += 1;
        setTimeout(startRound, 1200);
        return;
    }

    finishGame();
};

const getFinalWinner = () => {
    if (game.players.length === 1) {
        return game.players[0].name;
    }

    if (game.players[0].totalWins > game.players[1].totalWins) {
        return game.players[0].name;
    }

    if (game.players[1].totalWins > game.players[0].totalWins) {
        return game.players[1].name;
    }

    return "Нічия";
};

const renderResults = () => {
    elements.roundResults.innerHTML = "";

    game.roundResults.forEach((result) => {
        const resultElement = document.createElement("div");
        resultElement.className = "result-card";

        const playersStats = result.players
            .map((player) => `${player.name}: ${player.score} пар`)
            .join("<br>");

        resultElement.innerHTML = `
      <h3>Раунд ${result.round}</h3>
      <p><strong>Переможець:</strong> ${result.winner}</p>
      <p><strong>Ходи:</strong> ${result.moves}</p>
      <p><strong>Час:</strong> ${formatTime(result.timeUsed)}</p>
      <p>${playersStats}</p>
    `;

        elements.roundResults.appendChild(resultElement);
    });

    elements.finalWinner.textContent = `Фінальний переможець: ${getFinalWinner()}`;
};

const finishGame = () => {
    elements.gameSection.classList.add("hidden");
    elements.resultsSection.classList.remove("hidden");
    elements.settings.classList.remove("hidden");

    renderResults();
};

elements.playersCount.addEventListener("change", updatePlayerTwoVisibility);
elements.startGameBtn.addEventListener("click", startGame);
elements.resetSettingsBtn.addEventListener("click", resetSettingsForm);
elements.restartBtn.addEventListener("click", restartGame);

resetSettingsForm();
