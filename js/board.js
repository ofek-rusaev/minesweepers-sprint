console.log('minesweeper');

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var WALL = '⬜';
var MINE = '💣';
var EMPTY = ' ';
var FLAG = '🚩';
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
}
var gBoard;
var gInterval;

/*
Functions TO-DO:
++ cellMarked(elCell)  - Called on right click to mark a cell (suspected to be a mine) Search the web (and implement) how to hide the context menu on right click.
*/



// window.oncontextmenu = function () {
    //     alert('Right Click')
    // }

function init() {
    gBoard = createBoard();
    renderBoard();
}

// adding mines on first click
function startGame() {
    gGame.isOn = true;
    addMines();
    getTime();
}

// resets game based on player level choice
function resetGame(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
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
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = WALL;
            var className = `cell ${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="flagCell()" > ${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
    console.log(elContainer.innerHTML);
}

el.addEventListener('contextmenu', function flagCell(ev) {
    ev.preventDefault();
    console.log(el);
    return false;
}, false);

// adding mines based on level
function addMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        setRandMine();
    }
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].negsMinesCount = countNegMines(gBoard, i, j);
            if (gBoard[i][j].isMine) gBoard[i][j].negsMinesCount = MINE;
        }
    }
}

// set random mine location
function setRandMine() {
    var iIdx = getRandomInt(0, gLevel.SIZE - 1);
    var jIdx = getRandomInt(0, gLevel.SIZE - 1);
    gBoard[iIdx][jIdx].isMine = true;
}

function countNegMines(board, posI, posJ) {
    var negsMinesCount = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i - 1 < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j].isMine) negsMinesCount++;
        }
    }
    return negsMinesCount;
}

// // disable menu on right click
// if (document.addEventListener) {
//     document.addEventListener('contextmenu', function (e) {
//         e.preventDefault();
//     }, false);
// } else {
//     document.attachEvent('oncontextmenu', function () {
//         window.event.returnValue = false;
//     });
// }

function getTime() {
    startTime = new Date().getTime();
    gInterval = setInterval(timer, 2, startTime);
}

function timer() {
    var elClock = document.querySelector('.clock');
    var updateTime = new Date().getTime();
    var diff = updateTime - startTime;
    var seconds = diff / 1000;
    elClock.innerText = seconds.toFixed(0);
}