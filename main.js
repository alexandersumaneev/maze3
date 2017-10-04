var mainMaze,
    tmpMaze,
    cellSize = 16, //размер клетки в пикселях
    canvas1, //главный canvas
    ctx1,
    canvas2, //канвас в настройках
    ctx2,
    path, //массив с координатами пути
    alg,
    rigthSide = "bottom", //правая сторона коробля
    shipX,
    shipY,
    exitX,
    exitY,
    //---------------------------
    //положение при нажатии старт
    shipStartX,
    shipStartY,
    shipStartRigthSide,
    //----------------------------

    //----------------------------
    //при изменении настроек
    tmpShipX,
    tmpShipY,
    tmpExitX,
    tmpExitY,
    tmpRigthSide,
    tmpWidth,
    tmpHeight,
    tmpPath,
    //-----------------------------
    shipSpeed,
    metr = "cheb",
    nc,
    save,
    open,
    height = 84, //ширина
    width = 32, //высота
    timer,
    pathStep = 1,
    obj,
    mouse = {
        x: 0,
        y: 0
    };

function onLoadPage() {
    showCanvas();
    init();
}

function onStartStopClick() {
    var text = document.getElementById("startstop").innerText;
    if (text === 'Старт') {
        onStartClick();
        document.getElementById("startstop").innerText = 'Стоп';
    } else {
        onStopClick();
        document.getElementById("pausecont").style.display = 'inherit';
        document.getElementById("startstop").innerText = 'Старт';
        text = document.getElementById("pausecont").innerText = 'Пауза';
    }
}

function onPauseContClick() {
    var text = document.getElementById("pausecont").innerText;
    if (text === 'Пауза' && pathStep > 1) {
        onPauseClick();
        text = document.getElementById("pausecont").innerText = 'Продолжить';
    } else {
        if (pathStep > 1) {
            onStartClick();
            text = document.getElementById("pausecont").innerText = 'Пауза';
        }
    }
}

function changeWidth() {
    var inp = document.getElementsByName("size");
    clearCanvas(2);
    clearCanvas(1);
    width = inp[0].value;
    newMaze();
}

function changeHeight() {
    var inp = document.getElementsByName("size");
    clearCanvas(2);
    clearCanvas(1);
    height = inp[1].value;
    newMaze();
}

function showCanvas() {
    document.getElementById("aboutWin").style.display = "none";
    document.getElementById("authorWin").style.display = "none";
    document.getElementById("openWin").style.display = "none";
    document.getElementById("saveWin").style.display = "none";
    document.getElementById("canvasArea1").style.display = "inherit";
    document.getElementById("prefGrid").style.display = "none";
    document.getElementById("startstop").innerText = "Старт";
    document.getElementById("pausecont").innerText = "Пауза";
    document.getElementById("menuArea").style.display = "inherit";
}

function onOpenClick() {
    document.getElementById("aboutWin").style.display = "none";
    document.getElementById("authorWin").style.display = "none";
    document.getElementById("openWin").style.display = "inherit";
    document.getElementById("saveWin").style.display = "none";
    document.getElementById("canvasArea1").style.display = "none";
    document.getElementById("prefGrid").style.display = "none";
    document.getElementById("menuArea").style.display = "none";
    document.getElementById("o1").innerHTML = localStorage.getItem(0 + "date");
    document.getElementById("o2").innerHTML = localStorage.getItem(1 + "date");
    document.getElementById("o3").innerHTML = localStorage.getItem(2 + "date");
    document.getElementById("o4").innerHTML = localStorage.getItem(3 + "date");
}

function onSaveClick() {
    document.getElementById("aboutWin").style.display = "none";
    document.getElementById("authorWin").style.display = "none";
    document.getElementById("openWin").style.display = "none";
    document.getElementById("saveWin").style.display = "inherit";
    document.getElementById("canvasArea1").style.display = "none";
    document.getElementById("prefGrid").style.display = "none";
    document.getElementById("menuArea").style.display = "none";
    document.getElementById("s1").innerHTML = localStorage.getItem(0 + "date");
    document.getElementById("s2").innerHTML = localStorage.getItem(1 + "date");
    document.getElementById("s3").innerHTML = localStorage.getItem(2 + "date");
    document.getElementById("s4").innerHTML = localStorage.getItem(3 + "date");
}

