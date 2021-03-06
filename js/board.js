console.log('minesweeper');

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var SMILEY = '😀';
var SMILEY_LOSE = '😕';
var SMILEY_WIN = '😎';
var MINE = '💣';
var EMPTY = ' ';
var FLAG = '🚩';
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
}
var gBoard;
var gTimerInterval;

var isFirstClick = true; // recognizes first click and starts game. TO DO : change to boolan value
var gHintsCount = 3;
var gLivesCount = 3;
var gSafeClicksCount = 3;
var isHintOn = false;

function init() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gLivesCount = 3;
    elLivesIconUpdate();
    gHintsCount = 3;
    elHintsBtnUpdate();
    gSafeClicksCount = 3;
    elSafeClickBtnUpdate();
    gBoard = createBoard();
    renderBoard();

}

// adding mines after & timer first click
function startGame() {
    isFirstClick = false;
    gGame.isOn = true;
    addMines();
    getTime();
}

// resets game based on player level choice
function resetGame(size, mines) {
    getSmileyBtn(SMILEY);
    isFirstClick = true;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    clearInterval(gTimerInterval);
    init();
}

function createBoard() {
    var board = [];
    var size = gLevel.SIZE;
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                negsMinesCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

// Render the board as a <table> to the page 
function renderBoard() {
    var strHTML = '<table border="0" class="table"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = EMPTY;
            var className = ``;
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})" > ${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
    // console.log(elContainer.innerHTML);
}

// function addMinesDeb(i, j) {
//     gBoard[i][j].isMine = true;
//     var mineCellSelector = getSelector(i, j);
//     var elCell = document.querySelector(mineCellSelector);
//     elCell.classList.add('mine');
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             gBoard[i][j].negsMinesCount = countCellNegs(gBoard, i, j);
//             if (gBoard[i][j].isMine) gBoard[i][j].negsMinesCount = MINE;
//         }
//     }
// }

// adding mines and activate negs count
function addMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        setRandMine();
    }
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].negsMinesCount = countCellNegs(gBoard, i, j);
            if (gBoard[i][j].negsMinesCount === 0) gBoard[i][j].negsMinesCount = EMPTY;
            if (gBoard[i][j].isMine) gBoard[i][j].negsMinesCount = MINE;
        }
    }
}

// function countNegMines(i, j) {
// }

function countCellNegs(board, posI, posJ) {
    var negsMinesCount = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j].isMine) negsMinesCount++;
        }
    }
    return negsMinesCount;
}

// set random mine location
function setRandMine(i, j) {
    var iIdx = getRandomInt(0, gLevel.SIZE - 1);
    var jIdx = getRandomInt(0, gLevel.SIZE - 1);
    while (i === iIdx && j === jIdx) {
        setRandMine(i, j);
    }
    gBoard[iIdx][jIdx].isMine = true;
    var mineCellSelector = getSelector(iIdx, jIdx);
    var elCell = document.querySelector(mineCellSelector);
    // adding "mine" classList:
    elCell.classList.add('mine');
}

// sets colors for numbers on board:
function addStyleForNums(elCell, i, j) {
    if (gBoard[i][j].negsMinesCount === 1) elCell.classList.add('one');
    if (gBoard[i][j].negsMinesCount === 2) elCell.classList.add('two');
    if (gBoard[i][j].negsMinesCount === 3) elCell.classList.add('three');
    if (gBoard[i][j].negsMinesCount === 4) elCell.classList.add('four');
    if (gBoard[i][j].negsMinesCount === 5) elCell.classList.add('five');
    if (gBoard[i][j].negsMinesCount === 6) elCell.classList.add('six');
    if (gBoard[i][j].negsMinesCount === 7) elCell.classList.add('seven');
    if (gBoard[i][j].negsMinesCount === 8) elCell.classList.add('eight');
}

// captures smiley element
function getSmileyBtn(newValue) {
    var elSmileyBtn = document.getElementsByClassName('smiley')
    elSmileyBtn[0].innerText = newValue;
}

function getTime() {
    startTime = new Date().getTime();
    gTimerInterval = setInterval(timer, 2, startTime);
}

function timer() {
    var elClock = document.querySelector('.clock');
    var updateTime = new Date().getTime();
    var diff = updateTime - startTime;
    var seconds = diff / 1000;
    elClock.innerText = seconds.toFixed(0);
}
