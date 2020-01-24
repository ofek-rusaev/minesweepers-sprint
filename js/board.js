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

var gClicksCount = 0; // recognizes first click and starts game. TO DO : change to boolan value
var gHintsCount = 3;
var isHintOn = false;

function init() {
    gGame.isOn = true;
    gBoard = createBoard();
    renderBoard();

}

// adding mines after & timer first click
function startGame() {
    gClicksCount++;
    gGame.isOn = true;
    addMines();
    getTime();
}

// resets game based on player level choice
function resetGame(size, mines) {
    getSmileyBtn(SMILEY);
    gClicksCount = 0;
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


function addMinesDeb(i, j) {
    gBoard[i][j].isMine = true;
    var mineCellSelector = getSelector(i, j);
    var elCell = document.querySelector(mineCellSelector);
    elCell.classList.add('mine');
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].negsMinesCount = countCellNegs(gBoard, i, j);
            if (gBoard[i][j].isMine) gBoard[i][j].negsMinesCount = MINE;
        }
    }
}

// adding mines and activate negs count
function addMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        setRandMine();
    }
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].negsMinesCount = countCellNegs(gBoard, i, j);
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
// function setRandMine(i, j) {
//     var iIdx = getRandomInt(0, gLevel.SIZE - 1);
//     var jIdx = getRandomInt(0, gLevel.SIZE - 1);
//     if (i === iIdx && j === jIdx) {
//         setRandMine(i, j);
//     } else {
//         gBoard[iIdx][jIdx].isMine = true;
//         var mineCellSelector = getSelector(iIdx, jIdx);
//         var elCell = document.querySelector(mineCellSelector);
//         // adding "mine" classList:
//         elCell.classList.add('mine');
//     }
// }

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