function onPreferenceClick() {
    document.getElementById("aboutWin").style.display = "none";
    document.getElementById("authorWin").style.display = "none";
    document.getElementById("openWin").style.display = "none";
    document.getElementById("saveWin").style.display = "none";
    document.getElementById("canvasArea1").style.display = "none";
    document.getElementById("prefGrid").style.display = "grid";
    document.getElementById("menuArea").style.display = "none";
    onStopClick();
    tmpShipX = shipX;
    tmpShipY = shipY;
    tmpExitX = exitX;
    tmpExitY = exitY;
    tmpRigthSide = rigthSide;
    tmpWidth = width;
    tmpHeight = height;
    drawMaze(2, mainMaze);
    drawPath(2);
    drawMetric(2, mainMaze);
    drawExit(exitX, exitY, 2);
    drawShip(shipX, shipY, 2);
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++) tmpMaze[i][j] = mainMaze[i][j];
}

function onAboutClick() {
    document.getElementById("aboutWin").style.display = "inherit";
    document.getElementById("authorWin").style.display = "none";
    document.getElementById("openWin").style.display = "none";
    document.getElementById("saveWin").style.display = "none";
    document.getElementById("canvasArea1").style.display = "none";
    document.getElementById("prefGrid").style.display = "none";
    document.getElementById("menuArea").style.display = "none";
    onStartStopClick();
}

function onAuthorClick() {
    document.getElementById("aboutWin").style.display = "none";
    document.getElementById("authorWin").style.display = "inherit";
    document.getElementById("openWin").style.display = "none";
    document.getElementById("saveWin").style.display = "none";
    document.getElementById("canvasArea1").style.display = "none";
    document.getElementById("prefGrid").style.display = "none";
    document.getElementById("menuArea").style.display = "none";
    onStartStopClick();
}
//при загрузке страницы
function init() {
    changeSpeed1();
    document.getElementById("startstop").innerText = 'Старт';
    document.getElementById("pausecont").innerText = 'Пауза';
    document.getElementsByName("size")[0].value = width;
    document.getElementsByName("size")[1].value = height;
    canvas1 = document.getElementById("canvas1");
    ctx1 = canvas1.getContext("2d");
    canvas2 = document.getElementById("canvas2");
    ctx2 = canvas2.getContext("2d");
    save = document.getElementById("savegrid");
    open = document.getElementById("opengrid");
    mainMaze = [];
    createMaze(1, 1, mainMaze);
    tmpMaze = [];
    for (var i = 0; i < height; i++) {
        tmpMaze[i] = [];
        for (var j = 0; j < width; j++) {
            tmpMaze[i][j] = 1;
        }
    }
    initExit(mainMaze);
    initShip(mainMaze);
    canvas1.setAttribute("height", "" + (width + 1) * cellSize);
    canvas1.setAttribute("width", "" + (height + 1) * cellSize);
    canvas2.setAttribute("height", "" + (width + 1) * cellSize);
    canvas2.setAttribute("width", "" + (height + 1) * cellSize);
    onAlgTypeChange();
    onSideChange();
    onChangeObject();
    onMetTypeChange();
    drawMaze(1, mainMaze);
    findPath(mainMaze, alg);
    drawPath(1);
    drawMetric(1, mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 1);
    drawMetric(1, mainMaze);
    onStartClick();
    onStopClick();
    if (localStorage.length === 0) {
        onFileSave(0);
        onFileSave(1);
        onFileSave(2);
        onFileSave(3);
    }
    canvas2.addEventListener("mousedown", function(e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        var x0 = Math.floor(mouse.x / cellSize);
        var y0 = Math.floor(mouse.y / cellSize);
        switch (obj) {
            case "wall":
                {
                    if (x0 > 0 && x0 < height - 1 && y0 > 0 && y0 < width - 1)
                        mainMaze[x0][y0] = (1 + mainMaze[x0][y0]) % 2;
                    break;
                }
            case "ship":
                {
                    if (!(x0 === shipX && y0 === shipY))
                        if (mainMaze[x0][y0] === 0) {
                            shipX = x0;
                            shipY = y0;
                        }
                    break;
                }
            case "exit":
                {
                    if (!(x0 === shipX && y0 === shipY))
                        if (mainMaze[x0][y0] === 0) {
                            exitX = x0;
                            exitY = y0;
                        }
                    break;
                }
        }
        clearCanvas(2);
        drawMaze(2, mainMaze);
        findPath(mainMaze, alg);
        drawPath(2);
        drawMetric(2, mainMaze);
        drawShip(shipX, shipY, 2);
        drawExit(exitX, exitY);
    });
    canvas2.addEventListener("mouseup", function(e) {});

    save.addEventListener("mouseup", function(e) {
        var date = new Date();
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        x = Math.floor(x / 200);
        y = Math.floor(y / 200);
        if (x === 0) {
            if (y === 0) {
                nc = 0;
                document.getElementById("s1").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
                document.getElementById("o1").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
            } else {
                nc = 2;
                document.getElementById("s3").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
                document.getElementById("o3").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
            }
        } else {
            if (y === 0) {
                nc = 1;
                document.getElementById("s2").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
                document.getElementById("o2").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
            } else {
                nc = 3;
                document.getElementById("s4").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
                document.getElementById("o4").innerHTML = date.getMonth() + " " +
                    date.getDay() +
                    " " +
                    date.getHours() +
                    " " +
                    date.getMinutes() +
                    " " +
                    date.getSeconds();
            }
        }
        onFileSave(nc);
    });
    open.addEventListener("mouseup", function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        x = Math.floor(x / 200);
        y = Math.floor(y / 200);
        if (x === 0) {
            if (y === 0) {
                nc = 0;
            } else {
                nc = 2;
            }
        } else {
            if (y === 0) {
                nc = 1;
            } else {
                nc = 3;
            }
        }
        clearCanvas(2);
        onFileOpen(nc);
    });
}

