// Called when a cell (td) is clicked 
function cellClicked(elCell, i, j) {
    // on first click - set random mines:
    if (gClicksCount === 0) startGame(i, j);
    if (elCell.innerText === FLAG) return;
    // on hint mode:
    if (isHintOn) {
        showHint(elCell, i, j);
        // setHintOn(true);
        // console.log('is hint on: ', isHintOn);
        // setTimeout(function () {
        //     console.log('inside set time out', elCell.innerText);
        //     setHintOn(elCell, i, j)
        // }, 4000);
        isHintOn = false;
        // setTimeout(setHintOn, 3000, false);
    }
    if (gBoard[i][j].isMine) {
        getSmileyBtn(SMILEY_LOSE);
        revelAllMines();
        setTimeout(gameOver, 3000);
    }
    // if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    var cellValue = gBoard[i][j].negsMinesCount;
    elCell.innerHTML = cellValue;
    if (gBoard[i][j].negsMinesCount < 1) expandShown(gBoard, i, j);
    renderCell(i, j, cellValue);
    checkWin();
}

function setHintOn() {
    isHintOn = true;
    // showHint();
    // console.log('in hint');
    var elContainer = document.querySelector('.board');
    elContainer.classList.add('hint');
    document.querySelector('button span').innerText = gHintsCount;
}

function showHint(elCell, i, j) {
    var cellValue = gBoard[i][j].negsMinesCount;
    elCell.innerHTML = cellValue;
    renderCell(i, j, cellValue);
    expandShown(gBoard, i, j)
    // gHintsCount--;
    // elContainer.classList.remove('hint');
}

function hideHint(elCell, i, j) {
    elCell.innerHTML = cellValue;
    renderCell(i, j, cellValue);
}

function checkWin() {
    if (gGame.markedCount !== gLevel.MINES) return false;
    for (var i = 0; i < gBoard.length; i++) {
        var cell = gBoard[i];
        if (!cell.isMine) {
            if (!cell.isShown) return false;
        }
    }
    getSmileyBtn(SMILEY_WIN);
    gameOver();
    return true;
    // if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    //     && gGame.markedCount === gLevel.MINES) {
    // }
}

// show cell's negs:
function countNegs(posI, posJ) {
    var neighborsCount = 0
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[i][j] === LIFE || gBoard[i][j] === SUPER_LIFE) neighborsCount++
        }
    }
    return neighborsCount
}

function expandShown(board, posI, posJ) {
    for (var i = posI + 1; i >= posI - 1; i--) {
        if (i - 1 < 0 || i + 1 > board.length) continue;
        for (var j = posJ + 1; j >= posJ - 1; j--) {
            if (j < 0 || j + 1 > board.length) continue;
            if (i === posI && j === posJ) continue;
            board[i][j].isShown = true;
            var negCellSelector = getSelector(i, j);
            var elNegCell = document.querySelector(negCellSelector);
            elNegCell.innerText = board[i][j].negsMinesCount;
            gGame.shownCount++;
        }
    }
}

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
        // console.log('right click ', elCell);
        var cellNegsCount = gBoard[i][j].negsMinesCount;
        if (elCell.innerText === FLAG) {
            elCell.innerText = cellNegsCount;
            gBoard[i][j].isMarked = false;
            gGame.markedCount--;
        } else {
            renderCell(i, j, FLAG);
            gBoard[i][j].isMarked = true;
            gGame.markedCount++;
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

function gameOver() {
    gGame.isOn = false;
    gClicksCount = 0;
    clearInterval(gTimerInterval);
}

