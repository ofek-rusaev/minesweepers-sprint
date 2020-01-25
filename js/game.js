// Called when a cell (td) is clicked 
function cellClicked(elCell, i, j) {
    // on first click - set random mines:
    if (!gGame.isOn) return;
    if (isFirstClick) startGame();
    if (elCell.innerText === FLAG) return;
    // on hint mode:
    if (isHintOn) {
        showHint(elCell, i, j);
        return;
    }
    if (gBoard[i][j].isMine && !isHintOn) {
        // hit mine and has lives
        if (gLivesCount > 1) {
            gLivesCount--;
            showMineHit(elCell);
            return;
        } else {
            getSmileyBtn(SMILEY_LOSE);
            revelAllMines();
            gameOver();
        }
    }
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    if (!gBoard[i][j].isMine) {
        gGame.shownCount++;
        elCell.classList.add('open');
    }
    var cellValue = gBoard[i][j].negsMinesCount;
    addStyleForNums(elCell, i, j);

    (cellValue === 0) ? elCell.innerHTML = EMPTY : elCell.innerHTML = cellValue;
    if (gBoard[i][j].negsMinesCount < 1) expandShown(gBoard, i, j);
    renderCell(i, j, cellValue);
    checkWin();
}

// when clicked mine and still has lives
function showMineHit(elCell) {
    elCell.innerText = MINE;
    elCell.classList.add('mark');
    elLivesIconUpdate();
    setTimeout(function () {
        elCell.innerText = EMPTY;
        elCell.classList.remove('mark');
    }, 1000);
}

function elLivesIconUpdate() {
    var elLives = document.querySelector('p span');
    var elStr = ''
    for (var i = gLivesCount; i > 0 ; i--) {
        elStr += '❤';
    }
    elLives.innerText = elStr;
}

// on "hint" click:
function setHintOn() {
    if (gHintsCount === 0) return;
    isHintOn = true;
    gHintsCount--;
    elHintsBtnUpdate();
    var elContainer = document.querySelector('.board');
    elContainer.classList.add('hint');
}

function elHintsBtnUpdate() {
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

// revel for hint mode:
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

// hide for hint mode:
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
            addStyleForNums(elNegCell, i, j);
            elNegCell.innerText = board[i][j].negsMinesCount;
            elNegCell.classList.add('open');
            gGame.shownCount++;
            if (board[i][j].negsMinesCount === EMPTY) expandShown(board, i, j);
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

function gameOver() {
    gGame.isOn = false;
    isFirstClick = true;
    clearInterval(gTimerInterval);
}

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