function onFileSave(nc) {
    var date = new Date();
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++) {
            localStorage.setItem(nc + "|" + i + "|" + j, "" + mainMaze[i][j]);
        }
    localStorage.setItem(nc + "width", "" + width);
    localStorage.setItem(nc + "height", "" + height);
    localStorage.setItem(nc + "shipX", "" + shipX);
    localStorage.setItem(nc + "shipY", "" + shipY);
    localStorage.setItem(nc + "exitX", "" + exitX);
    localStorage.setItem(nc + "exitY", "" + exitY);
    localStorage.setItem(nc + "rigthSide", rigthSide);
    localStorage.setItem(
        nc + "date",
        date.getMonth() + " " + date.getDay() +
        " " +
        date.getHours() +
        " " +
        date.getMinutes() +
        " " +
        date.getSeconds()
    );
}

function onFileOpen(nc) {
    if (localStorage.length > 1) {
        width = parseInt(localStorage.getItem(nc + "width"));
        height = parseInt(localStorage.getItem(nc + "height"));
        shipX = parseInt(localStorage.getItem(nc + "shipX"));
        shipY = parseInt(localStorage.getItem(nc + "shipY"));
        shipStartX = shipX;
        shipStartY = shipY;
        rigthSide = localStorage.getItem(nc + "rigthSide");
        newMaze();
        exitX = parseInt(localStorage.getItem(nc + "exitX"));
        exitY = parseInt(localStorage.getItem(nc + "exitY"));
        for (var i = 0; i < height; i++)
            for (var j = 0; j < width; j++) {
                mainMaze[i][j] = parseInt(localStorage.getItem(nc + "|" + i + "|" + j));
            }
        document.getElementsByName("size")[1].value = height;
        document.getElementsByName("size")[0].value = width;
        onPreferenceClick();
        clearCanvas(2);
        drawMaze(2, mainMaze);
        drawShip(shipX, shipY, 2);
        drawExit(exitX, exitY, 2);
        findPath(mainMaze, alg);
        drawPath(2);
        drawMetric(2, mainMaze);
    }
}

