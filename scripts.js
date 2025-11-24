 alert(" Esse game é criado por Samuel Dev");

const GRID_SIZE = 16;
const PAIR_COUNT = GRID_SIZE / 2;

let allEmojis = [
    { id: 0, value: "💡" }, { id: 1, value: "😎" }, { id: 2, value: "🤩" }, { id: 3, value: "😡" }, 
    { id: 4, value: "💀" }, { id: 5, value: "💣" }, { id: 6, value: "🐈" }, { id: 7, value: "🔑" }, 
    { id: 8, value: "👽" }, { id: 9, value: "🐸" }, { id: 10, value: "🚗" }, { id: 11, value: "🚑" }, 
    { id: 12, value: "✈️" }, { id: 13, value: "👉" }, { id: 14, value: "🌧️" }, { id: 15, value: "💻" }, 
    { id: 16, value: "📚" }, { id: 17, value: "🛠️" }, { id: 18, value: "🪑" }, { id: 19, value: "💰" }
];


const gridElement = document.getElementById("grid");
const buttonRestart = document.getElementById("buttonRestart");
const buttonShow = document.getElementById("buttonShow");
const spanAmountGains = document.getElementById("amountGains");
const spanAmountErrors = document.getElementById("amountErrors");
const spanTimer = document.getElementById("timer");


let pairsEmojisGame = [];
let cards = [];
let idsFinishedCards = [];
let idCardOne = null;
let idCardTwo = null;
let amountErrors = 0;
let amountGains = 0;
let lockBoard = false;
let timeElapsed = 0;
let timerInterval = null;
let gameStarted = false; 


function updateTimer() {
    timeElapsed++;
    
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;

    let formattedTime = 
        (minutes < 10 ? "0" + minutes : minutes) + 
        ":" + 
        (seconds < 10 ? "0" + seconds : seconds);

    if (spanTimer) {
        spanTimer.innerHTML = "Tempo: " + formattedTime;
    }
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function preparedCardsPairs(amount) {
    let allEmojisPairs = [];
    let alreadyEmojisControls = [];
    let amountPrepared = 0;

    while (amountPrepared < amount) {
        let randomIndex = Math.floor(Math.random() * allEmojis.length);
        let emoji = allEmojis[randomIndex];

        if (!alreadyEmojisControls.includes(emoji.id)) {
            allEmojisPairs.push(emoji);
            allEmojisPairs.push(emoji);
            alreadyEmojisControls.push(emoji.id);
            amountPrepared++;
        }
    }
    return allEmojisPairs;
}

function mixedCardsPairs(array) {
    let mixedArray = [...array];
    for (let i = mixedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixedArray[i], mixedArray[j]] = [mixedArray[j], mixedArray[i]];
    }
    return mixedArray;
}


function createBoard() {
    gridElement.innerHTML = ''; 
    
    pairsEmojisGame.forEach((pair, index) => {
        const cardHTML = `
            <div class="cards" data-id="${index}">
                <div class="cardsInner">
                    <div class="cardsFront">?</div>
                    <div class="cardsBack">${pair.value}</div>
                </div>
            </div>
        `;
        gridElement.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    cards = Array.from(gridElement.children);
    cards.forEach(cardElement => {
        cardElement.addEventListener("click", handleCardClick);
    });
}

function handleCardClick(e) {
    const cardElement = e.currentTarget;
    const id = parseInt(cardElement.dataset.id);

    if (lockBoard) return;
    if (idsFinishedCards.includes(id)) return;
    if (id === idCardOne || id === idCardTwo) return;
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    cardElement.classList.add("active");

    if (idCardOne === null) { 
        idCardOne = id; 
    } else { 
        idCardTwo = id;
    }

    if (idCardOne !== null && idCardTwo !== null) { checkCards(); }
}

function checkCards() {

    const valueCardOne = pairsEmojisGame[idCardOne].value;
    const valueCardTwo = pairsEmojisGame[idCardTwo].value;
    const idInternalCardOne = idCardOne;
    const idInternalCardTwo = idCardTwo;

    const cardOne = cards[idInternalCardOne];
    const cardTwo = cards[idInternalCardTwo];

    if (valueCardOne === valueCardTwo) {
    
        amountGains++;
        
        idsFinishedCards.push(idInternalCardOne);
        idsFinishedCards.push(idInternalCardTwo);
        
        cardOne.classList.add("matched"); 
        cardTwo.classList.add("matched");
        
        if (amountGains === PAIR_COUNT) {
            stopTimer();
            const finalTime = spanTimer ? spanTimer.textContent.replace('Tempo: ', '') : 'Tempo não registrado';
            alert(`Parabéns! Você ganhou em ${finalTime} com ${amountErrors} erros!`);
        }
        
    } 
    else 
    {
        amountErrors++;
        lockBoard = true; 

        setTimeout(() => {
            cardOne.classList.remove("active");
            cardTwo.classList.remove("active");
            
            lockBoard = false;
        }, 1000);
    }
    
    
    idCardOne = null;
    idCardTwo = null;

    spanAmountErrors.innerHTML = "Erros: " + amountErrors;
    spanAmountGains.innerHTML = "Ganhos: " + amountGains;
}

function setListenersByButtons() {
    
    buttonRestart.addEventListener("click", function () {
        
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 2000); 
    });

    
    buttonShow.addEventListener("click", function () {
        stopTimer(); 
        cards.forEach(card => {
            card.classList.add("active");
        });
        
        buttonShow.disabled = true; 
        gameStarted = true; 
    });
}


(function initGame() {
    setListenersByButtons();
    
    pairsEmojisGame = mixedCardsPairs(preparedCardsPairs(PAIR_COUNT));
    createBoard(); 
    
})();