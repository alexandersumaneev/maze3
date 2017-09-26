var mainMaze, tmpMaze, cellSize = 12, canvas1, ctx1, canvas2, ctx2, path, alg, rigthSide = 'rigth';
var shipX, shipY, exitX, exitY, shipStartX, shipStartY;
var tmpShipX, tmpShipY, tmpExitX, tmpExitY, tmpRigthHand, tmpWidth, tmpHeight;
var height = 112;//ширина
var width = 44;//высота

function onLoadPage() {
    showCanvas();
    init();
}

function showCanvas() {
    document.getElementById('aboutWin').style.display = 'none';
    document.getElementById('authorWin').style.display = 'none';
    document.getElementById('openWin').style.display = 'none';
    document.getElementById('saveWin').style.display = 'none';
    document.getElementById('canvasArea1').style.display = 'inherit';
    document.getElementById('prefGrid').style.display = 'none';
    document.getElementById('stop').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('menuArea').style.display = 'inherit';
}

function onOpenClick() {
    document.getElementById('aboutWin').style.display = 'none';
    document.getElementById('authorWin').style.display = 'none';
    document.getElementById('openWin').style.display = 'inherit';
    document.getElementById('saveWin').style.display = 'none';
    document.getElementById('canvasArea1').style.display = 'none';
    document.getElementById('prefGrid').style.display = 'none';
    document.getElementById('menuArea').style.display = 'none';
}

function onSaveClick() {
    document.getElementById('aboutWin').style.display = 'none';
    document.getElementById('authorWin').style.display = 'none';
    document.getElementById('openWin').style.display = 'none';
    document.getElementById('saveWin').style.display = 'inherit';
    document.getElementById('canvasArea1').style.display = 'none';
    document.getElementById('prefGrid').style.display = 'none';
    document.getElementById('menuArea').style.display = 'none';
}

function onPreferenceClick() {
    document.getElementById('aboutWin').style.display = 'none';
    document.getElementById('authorWin').style.display = 'none';
    document.getElementById('openWin').style.display = 'none';
    document.getElementById('saveWin').style.display = 'none';
    document.getElementById('canvasArea1').style.display = 'none';
    document.getElementById('prefGrid').style.display = 'grid';
    document.getElementById('menuArea').style.display = 'none';
    tmpMaze = mainMaze;
}

function onAboutClick() {
    document.getElementById('aboutWin').style.display = 'inherit';
    document.getElementById('authorWin').style.display = 'none';
    document.getElementById('openWin').style.display = 'none';
    document.getElementById('saveWin').style.display = 'none';
    document.getElementById('canvasArea1').style.display = 'none';
    document.getElementById('prefGrid').style.display = 'none';
    document.getElementById('menuArea').style.display = 'none';
}

function onAuthorClick() {
    document.getElementById('aboutWin').style.display = 'none';
    document.getElementById('authorWin').style.display = 'inherit';
    document.getElementById('openWin').style.display = 'none';
    document.getElementById('saveWin').style.display = 'none';
    document.getElementById('canvasArea1').style.display = 'none';
    document.getElementById('prefGrid').style.display = 'none';
    document.getElementById('menuArea').style.display = 'none';
}