function onChangeObject() {
    var inp = document.getElementsByName("obtype");
    for (var i = 0; i < inp.length; i++) {
        if (inp[i].type === "radio" && inp[i].checked) {
            obj = inp[i].value;
        }
    }
}

function newMaze() {
    clearCanvas(2);
    mainMaze = [];
    createMaze(1, 1, mainMaze);
    initExit(mainMaze);
    initShip(mainMaze);
    drawMaze(2, mainMaze);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
    drawExit(exitX, exitY, 2);
    drawShip(shipX, shipY, 2);
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

    //получить соседние клетки при создании лабиринта
    function getNeighbourhood(i, j) {
        var neighbourhood = [];
        if (i + 2 < height - 1)
            if (maze[i + 2][j] === 1) neighbourhood.push([i + 2, j]);
        if (i - 2 > 0)
            if (maze[i - 2][j] === 1) neighbourhood.push([i - 2, j]);
        if (j + 2 < width - 1)
            if (maze[i][j + 2] === 1) neighbourhood.push([i, j + 2]);
        if (j - 2 > 0)
            if (maze[i][j - 2] === 1) neighbourhood.push([i, j - 2]);
        return neighbourhood;
    }

    //создать часть лабиринта до тупика
    function createMazePath(i0, j0) {
        var i = i0,
            j = j0,
            nbh,
            iNew,
            jNew;
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
    var iNew = i,
        jNew = j;
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

function drawMetric(canvasNumber, maze) {
    var ctx, m;
    if (document.getElementById("check2").checked && alg == "wawe") {
        if (canvasNumber === 1) {
            ctx = ctx1;
        } else {
            ctx = ctx2;
        }
        ctx.fillStyle = "rgba(0, 250, 0, 0.4)";
        ctx.font = "5px";
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                switch (metr) {
                    case "cheb":
                        {
                            m = Math.max(Math.abs(i - exitX), Math.abs(j - exitY));
                            break;
                        }
                    case "evk":
                        {
                            m = Math.sqrt(
                                (i - exitX + 1) * (i - exitX) +
                                (j - exitY) * (j - exitY)
                            );
                            break;
                        }
                    case "city":
                        {
                            m = Math.abs(i - exitX) + Math.abs(j - exitY);
                            break;
                        }
                }
                m = Math.round(m);
                if (mainMaze[i][j] === 0)
                    ctx.fillText(m, i * cellSize, j * cellSize + cellSize);
            }
        }
    }
}

function drawMaze(canvasNumber, maze) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    } else {
        ctx = ctx2;
    }
    ctx.fillStyle = "rgba(40, 40, 40, 1)";
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (maze[i][j] === 1)
                ctx.fillRect(
                    i * cellSize + 1,
                    j * cellSize + 1,
                    cellSize - 1,
                    cellSize - 1
                );
        }
    }
}

function clearMaze() {
    clearCanvas(2);
    for (var i = 1; i < height - 1; i++) {
        for (var j = 1; j < width - 1; j++) {
            mainMaze[i][j] = 0;
        }
    }
    drawExit(exitX, exitY);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
    drawMaze(2, mainMaze);
    drawShip(shipX, shipY, 2);
}

function onPrefCloseButton() {
    showCanvas();
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++) mainMaze[i][j] = tmpMaze[i][j];
    shipX = tmpShipX;
    shipY = tmpShipY;
    exitX = tmpExitX;
    exitY = tmpExitY;
    width = tmpWidth;
    height = tmpHeight;
    rigthSide = tmpRigthSide;
    pathStep = 1;
    drawMaze(1, mainMaze);
    findPath(mainMaze, alg);
    drawPath(1);
    drawMetric(2, mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 1);
    document.getElementsByName("size")[0].value = width;
    document.getElementsByName("size")[1].value = height;
    document.getElementById("text").innerText = (pathStep - 1) + "/" + (path.length - 3) + "    " + (tmpPath.length - 3);
}

