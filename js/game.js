// Called when a cell (td) is clicked 
function cellClicked(elCell, i, j) {
    // on first click - set random mines:
    if (!gGame.isOn) return;
    if (gClicksCount === 0) startGame();
    if (elCell.innerText === FLAG) return;
    // on hint mode:
    if (isHintOn) {
        showHint(elCell, i, j);
        return;
    }
    if (gBoard[i][j].isMine && !isHintOn) {
        getSmileyBtn(SMILEY_LOSE);
        revelAllMines();
        gameOver();
    }
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    if (!gBoard[i][j].isMine) gGame.shownCount++;
    var cellValue = gBoard[i][j].negsMinesCount;
    elCell.innerHTML = cellValue;
    if (gBoard[i][j].negsMinesCount < 1) expandShown(gBoard, i, j);
    renderCell(i, j, cellValue);
    checkWin();
}

// on "hint" click:
function setHintOn() {
    if (gHintsCount === 0) return;
    isHintOn = true;
    var elContainer = document.querySelector('.board');
    gHintsCount--;
    elContainer.classList.add('hint');
    document.querySelector('button span').innerText = gHintsCount;
}

// if hint mode is on - will revel chosen section on board for 1 sec:
function showHint(elCell, i, j) {
    var cellValue = gBoard[i][j].negsMinesCount;
    elCell.innerText = cellValue;
    renderCell(i, j, cellValue);
    revelHintNegs(gBoard, i, j);
    setTimeout(function () {
        elCell.innerText = EMPTY;
        renderCell(i, j, EMPTY);
        hideHintNegs(gBoard, i, j);
        var elContainer = document.querySelector('.board');
        elContainer.classList.remove('hint');
        isHintOn = false;
    }, 1000);
}

// revel cells for hint mode:
function revelHintNegs(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j].isShown) continue;
            var negCellSelector = getSelector(i, j);
            var elNegCell = document.querySelector(negCellSelector);
            elNegCell.innerText = board[i][j].negsMinesCount;
        }
    }
}

// hide cells after hint mode:
function hideHintNegs(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j].isShown) continue;
            var negCellSelector = getSelector(i, j);
            var elNegCell = document.querySelector(negCellSelector);
            elNegCell.innerText = EMPTY;
        }
    }
}

// show cell's negs:
function expandShown(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i + 1 > board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j].isShown) continue;
            board[i][j].isShown = true;
            var negCellSelector = getSelector(i, j);
            var elNegCell = document.querySelector(negCellSelector);
            elNegCell.innerText = board[i][j].negsMinesCount;
            gGame.shownCount++;
            if (gBoard[i][j].negsMinesCount === 0) expandShown(board, i, j); 
        }
    }
}
// function expandShown(board, posI, posJ) {
//     for (var i = posI - 1; i <= posI + 1; i++) {
//         if (i < 0 || i + 1 > board.length) continue;
//         for (var j = posJ - 1; j <= posJ + 1; j++) {
//             if (j < 0 || j + 1 > board.length) continue;
//             if (i === posI && j === posJ) continue;
//             if (board[i][j].isShown) continue;
//             board[i][j].isShown = true;
//             var negCellSelector = getSelector(i, j);
//             var elNegCell = document.querySelector(negCellSelector);
//             elNegCell.innerText = board[i][j].negsMinesCount;
//             gGame.shownCount++;
//         }
//     }
// }

// shows all mines in red when player lost the game 
function revelAllMines() {
    var elCell = document.querySelectorAll('.mine');
    for (var i = 0; i < elCell.length; i++) {
        elCell[i].innerText = MINE;
        elCell[i].classList.add('mark');
    }
}

// right click - add/remove flag
function cellMarked(elCell, i, j) {
    elCell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        var cellNegsCount = gBoard[i][j].negsMinesCount;
        if (elCell.innerText === FLAG) {
            elCell.innerText = cellNegsCount;
            gBoard[i][j].isMarked = false;
            gGame.markedCount--;
        } else {
            renderCell(i, j, FLAG);
            gBoard[i][j].isMarked = true;
            gGame.markedCount++;
            checkWin();
        }
        return false;
    }, false);
}

// disable menu on right click
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function () {
        window.event.returnValue = false;
    });
}

function checkWin() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
        && gGame.markedCount === gLevel.MINES) {
        getSmileyBtn(SMILEY_WIN);
        gameOver();
        return true;
    } else {
        return false;
    }
}

function gameOver() {
    gGame.isOn = false;
    gClicksCount = 0;
    clearInterval(gTimerInterval);
}

