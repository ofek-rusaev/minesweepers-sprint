// Called when a cell (td) is clicked 
function cellClicked(elCell, i, j) {
    // on first click - set random mines:
    if (!gGame.isOn) startGame();

    if (gBoard[i][j].isMine) {
        // revelAllMines();
        setTimeout(gameOver, 3000);
    }
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    var cellValue = gBoard[i][j].negsMinesCount;
    // console.log('cell value', cellValue);
    // elCell.innerHTML = cellValue;
    elCell.innerHTML = getCellHTML(cellValue);
    if (gBoard[i][j].negsMinesCount < 1) expandShown(gBoard, elCell, i, j);
    renderCell(i, j, getCellHTML(cellValue));
}

// expandes negs cells if clicked cell was ZERO  ****** NOT WORKING!! ******
function expandShown(board, elCell, posI, posJ) {
    console.log('in expantion function');
    console.log(elCell);
    console.log(posI, posJ);
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i - 1 < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            board[i][j].isShown = true;
            console.log('inside loop')
            renderCell(i, j, gBoard[i][j].negsMinesCount);
            gGame.shownCount++;
        }
    }
}

function getCellHTML(cellValue) {
    return `<span class="">${cellValue}</span>`
}

function cellMarked(elCell) {

}

function showHint() {

}

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
        && gGame.markedCount === gLevel.MINES) {
        gameOver();
    }
}

function gameOver() {
    console.log('Game Over')
    gGame.isOn = false;
}

// function revelAllMines() {
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             var cell = gBoard[i][j]
//             if (cell.isMine) {
//                 var cellSelector = `.cell ${i}-${j}`;
//                 var elCell = document.querySelector(cellSelector);
//                 console.log('reveling', elCell);
//                 elCell.style.backgroundColor = 'red';
//                 // elGhosts[i].style.backgroundColor = 'lightgray'
//             }
//         }
//     }
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