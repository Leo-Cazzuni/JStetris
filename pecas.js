let CELL_SIZE = 20; 		//20
let	HEIGHT = 20; 	//20
let	WIDTH = 10;		//10

let BG			= [40, 42, 54 ];
let Cinza		= [68, 71, 90 ];
let Cizazul		= [68, 71, 90 ];
let White		= [248,248,242];
let Bluish		= [98, 114,164];
let Cyan 		= [139,233,253];
let Green 		= [80, 250,123];
let Pink 		= [255,121,198];
let Orange 		= [255,184,108];
let Purple		= [189,147,249];
let Red			= [255,85, 85 ];
let Yellow		= [241,250,140];


function tipo_cor(tipo){
	switch(tipo){
		case ('J'):
			return color(Bluish)
			break
		
		case ('L'):
			return color(Orange)
			break
		
		case ('S'):
			return color(Green)
			break
		
		case ('Z'):
			return color(Red)
			break
		
		case ('T'):
			return color(Pink)
			break
		
		case ('I'):
			return color(Cyan)
			break
		
		case ('O'):
			return color(Yellow)
			break
	}
}

function dentro_grid(i,j,	height = HEIGHT,width = WIDTH){
	if (i>=0 && i<width && j<height && j>=0)
		return true
	return false
}

class Grid{

	HEIGHT = HEIGHT;
	WIDTH = WIDTH;
	CELL_SIZE = CELL_SIZE;
	GRID_COLOR = Cinza;
	BG_COLOR = BG;
	ESPESSURA = 1;

	constructor(x=0,y=0){
		this.x = x;
		this.y = y;
		this.mat= Array(this.HEIGHT).fill().map(() => Array(this.WIDTH).fill(0));
		// this.pecas=[];
		this.score = 0;
		this.centro_x = floor(x+((this.WIDTH*this.CELL_SIZE)/2));
		this.centro_y = floor(y+((this.HEIGHT*this.CELL_SIZE)/2));
	}

	draw(){
		for (var i = 0; i < this.HEIGHT; i++) {
			for (var j = 0; j < this.WIDTH; j++) {
				fill(this.BG_COLOR);
				stroke(this.GRID_COLOR);
				strokeWeight(this.ESPESSURA);
				if(this.mat[i][j]!=0){
					fill(tipo_cor(this.mat[i][j]));
					noStroke();
				}
				rect(this.x+(j*this.CELL_SIZE),this.y+(i*this.CELL_SIZE),this.CELL_SIZE,this.CELL_SIZE);
			}
		}
	}

	move(x,y){
		this.x += x;
		this.y += y;		
	}

	move_to(x,y){
		this.x = x;
		this.y = y;
	}

	add(peca){
		for (var i=0; i<peca.perm[peca.rot].length; i++){
			for (var j=0; j<peca.perm[peca.rot].length; j++){
				if (peca.perm[peca.rot][i][j]){
					if(dentro_grid(peca.i+j,peca.j+i))
					this.mat[peca.j+i][peca.i+j]=peca.tipo;
				}
			}
		}
	}

	colisao(peca){
		for (var i=0; i<peca.perm[peca.rot].length; i++){
			for (var j=0; j<peca.perm[peca.rot].length; j++){
				if (peca.perm[peca.rot][j][i]){
					if (peca.i+i<0 || peca.i+i>=grid.WIDTH || peca.j+j>=grid.HEIGHT){
						return true;
					}else if(dentro_grid(peca.i+i,peca.j+j) && this.mat[peca.j+j][peca.i+i]){
						return true;
					}
				}
			}			
		}
		return false;
	}

	check_line(){
		let lines =[];
		let c = 0;
		for (var i = peca.perm[peca.rot].length - 1; i >= 0; i--) {
			c = 0;
			for (var j = this.WIDTH - 1; j >= 0; j--) {
				if(i+peca.j>=0 &&  i+peca.j<this.HEIGHT){
					if(this.mat[i+peca.j][j]!=0)
						c++;
				}
				if (c ==this.WIDTH)
					lines.push(i+peca.j);
			}
		}
		if (lines.length>0){
			this.clear_line(lines)
			this.score+=lines.length;
		}
	}
	
	clear_line(lines){
		for (var i = lines.length-1; i >= 0; i--) {
			for (var j = this.WIDTH - 1; j >= 0; j--) {
				this.mat[lines[i]][j]=0
			}

			for (var k = lines[i]; k > 0; k--) {
				for (var j = this.WIDTH - 1; j >= 0; j--) {
					this.mat[k][j]=this.mat[k-1][j];
					this.mat[k-1][j]=0;
				}
			}
		}
	}
}


class Peca{

	CELL_SIZE = CELL_SIZE;
	STROKE = 0;
	STROKE_COR = color(0,0,0);

	constructor(tipo,x=0,y=0,i=3,j=-1,sombra=true){
		this.tipo = tipo;
		this.perm = perm_mat(tipo);
		this.cor = tipo_cor(tipo);
		this.rot = 0;
		this.x=x;
		this.y=y;
		this.i=i; // eixo x
		this.j=j; // eixo y
		this.sombra = sombra;
	}