function onPrefOkButton() {
    showCanvas();
    clearCanvas(1);
    drawMaze(1, mainMaze);
    findPath(mainMaze, alg);
    drawPath(1);
    drawMetric(1, mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 1);
    pathStep = 1;
    document.getElementById("startstop").style.display = "inherit";
    document.getElementById("pausecont").style.display = "inherit";
    document.getElementById("text").innerText = (pathStep - 1) + "/" + (path.length - 3) + "    " + (tmpPath.length - 3);
}

function onPrefCancelButton() {
    clearCanvas(2);
    mainMaze = tmpMaze;
    shipX = tmpShipX;
    shipY = tmpShipY;
    exitX = tmpExitX;
    exitY = tmpExitY;
    width = tmpWidth;
    height = tmpHeight;
    document.getElementsByName("size")[0].value = width;
    document.getElementsByName("size")[1].value = height;
    rigthSide = tmpRigthSide;
    path = [];
    drawMaze(2, mainMaze);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY);
}

function findPath(maze, algtype) {
    path = [];
    var finder, f;
    var grid = new PF.Grid(height, width);
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++)
            if (maze[i][j] === 1) grid.setWalkableAt(i, j, false);
            else grid.setWalkableAt(i, j, true);
    switch (algtype) {
        case "cheb":
            {
                finder = new PF.BestFirstFinder({
                    allowDiagonal: false,
                    heuristic: PF.Heuristic.chebyshev
                });
                path = finder.findPath(shipX, shipY, exitX, exitY, grid);
                break;
            }
        case "a*":
            {
                finder = new PF.AStarFinder({
                    allowDiagonal: false
                });
                path = finder.findPath(shipX, shipY, exitX, exitY, grid);
                break;
            }
        case "rigthhand":
            {
                var trs = rigthSide;
                path.push([shipX, shipY]);
                rigthHandAlg(maze);
                shipX = path[0][0];
                shipY = path[0][1];
                rigthSide = trs;
                break;
            }
        case "wawe":
            {
                switch (metr) {
                    case "cheb":
                        {
                            waweAlg(maze, metric3);
                            break;
                        }
                    case "evk":
                        {
                            waweAlg(maze, metric2);
                            break;
                        }
                    case "city":
                        {
                            waweAlg(maze, metric1);
                            break;
                        }
                }
                break;
            }
    }
    var g = new PF.Grid(height, width);
    for (var i = 0; i < height; i++)
        for (var j = 0; j < width; j++)
            if (maze[i][j] === 1) g.setWalkableAt(i, j, false);
            else g.setWalkableAt(i, j, true);
    f = new PF.AStarFinder({
        allowDiagonal: false
    });
    tmpPath = f.findPath(shipX, shipY, exitX, exitY, g);
}

function drawPath(canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    } else {
        ctx = ctx2;
    }
    if (document.getElementById("check").checked) {
        for (var k = 0; k < path.length; k++) {
            ctx.beginPath();
            ctx.fill();
            ctx.fillStyle = "rgba(250, 250, 0, 0.3)";
            ctx.beginPath();
            ctx.arc(
                cellSize * path[k][0] + cellSize / 2,
                cellSize * path[k][1] + cellSize / 2,
                3,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }
    }
}

function clearCanvas(canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    } else {
        ctx = ctx2;
    }
    ctx.clearRect(0, 0, 112 * cellSize, 44 * cellSize);
}

