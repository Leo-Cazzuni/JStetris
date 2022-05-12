let CANVAS_X = 600;
let CANVAS_Y = 600;
let GRID_X = 150;
let GRID_Y = 50;

let mode = 0
let score = 40
let FRAMES = 60;
let DROP_SPEED = 50;
let SOFTDROP = 1;
let PREESS_SPEED = 1;
let ARROW_WAIT = 7;
let arrow_c = 0
let sombra = true;

let pecas = ['S','Z','L','J','T','I','O'];
let grupo1 = [];
let grupo2 = [];
let hold_p = -1;
let rungame =true;
let t0;
let t1;
let span;

let grid
let peca

function nova_peca(){

	if (grupo2.length==0){
		aux = shuffle(pecas);
		for (let i = aux.length - 1; i >= 0; i--) {
			grupo2.push(new Peca(aux[i],GRID_X,GRID_Y,3,1,sombra))
		}
	}
	if (grupo1.length==0){
		grupo1=grupo2;
		grupo2=[];
		aux = shuffle(pecas);
		for (let i = aux.length - 1; i >= 0; i--) {
			grupo2.push(new Peca(aux[i],GRID_X,GRID_Y,3,1,sombra))
		}
	}

	// tipo = pecas[Math.floor(Math.random() * pecas.length)];
	// npeca = new Peca(tipo,GRID_X,GRID_Y);

	npeca = grupo1.pop();
	npeca.j=-1;
	if (grid.colisao(npeca)){
		inicializar();
		return peca;
	}
	return npeca;
}

function inicializar(){
	grupo1 = [];
	grupo2 = [];
	hold_p = -1;
	grid = new Grid(GRID_X,GRID_Y);

	if(mode==1){
		grid.mat=copy_matrix(chalenge_map)
		grupo1 = monta_grupo(['I','I','S','T','O','L'])
		score = 13
	}

	peca = nova_peca()
	rungame = true
	t0 = performance.now();
	loop();

}

function setup() {
	canvas = createCanvas(CANVAS_X,CANVAS_Y)
	inicializar()
}

function draw() {
	// console.log(frameRate());
	background(color(BG));

	if (frameCount%DROP_SPEED==0){
		if(!peca.move(0,1)){
			grid.add(peca);
			grid.check_line();
			if(grid.score>=score){
				pause_game();
			}
			peca = nova_peca();
		}
	}

	if (keyIsDown(LEFT_ARROW) && frameCount%PREESS_SPEED==0){
		arrow_c++;
		if (arrow_c > ARROW_WAIT)
			peca.move(-1);
	}
	if (keyIsDown(RIGHT_ARROW) && frameCount%PREESS_SPEED==0){
		arrow_c++;
		if (arrow_c > ARROW_WAIT)
			peca.move(1);
	}
	if (keyIsDown(DOWN_ARROW) && frameCount%SOFTDROP==0){
		peca.move(0,1);
	}

	grid.draw();
	peca.draw();
	if(hold_p!=-1)
		hold_p.draw(0,0,false);
	draw_predict();

	fill(255)
	tempo = performance.now()-t0;
	mili = floor(tempo/10)%100
	seg = floor(tempo/1000)%60;
	minuto = floor(tempo/(60*1000));
	textSize(32);
	// fill(Yellow)
	text(minuto+':'+ seg + ':' + mili, 20 + grid.x+(grid.WIDTH*grid.CELL_SIZE), grid.y+(grid.HEIGHT*grid.CELL_SIZE));
	text(grid.score, grid.centro_x, 35);
}

function keyPressed() {

	// print(keyCode)

	switch(keyCode){
		case (LEFT_ARROW):
		  	peca.move(-1);
			break

		case (RIGHT_ARROW):
			peca.move(1);
			break

		case (UP_ARROW):
			peca.rotate(1);
			break

		case (90):
			peca.rotate(2);
			break

		case (88):
			peca.rotate(-1);
			break

		case (32):
			if(rungame){
				peca.hard_drop();
				grid.add(peca)
				grid.check_line();
				if(grid.score>=score){
					pause_game();
				}
				peca = nova_peca();
			}
			break

		case (13):
			inicializar()
			break
			
		case (16):
			peca=hold(peca)
			break
	}
}

