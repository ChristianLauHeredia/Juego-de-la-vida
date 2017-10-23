var cellSize = 8;   //Tamaño de la célula
var numCells = 50;  //Cantidad de células
var generation = 0; //Número de la generación
var liveCells = 0;  //Células vivas
var play = false;    //Estado de la reproducción (true = ejecutar)(false = detener)
var ms = 200;       //Velocidad en milisegundos
var canvas = document.getElementById('myCanvas');
canvas.width = cellSize*numCells;
canvas.height = cellSize*numCells;
var context = canvas.getContext('2d');
var universe = buildUniverse();
var record = buildUniverse(); //Crea un array para que se utilizará para llevar el historial del espacio habitado

//Crea un array el cual será el universo en donde existirán las células que se inician con un valor 0 / muertas 
function buildUniverse() {
        var universe = [];
        for(var i = 0; i<numCells; i++) {
                var innerUniverse = [];
                for(var j = 0; j<numCells; j++) {
                        innerUniverse.push(0);
                }
                universe.push(innerUniverse);
        }
        return universe;
}

//Se dibujan las células en el monitor
function display(universe) {
        for(var x = 0; x < universe.length; x++) {
                for(var y = 0; y < universe[x].length; y++) {
                        drawCell(x,y,record[x][y],true);
                        drawCell(x,y,universe[x][y],false);
                }
        }
}
display(universe);

//Dibuja la "célulla"
function drawCell(x,y,alive,record) {
       context.beginPath();
       context.arc(x*cellSize, y*cellSize, cellSize/2, 0, 2 * Math.PI);
       //Si está viva la pinta de azul, si está muerta la pinta de gris y si nunca ha estado habidata la pinta del gris más oscuro
       if (record) 
       context.fillStyle = alive ? '#323232' : '#212121';
       else
       context.fillStyle = alive ? '#14FFEC' : '';
       context.fill();

}

//Se puebla el universo de forma aleatoria
function randomlyPopulate(universe) {
        for(var x = 0; x < universe.length; x++) {
                for(y = 0; y < universe[x].length; y++) {
                        universe[x][y] = Math.round(Math.random()-.3);//Le quito 3 décimas a lo que regresa el random para que tenga menos probabilidad de vivir y que el universo no esté sobre poblado
                        if (universe[x][y]) {
                            record[x][y]= universe[x][y];
                            liveCells++;
                        }
                }
        }
        document.getElementById("generation").innerHTML = generation;   
        document.getElementById("liveCells").innerHTML = 0;           
}

//Cuento las células vivas que rodean a una célula
function aliveNeighbors(universe, x, y) {
        if(x > 0 && y > 0 && x < numCells-1 && y < numCells-1) {
                var totalAlive =
                        universe[x-1][y-1]+ //universeiba izquierda
                        universe[x][y-1]+   //universeiba 
                        universe[x+1][y-1]+ //universeiba derecha
                        universe[x-1][y]+   //izquierda
                        universe[x+1][y]+   //derecha
                        universe[x-1][y+1]+ //abajo izquierda
                        universe[x][y+1]+   //abajo
                        universe[x+1][y+1]; //abajo derecha
                return totalAlive;
        } else {
                return 0;
        }
}

//Aquí evalúo si nace, se mantiene o muere una célula según las reglas de Conway
function nextGeneration(universe) {
        var newUniverse = buildUniverse();
        liveCells = 0;  //Establezco en 0 las células vivas para poder volver a contar
        for(var x = 0; x < universe.length; x++) {
                for(var y = 0; y < universe[x].length; y++) {
                        var cell = universe[x][y];
                        var alives = aliveNeighbors(universe, x,y);
                        //Si vive se agrega al contador de células vivas y guardo su posición en la variable record 
                        if(cell == 1) {
                                if(alives < 2) {
                                        newUniverse[x][y] = 0;
                                } else if(alives == 2 || alives == 3) {
                                        newUniverse[x][y] = 1;
                                        record[x][y] = 1;
                                        liveCells++;
                                } else if(alives > 3) {
                                        newUniverse[x][y] = 0;
                                }
                        } else if(cell == 0 && alives == 3) {
                                newUniverse[x][y] = 1;
                                record[x][y] = 1;
                                liveCells++;
                        }
                }
        }
        delete universe
        return newUniverse;
}

//Mando a llamar a la función que puebla el universo
randomlyPopulate(universe);      

//Al hacer click en "Play" se inicia la simulación
//Al hacer click en "Pause" se limpia el intervalo y se detiene la animación
function start(d){
    if (play){
        clearInterval(this.interval);
        d.innerHTML='Play';
        play = false;
    } else {
        display(universe);
        document.getElementById("liveCells").innerHTML = liveCells;   
        d.innerHTML='Pause';
        play = true;
        runInterval();
    }
}

//Intervalo que dibuja la simulación
function runInterval(){
    this.interval=setInterval(function(){
                var newUniverse = nextGeneration(universe);
                generation++; //Añado una generación
                document.getElementById("generation").innerHTML = generation;
                display(newUniverse);
                document.getElementById("liveCells").innerHTML = liveCells;           
                universe = newUniverse;
    },ms);
}

//Cambio la velocidad del intervalo
function changeMS(ms){
    this.ms = ms*10;
    clearInterval(this.interval);
    if (play) {
        runInterval();
    }
}

//Limpio los arrays de universo y record, así como los contadores que utilizo y el intervalo. Después muestro el universo en blanco y vuelvo a repoblar random para el siguiente Start
function clearUniverse(){
    document.getElementById("start").innerHTML='Play';
    play = false;
    generation = 0;
    liveCells = 0;
    clearInterval(this.interval);    
    universe = buildUniverse();
    record = buildUniverse();
    context.clearRect(0, 0, canvas.width, canvas.height);
    display(universe);
    randomlyPopulate(universe);
}