//идти вперед пока не упремся в стенку
function goForward(maze) {
    switch (rigthSide) {
        case "rigth":
            {
                while (
                    maze[shipX][shipY - 1] !== 1 &&
                    !(shipX === exitX && shipY === exitY)
                ) {
                    path.push([shipX, shipY]);
                    shipY--;
                }
                break;
            }
        case "left":
            {
                while (
                    maze[shipX][shipY + 1] !== 1 &&
                    !(shipX === exitX && shipY === exitY)
                ) {
                    path.push([shipX, shipY]);
                    shipY++;
                }
                break;
            }
        case "top":
            {
                while (
                    maze[shipX - 1][shipY] !== 1 &&
                    !(shipX === exitX && shipY === exitY)
                ) {
                    path.push([shipX, shipY]);
                    shipX--;
                }
                break;
            }
        case "bottom":
            {
                while (
                    maze[shipX + 1][shipY] !== 1 &&
                    !(shipX === exitX && shipY === exitY)
                ) {
                    path.push([shipX, shipY]);
                    shipX++;
                }
                break;
            }
    }
}

//разворот после того как уперлись
function rotateShip() {
    switch (rigthSide) {
        case "rigth":
            {
                rigthSide = "top";
                break;
            }
        case "left":
            {
                rigthSide = "bottom";
                break;
            }
        case "top":
            {
                rigthSide = "left";
                break;
            }
        case "bottom":
            {
                rigthSide = "rigth";
                break;
            }
    }
}

//возникла ли петля
function loop() {
    if (path.length > 1) {
        var rep = 0;
        for (var k = path.length - 2; k > 0; k--)
            if (shipX === path[k][0] && shipY === path[k][1]) rep++;
        return rep > 4;
    } else return false;
}

function rigthHandAlg(maze) {
    goForward(maze);
    rotateShip();
    while (!loop() && (shipX !== exitX || shipY !== exitY)) {
        switch (rigthSide) {
            case "rigth":
                {
                    //идем вверх
                    if (maze[shipX + 1][shipY] !== 1) {
                        //справа пусто
                        rigthSide = "bottom";
                        shipX++;
                    } else {
                        if (maze[shipX][shipY - 1] !== 1) {
                            shipY--;
                        } else {
                            rigthSide = "top";
                        }
                    }

                    break;
                }
            case "left": //идем вниз
                if (maze[shipX - 1][shipY] !== 1) {
                    //слева пусто
                    rigthSide = "top";
                    shipX--;
                } else {
                    if (maze[shipX][shipY + 1] !== 1) {
                        shipY++;
                    } else {
                        rigthSide = "bottom";
                    }
                }
                break;

            case "top":
                {
                    //идем влево
                    if (maze[shipX][shipY - 1] !== 1) {
                        //внизу пусто
                        rigthSide = "rigth";
                        shipY--;
                    } else {
                        if (maze[shipX - 1][shipY] !== 1) {
                            shipX--;
                        } else {
                            rigthSide = "left";
                        }
                    }
                    break;
                }
            case "bottom":
                {
                    //идем вправо
                    if (maze[shipX][shipY + 1] !== 1) {
                        //внизу пусто
                        rigthSide = "left";
                        shipY++;
                    } else {
                        if (maze[shipX + 1][shipY] !== 1) {
                            shipX++;
                        } else {
                            rigthSide = "rigth";
                        }
                    }
                    break;
                }
        }
        path.push([shipX, shipY]);
    }
}

function initShip(maze) {
    var i = 0,
        j = 0;
    while (maze[i][j] === 1) {
        i = getRandomInt(2, height - 2);
        j = getRandomInt(2, width - 2);
    }
    shipX = i;
    shipY = j;
}

function initExit(maze) {
    var i = 0,
        j = 0;
    while (maze[i][j] === 1) {
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
    } else {
        ctx = ctx2;
    }
    ctx.clearRect(cellSize * i, cellSize * j, cellSize, cellSize);
    ctx.fillStyle = "red";
    ctx.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
    ctx.fillStyle = "yellow";
    switch (rigthSide) {
        case "rigth":
            {
                ctx.fillRect(cellSize * i, cellSize * j, cellSize, 4);
                break;
            }
        case "left":
            {
                ctx.fillRect(cellSize * i, cellSize * j + 12, cellSize, 4);
                break;
            }
        case "top":
            {
                ctx.fillRect(cellSize * i, cellSize * j, 4, cellSize);
                break;
            }
        case "bottom":
            {
                ctx.fillRect(cellSize * i + 12, cellSize * j, 4, cellSize);
                break;
            }
    }
}