function init() {
    canvas1 = document.getElementById('canvas1');
    ctx1 = canvas1.getContext('2d');
    canvas2 = document.getElementById('canvas2');
    ctx2 = canvas2.getContext('2d');
    mainMaze = [];
    createMaze(1, 1, mainMaze);
    tmpMaze = mainMaze;
    canvas1.setAttribute('height', '' + (width + 1) * cellSize);
    canvas1.setAttribute('width', '' + (height + 1) * cellSize);
    canvas2.setAttribute('height', '' + (width + 1) * cellSize);
    canvas2.setAttribute('width', '' + (height + 1) * cellSize);
    drawMaze(1, mainMaze);
    drawMaze(2, mainMaze);
    initExit(mainMaze);
    initShip(mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 2);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 1);
    findPath(mainMaze, 'rigthhand');
    drawPath(1);
    drawPath(2);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 2);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 1);
    
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function createMaze(i, j, maze) {
    var stack = [];

    function initGrid() {
        for (var i = 0; i < height; i++) {
            maze[i] = [];
            for (var j = 0; j < width; j++) {
                maze[i][j] = 1;
            }
        }
    }

    function getNeighbourhood(i, j) {
        var neighbourhood = [];
        if (i + 2 < height - 1)
            if (maze[i + 2][j] === 1)
                neighbourhood.push([i + 2, j]);
        if (i - 2 > 0)
            if (maze[i - 2][j] === 1)
                neighbourhood.push([i - 2, j]);
        if (j + 2 < width - 1)
            if (maze[i][j + 2] === 1)
                neighbourhood.push([i, j + 2]);
        if (j - 2 > 0)
            if (maze[i][j - 2] === 1)
                neighbourhood.push([i, j - 2]);
        return neighbourhood;
    }

    function createMazePath(i0, j0) {
        var i = i0, j = j0, nbh, iNew, jNew;
        while (getNeighbourhood(i, j).length !== 0) {
            nbh = getNeighbourhood(i, j);
            stack.push(nbh[getRandomInt(0, nbh.length - 1)]);
            iNew = stack[stack.length - 1][0];
            jNew = stack[stack.length - 1][1];
            maze[iNew][jNew] = 0;
            maze[Math.round((iNew + i) / 2)][Math.round((jNew + j) / 2)] = 0;
            i = iNew;
            j = jNew;
        }
    }

    stack = [];
    var iNew = i, jNew = j;
    initGrid();
    while (stack.length < (width - 2) * (height - 2) / 4) {
        createMazePath(iNew, jNew);
        for (var k = stack.length - 1; k > -1; k--) {
            if (getNeighbourhood(stack[k][0], stack[k][1]).length !== 0) {
                iNew = stack[k][0];
                jNew = stack[k][1];
                break;
            }
        }
    }
}

function drawMaze(canvasNumber, maze) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    }
    else {
        ctx = ctx2;
    }
    ctx.fillStyle = "rgba(40, 40, 50, 0.9)";
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (maze[i][j] === 1)
                ctx.fillRect(i * cellSize+1, j * cellSize+1, cellSize-1, cellSize-1);
        }
    }
}