	draw_peca(offset_x=0,offset_y=0,offset_i=0,offset_j=0){

		for (var k = 0; k < this.perm[this.rot].length; k++) {
			for (var l = 0; l < this.perm[this.rot].length; l++) {
				if (this.perm[this.rot][k][l] && k+this.j+offset_j>=0){
					rect(this.x+((l+this.i+offset_i)*this.CELL_SIZE)+offset_x,this.y+((k+this.j+offset_j)*this.CELL_SIZE)+offset_y,this.CELL_SIZE,this.CELL_SIZE);
				}
			}
		}
	}

	draw(offset_x=0,offset_y=0,offset_i=0,offset_j=0,sombra=this.sombra){
		this.make_color();
		this.draw_peca(offset_x,offset_y, offset_i, offset_j);
		if(sombra){
			this.make_color(true);
			peca.draw_peca(offset_x, offset_y, offset_i, offset_j + peca.drop_height());
		}
	}

	make_color(sombra=false){
		fill(this.cor);
		stroke(this.STROKE_COR);
		strokeWeight(this.STROKE);
		if(sombra){
			// let c=this.cor
			// c.levels[3]*=.1;
			fill(255,0,0);
		}
	}

	move(x=0,y=0){
		this.i+=x;
		this.j+=y;
		if(grid.colisao(peca)){
			this.i-=x;
			this.j-=y;
			return false;
		}
		return true;
	}

	hard_drop(){
		this.j++;
		while(!grid.colisao(peca)){
			this.j++;
		}
		this.j--;
	}

	rotate(r){
		if(this.rot+r < 0){
			this.rotate(r+this.perm.length)
		} else if (this.rot+r >= this.perm.length) {
			this.rotate(r-this.perm.length)
		} else {
			this.rot+=r;

			// Mudar condicao para escolher uma posicao adequada e nao impedir a rotacao
			if(grid.colisao(peca)){
				if(!this.slide()){
					this.rot-=r;
				}
			}	
		}
	}

	slide(){
		let k = floor(this.perm[0].length/2);
		for (var i = k; i >= -k ; i--) {
			for (var j = -k; j <= k ; j++) {
				if(this.move(j,i)){
					return true;
				}
				this.move(-i,-j);
			}	
		}
		return false;
	}

	drop_height(){
		let j=this.j;
		this.j++;
		while(!grid.colisao(peca)) this.j++;
		let c=this.j-j-1;
		this.j=j;
		return c;
	}

}

// CONDIÇÃO: mat das peças tem q ser quadrada

function perm_mat(tipo){

	Jperm = [

			[[1,0,0],
			 [1,1,1],
			 [0,0,0]],

			[[0,1,1],
			 [0,1,0],
			 [0,1,0]],

			[[0,0,0],
			 [1,1,1],
			 [0,0,1]],

			[[0,1,0],
			 [0,1,0],
			 [1,1,0]]

			];

	Lperm = [

			[[0,0,1],
			 [1,1,1],
			 [0,0,0]],

			[[0,1,0],
			 [0,1,0],
			 [0,1,1]],

			[[0,0,0],
			 [1,1,1],
			 [1,0,0]],

			[[1,1,0],
			 [0,1,0],
			 [0,1,0]]

			];

	Tperm = [

			[[0,1,0],
			 [1,1,1],
			 [0,0,0]],

			[[0,1,0],
			 [0,1,1],
			 [0,1,0]],

			[[0,0,0],
			 [1,1,1],
			 [0,1,0]],

			[[0,1,0],
			 [1,1,0],
			 [0,1,0]]

			];

	Sperm = [

			[[0,1,1],
			 [1,1,0],
			 [0,0,0]],

			[[0,1,0],
			 [0,1,1],
			 [0,0,1]],

			[[0,0,0],
			 [0,1,1],
			 [1,1,0]],

			[[1,0,0],
			 [1,1,0],
			 [0,1,0]]

			];

	Zperm = [

			[[1,1,0],
			 [0,1,1],
			 [0,0,0]],

			[[0,0,1],
			 [0,1,1],
			 [0,1,0]],

			[[0,0,0],
			 [1,1,0],
			 [0,1,1]],

			[[0,1,0],
			 [1,1,0],
			 [1,0,0]]

			];

	Iperm = [

			[[0,0,0,0],
			 [1,1,1,1],
			 [0,0,0,0],
			 [0,0,0,0]],

			[[0,0,1,0],
			 [0,0,1,0],
			 [0,0,1,0],
			 [0,0,1,0]],

			[[0,0,0,0],
			 [0,0,0,0],
			 [1,1,1,1],
			 [0,0,0,0]],

			[[0,1,0,0],
			 [0,1,0,0],
			 [0,1,0,0],
			 [0,1,0,0]]

			];

	Operm = [

			[[0,0,0],
			 [0,1,1],
			 [0,1,1]],

			];


	switch(tipo){
		case 'J':
			return Jperm;
			break;

		case 'L':
			return Lperm;
			break;
		
		case 'S':
			return Sperm;
			break;
		
		case 'Z':
			return Zperm;
			break;
		
		case 'I':
			return Iperm;
			break;
		
		case 'T':
			return Tperm;
			break;
		
		case 'O':
			return Operm;
			break;
	}
}