function drawExit(i, j, canvasNumber) {
    var ctx;
    if (canvasNumber === 1) {
        ctx = ctx1;
    } else {
        ctx = ctx2;
    }
    ctx.clearRect(
        cellSize * exitX + 1,
        cellSize * exitY + 1,
        cellSize - 1,
        cellSize - 1
    );
    ctx.beginPath();
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(
        cellSize * exitX + cellSize / 2,
        cellSize * exitY + cellSize / 2,
        cellSize / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function onAlgTypeChange() {
    var inp = document.getElementsByName("algtype");
    for (var i = 0; i < inp.length; i++) {
        if (inp[i].type === "radio" && inp[i].checked) {
            alg = inp[i].value;
            break;
        }
    }
    clearCanvas(2);
    drawMaze(2, mainMaze);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 2);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
    if (alg !== "wawe") {
        document.getElementById("metrictype").style.display = "none";
    } else {
        document.getElementById("metrictype").style.display = "block";
    }
}

function onMetTypeChange() {
    var inp = document.getElementsByName("mettype");
    for (var i = 0; i < inp.length; i++) {
        if (inp[i].type === "radio" && inp[i].checked) {
            metr = inp[i].value;
            break;
        }
    }
    clearCanvas(2);
    drawMaze(2, mainMaze);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 2);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
}

function onSideChange() {
    var inp = document.getElementsByName("sidetype");
    for (var i = 0; i < inp.length; i++) {
        if (inp[i].type === "radio" && inp[i].checked) {
            rigthSide = inp[i].value;
            break;
        }
    }
    clearCanvas(2);
    drawMaze(2, mainMaze);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 2);
    findPath(mainMaze, alg);
    drawPath(2);
    drawMetric(2, mainMaze);
}

function onStartClick() {
    shipStartX = shipX;
    shipStartY = shipY;
    shipStartRigthSide = rigthSide;
    shipAnim();
}

function onStopClick() {

    clearTimeout(timer);
    shipX = shipStartX;
    shipY = shipStartY;
    rigthSide = shipStartRigthSide;
    clearCanvas(1);
    drawMaze(1, mainMaze);
    drawPath(1);
    drawMetric(1, mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 1);
    pathStep = 1;
    document.getElementById("text").innerText = (pathStep - 1) + "/" + (path.length - 3) + "    " + (tmpPath.length - 3);

}

function onPauseClick() {

    clearTimeout(timer);
}

function onCheckClick() {
    clearCanvas(1);
    drawMaze(1, mainMaze);
    drawPath(1);
    drawMetric(1, mainMaze);
    drawShip(shipX, shipY, 1);
    drawExit(exitX, exitY, 1);
    clearCanvas(2);
    drawMaze(2, mainMaze);
    drawPath(2);
    drawMetric(2, mainMaze);
    drawShip(shipX, shipY, 2);
    drawExit(exitX, exitY, 2);
}

function shipAnim() {
    if (pathStep < path.length - 1) {
        ctx1.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx1.clearRect(
            cellSize * path[pathStep - 1][0],
            cellSize * path[pathStep - 1][1],
            cellSize,
            cellSize
        );
        ctx1.beginPath();
        ctx1.fill();
        ctx1.beginPath();
        ctx1.arc(
            cellSize * path[pathStep - 1][0] + cellSize / 2,
            cellSize * path[pathStep - 1][1] + cellSize / 2,
            3,
            0,
            2 * Math.PI
        );
        ctx1.fill();
        if (path[pathStep - 1][1] === path[pathStep][1]) {
            if (path[pathStep - 1][0] < path[pathStep][0]) rigthSide = "bottom";
            else rigthSide = "top";
        }
        if (path[pathStep - 1][0] === path[pathStep][0]) {
            if (path[pathStep - 1][1] < path[pathStep][1]) rigthSide = "left";
            else rigthSide = "rigth";
        }
        drawShip(path[pathStep][0], path[pathStep][1], 1);
        document.getElementById("text").innerText = (pathStep - 1) + "/" + (path.length - 3) + "    " + (tmpPath.length - 3);
        pathStep++;
        timer = setTimeout("shipAnim();", shipSpeed);
    } else {
        document.getElementById("pausecont").style.display = 'none';
    }
}