function keyReleased() {

	switch(keyCode){
	case (LEFT_ARROW):
	case (RIGHT_ARROW):
	case (DOWN_ARROW):
		arrow_c=0;

	}

}

function draw_predict(){

	let distx;

	for (var i = grupo1.length - 1; i >= 0; i--) {
		distx = grid.CELL_SIZE*(grid.WIDTH-grupo1[i].i+1)
		if(grupo1[i].tipo=='O'){
			grupo1[i].draw(distx,(grupo1.length*50)-(50*i)-70-20,0,0,false);
		}else{
			grupo1[i].draw(distx,(grupo1.length*50)-(50*i)-70,0,0,false);
		}
	}

	for (var j = grupo2.length - 1; j > grupo1.length; j--) {
		distx = grid.CELL_SIZE*(grid.WIDTH-grupo2[j].i+1)
		if(grupo2[j].tipo=='O'){
			grupo2[j].draw(distx,(grupo1.length*50)-(50*j)+300-20,0,0,false);
		}else{
			grupo2[j].draw(distx,(grupo1.length*50)-(50*j)+300,0,0,false);
		}
	}

}

function hold(peca){
	if (hold_p==-1){
		hold_p = peca;
		hold_p.x=grid.x-90;
		hold_p.y=grid.y;
		hold_p.i=0;
		hold_p.j=0;
		hold_p.rot = 0;
		return nova_peca();
	} else{
		aux = peca;

		peca = hold_p;
		peca.x=grid.x;
		peca.y=grid.y;
		peca.i=3;
		peca.j=-1;

		hold_p = aux;
		hold_p.x=grid.x-90;
		hold_p.y=grid.y;
		hold_p.i=0;
		hold_p.j=0;
		hold_p.rot = 0;

		return peca;
	}
}

function pause_game(){
	if(rungame){
		t1=performance.now();
		tempo = createElement('h1',(floor(t1-t0)/1000).toString())
		tempo.parent(span)
		tempo.class('fonteclass')
		noLoop();

	}else{
		inicializar();
	}	
	
	rungame = !rungame;
}

function copy_matrix(currentArray){
	var newArray = [];
	for (var i = 0; i < currentArray.length; i++)
    	newArray[i] = currentArray[i].slice();
	return newArray
}

chalenge_map =	[
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	[ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
	['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',  0 , 'T'],
	['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',  0 , 'T'],
	['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',  0 , 'T'],
	['T', 'T', 'T', 'T', 'T', 'T',  0 ,  0 ,  0 ,  0 ],
	['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',  0 , 'T'],
	['T', 'T',  0 ,  0 , 'T', 'T', 'T', 'T', 'T', 'T'],
	['T',  0 ,  0 , 'T', 'T', 'T', 'T', 'T', 'T', 'T'],

	['T', 'T', 'T', 'T', 'T', 'T',  0 ,  0 , 'T', 'T'],
	['T', 'T', 'T', 'T', 'T',  0 ,  0 ,  0 , 'T', 'T'],
	['T', 'T', 'T', 'T', 'T', 'T',  0 , 'T', 'T', 'T'],
	['T', 'T', 'T', 'T', 'T', 'T',  0 ,  0 , 'T', 'T'],
	['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',  0 ],
	['T', 'T', 'T', 'T', 'T', 'T', 'T',  0 ,  0 ,  0 ]
]

function monta_grupo(array){
	let grupo = []

	for (var i = array.length - 1; i >= 0; i--) {
		grupo2.push(new Peca(array[i],GRID_X,GRID_Y,3,1,sombra))	
	}

	return grupo
}