function clearTmpMaze() {
    for (var i = 1; i < height - 1; i++) {
        for (var j = 1; j < width - 1; j++) {
            tmpMaze[i][j] = 0;
            ctx2.clearRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

function onPrefCloseButton() {
    showCanvas();
    drawMaze(1, mainMaze);
}

function findPath(maze, algtype) {
    path = [];
    var grid = new PF.Grid(height, width);
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++)
            if (maze[i][j] == 1)
                grid.setWalkableAt(i, j, false);
            else
                grid.setWalkableAt(i, j, true);
    switch (algtype) {
        case 'cheb': {
            var finder = new PF.BestFirstFinder({
                allowDiagonal: false,
                heuristic: PF.Heuristic.chebyshev
            });
            path = finder.findPath(shipX, shipY, exitX, exitY, grid);
            break;
        }
        case 'a*': {
            var finder = new PF.AStarFinder({
                allowDiagonal: false
            });
            path = finder.findPath(shipX, shipY, exitX, exitY, grid);
            break;
        }
        case 'rigthhand': {
            var trs=rigthSide;
            path.push([shipX, shipY]);
            rigthHandAlg(maze);
            shipX = path[0][0];
            shipY = path[0][1];
            rigthSide=trs;
            break;
        }
    }
}

function drawPath(canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    }
    else {
        ctx = ctx2;
    }
    ctx.fillStyle = "rgba(77, 100, 0, 0.4)";
    for (var k = 0; k < path.length; k++) {
        ctx.fillRect(cellSize * path[k][0] + 1, cellSize * path[k][1] + 1, cellSize - 1, cellSize - 1);
    }
}

function goForward(maze) {
    switch (rigthSide) {
        case 'rigth': {
            while (maze[shipX][shipY - 1] != 1 || !(shipX != exitX && shipY != exitY)) {
                path.push([shipX, shipY]);
                shipY--;
            }
            break;
        }
        case 'left': {
            while (maze[shipX][shipY + 1] != 1 || !(shipX != exitX && shipY != exitY)) {
                path.push([shipX, shipY]);
                shipY++;
            }
            break;
        }
        case 'top': {
            while (maze[shipX - 1][shipY] != 1 || !(shipX != exitX && shipY != exitY)) {
                path.push([shipX, shipY]);
                shipX--;
            }
            break;
        }
        case 'bottom': {
            while (maze[shipX + 1][shipY] != 1 || (shipX != exitX && shipY != exitY)) {
                path.push([shipX, shipY]);
                shipX++;
            }
            break;
        }
    }
}


function rotateShip() {
    switch (rigthSide) {
        case 'rigth': {
            rigthSide = 'top';
            break;
        }
        case 'left': {
            rigthSide = 'bottom';
            break;
        }
        case 'top': {
            rigthSide = 'left';
            break;
        }
        case 'bottom': {
            rigthSide = 'rigth';
            break;
        }
    }
}

function loop() {
    if (path.length > 1) {
        var rep = 0;
        for (var k = 1; k < path.length; k++)
            if (path[0][0] === path[k][0] && path[0][1] === path[k][1])
                rep++;
        if(rep>3)
            return true;
        else
            return false;

    } else
        return false;
}

function rigthHandAlg(maze) {
    goForward(maze);
    rotateShip();
    while (!loop() && (shipX != exitX || shipY != exitY)) {
        switch (rigthSide) {
            case 'rigth': {//идем вверх
                if (maze[shipX + 1][shipY] != 1) {//справа пусто
                    rigthSide = 'bottom';
                    shipX++;
                }
                else {
                    if (maze[shipX][shipY - 1] != 1) {
                        shipY--;
                    }
                    else {
                        rigthSide = 'top';
                    }
                }

                break;
            }
            case 'left': //идем вниз
                if (maze[shipX - 1][shipY] != 1) {//слева пусто
                    rigthSide = 'top';
                    shipX--;
                }
                else {
                    if (maze[shipX][shipY + 1] != 1) {
                        shipY++;
                    } else {
                        rigthSide = 'bottom';
                    }
                }
                break;

            case
            'top'//идем влево
            : {
                if (maze[shipX][shipY - 1] != 1) {//внизу пусто
                    rigthSide = 'rigth';
                    shipY--;
                }
                else {
                    if (maze[shipX - 1][shipY] != 1) {
                        shipX--;
                    }
                    else {
                        rigthSide = 'left';
                    }
                }
                break;
            }
            case
            'bottom'//идем вправо
            : {
                if (maze[shipX][shipY + 1] != 1) {//внизу пусто
                    rigthSide = 'left';
                    shipY++;
                }
                else {
                    if (maze[shipX + 1][shipY] != 1) {
                        shipX++;
                    }
                    else {
                        rigthSide = 'rigth';
                    }
                }
                break;
            }
        }
        path.push([shipX, shipY]);
    }
}

function initShip(maze) {
    var i = 0, j = 0;
    while (maze[i][j] == 1) {
        i = getRandomInt(2, height - 2);
        j = getRandomInt(2, width - 2);
    }
    shipX = i;
    shipY = j;
}

function initExit(maze) {
    var i = 0, j = 0;
    while (maze[i][j] == 1) {
        i = getRandomInt(2, height - 2);
        j = getRandomInt(2, width - 2);
    }
    exitX = i;
    exitY = j;
}

function drawShip(i, j, canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    }
    else {
        ctx = ctx2;
    }
    ctx.clearRect(cellSize * i, cellSize * j, cellSize, cellSize);
    ctx.fillStyle = "rgba(200, 0, 0, 0.9)";
    ctx.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
    ctx.fillStyle = "rgba(0, 200, 0, 0.9)";
    switch (rigthSide) {
        case 'rigth': {
            ctx.fillRect(cellSize * i, cellSize * j, cellSize, 4);
            break;
        }
        case 'left': {
            ctx.fillRect(cellSize * i, cellSize * j + 8, cellSize, 4);
            break;
        }
        case 'top': {
            ctx.fillRect(cellSize * i, cellSize * j, 4, cellSize);
            break;
        }
        case 'bottom': {
            ctx.fillRect(cellSize * i + 8, cellSize * j, 4, cellSize);
            break;
        }
    }
}

function drawExit(i, j, canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    }
    else {
        ctx = ctx2;
    }
    ctx.fillStyle = "rgba(0, 200, 0, 0.9)";
    ctx.clearRect(cellSize * exitX + 1, cellSize * exitY + 1, cellSize - 1, cellSize - 1);
    ctx.fillRect(cellSize * i + 1, cellSize * j + 1, cellSize - 1, cellSize - 1);
    exitX = i;
    exitY = j;
}