function changeSpeed1() {
    var inp = document.getElementsByName("speed");
    shipSpeed = 1001 - inp[0].value * 10;
    inp[1].value = inp[0].value;
}

function changeSpeed2() {
    var myExp = new RegExp("(^[1-9][0-9]$)|(^100$)|([1-9])");
    var inp = document.getElementsByName("speed");
    if (myExp.test(inp[1].value)) {
        shipSpeed = 1001 - inp[0].value * 10;
        inp[0].value = inp[1].value;
    } else {
        inp[1].value = 100;
        inp[0].value = 100;
    }
}

function metric1(cell1, cell2) {
    return (
        Math.abs(cell1[0] - exitX) + Math.abs(cell1[1] - exitY) >
        Math.abs(cell2[0] - exitX) + Math.abs(cell2[1] - exitY)
    );
}

function metric2(cell1, cell2) {
    return (
        Math.sqrt(
            (cell1[0] - exitX) * (cell1[0] - exitX) +
            (cell1[1] - exitY) * (cell1[1] - exitY)
        ) >
        Math.sqrt(
            (cell2[0] - exitX) * (cell2[0] - exitX) +
            (cell2[1] - exitY) * (cell2[1] - exitY)
        )
    );
}

function metric3(cell1, cell2) {
    return (
        Math.max(Math.abs(cell1[0] - exitX), Math.abs(cell1[1] - exitY)) >
        Math.max(Math.abs(cell2[0] - exitX), Math.abs(cell2[1] - exitY))
    );
}

function waweAlg(maze, metric) {
    var cells, i, j;

    var grid = [];
    for (i = 0; i < height; i++) {
        grid[i] = [];
        for (j = 0; j < width; j++) {
            grid[i][j] = 0;
        }
    }

    i = shipX;
    j = shipY;

    function getCells(maze, i, j) {
        var neighbourhood = [];
        //право
        if (maze[i + 1][j] === 0 && grid[i + 1][j] === 0) {
            neighbourhood.push([i + 1, j]);
        }
        //лево
        if (maze[i - 1][j] === 0 && grid[i - 1][j] === 0) {
            neighbourhood.push([i - 1, j]);
        }
        //верх
        if (maze[i][j - 1] === 0 && grid[i][j - 1] === 0) {
            neighbourhood.push([i, j - 1]);
        }
        //низ
        if (maze[i][j + 1] === 0 && grid[i][j + 1] === 0) {
            neighbourhood.push([i, j + 1]);
        }
        return neighbourhood;
    }

    function loop2(cell) {
        if (path.length > 1) {
            var rep = 0;
            for (var k = path.length - 2; k > 0; k--)
                if (cell[0] === path[k][0] && cell[1] === path[k][1]) {
                    rep++;
                    if (rep === 2) break;
                }
            return rep < 2;
        } else return false;
    }

    cells = [
        [shipX, shipY]
    ];
    var stack = [],
        step = 0;
    while (!(i === exitX && j === exitY) && step < width * height / 2) {
        step++;
        if (cells.length > 0) {
            i = cells[0][0];
            j = cells[0][1];
            grid[cells[0][0]][cells[0][1]] = 1;
            stack.push(cells[0]);
            path.push(cells[0]);
            cells = getCells(maze, i, j);
            cells.sort(metric);
        } else {
            for (var k = stack.length - 1; k > -1; k--) {
                if (cells.length > 0) {
                    break;
                } else {
                    if (loop2(stack[k])) path.push(stack[k]);
                    i = stack[k][0];
                    j = stack[k][1];
                }
                cells = getCells(maze, stack[k][0], stack[k][1]);
            }
        }
    }
}