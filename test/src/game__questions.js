
function loadQuestionView() { //carga vista de la pregunta para jugar
	globals['showVirtualKeyboard'] = true;
	//resets guesses, sin guesses al inicio, esto sirve para el teclado si pone verde amarillo o oxford
	globals['keys_wrong']=[];
	globals['keys_wrong_position']=[];
	globals['keys_ok']=[];
	
	/*
	if (document.getElementById("msjCont")){
		document.getElementById("msjCont").remove();
	}
*/

	if(first===true){
		hold();
		first = false;
	}else{
	//funcion me da gametype
		whichWord();
	}
	
}

//DETERMINA LOS DATOS QUE VAN EN LA PREGUNTA
//TODO: PERO ESTE SE TENDRA QUE DIVIDIR POR QUE CADA TIPO DE JUEGO TIENE SUS BEMOLES
function hold(){

	var interval = setInterval(function() {
		
		if( globals['QA'] == "undefined" || globals['QA'] == ""){
			console.log("loading")
		}else{

			/* Esto mas alla de que sea por tipo de game, es por tipo de dato que se esta recibiendo, por lo tanto no tiene nada que ver con los games
			, dicho esto, trataremos de mejorarlo. Felices trazos XD */

			//lo que si es que el formato se estandariza por que no estaba asi jajajajajaj
	//Revolvemos preguntas
	//console.log(Object.keys(globals['QA']));
	globals['QA'] = shuffleArray(globals['QA']);
	//console.log(Object.keys(globals['QA']));			
			whichWord();
			clearInterval(interval);
			showLoading();


		}
		}, 1000);


}


function whichWord(){

	let registro = globals['QA'][globals['curQuestion']];
	let response = Object.create({});

	response.word=registro[0];
	response.categoria=registro[3];
	response.type=registro[2];
	response.ref = registro[4];

	//ABREVIATURA se cambia de lugar en el QA
	if (globals['QA'] && registro[3]=='Abreviaturas'){
		response.word = registro[1];
		response.question = registro[0];
	}

	//GLOSARIO
	if (globals['QA'] && globals['QA'][globals['curQuestion']][3]=="Glosario"){
		//--- limpia estos caracteres que vienen en algunas palabras que requieren revision
		response.word = response.word.replace('@?@','');
		//--- si trae sinonimos la definicion, separados por coma, se crea lista y se selecciona uno
		let options = response.word.split(",");
		options = shuffleArray(options);
		response.word = options[0];
		//--- anotaciones de la palabra maestra @
		if(response.word.indexOf('@')!==-1){
			let parts_pref = response.word.split('@r:@');
			let parts_suf = parts_pref[1].split('@:r@');
			let middle = parts_suf[0].split('|');
			response.word = parts_pref[0].trim() + ' ' + middle[1].trim() + ' ' + parts_suf[1].trim();
		}
	}

	
	//que tipo de juego es
	let optionsGame = [];
	//optionsGame.push('flashCard');
	//optionsGame.push('wordle');
	
	//si la palabra cumple con las caracteristicas del juego se agrega el nombre del juego a las opciones, al final se selecciona una opcion por palabra
	//para wordle requiero que sea mayor de 5 letras, 
	if (response.word.length>4 && response.word.length<12 && /^[a-zA-Z]+$/.test(response.word) && response.word.length==response.word.replace(" ","").length && globals['QA'][globals['curQuestion']][2]=='txt'){
		optionsGame.push('wordle');
		optionsGame.push('wordle');
		optionsGame.push('wordle');
		optionsGame.push('fortune');
	}else if(globals['QA'][globals['curQuestion']][2]=='txt'){
		optionsGame.push('fortune');
	}else if(globals['QA'][globals['curQuestion']][2]=='qa'){
		optionsGame=['qa'];
	}else if(globals['QA'][globals['curQuestion']][2]=='img'){
		optionsGame=['img'];
	}
	let gameType = '';
	//define tipo de juego
	if (optionsGame.length>1){
		gameType=shuffleArray(optionsGame)[0];
	}else{
		gameType=optionsGame[0];
	}

	

	//MODIFICA LAS WORD POR CASO
	switch (gameType){
		case 'qa':
			response = whichWordQA(response,registro);
			break;
		case 'fortune':
			response = whichWordFortune(response);
			break;
		case 'img':
			response = whichWordImg(response,registro);
			break;
	}

	response.word = response.word.trim();

	//que pasa si lo siguiente lo dejo comentado, se friega jajaja, por que hay otras funciones que usan el word desde globals
	globals['word']=response.word;

	response.gameType = gameType;
		

	//MID CONTENT
	let game = document.createElement('div');

	gameType = response.gameType;
	globals['curGame']=gameType;

	//para modificar el layout del teclado
	positions = [20,26];
	validChars = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Ñ","Z","X","C","V","B","N","M"];
	switch(gameType){
		case 'wordle':
            gameWordle(game,response);
		break;
		case 'fortune':
            gameFortune(game,response);
		break;
		case 'qa':
			positions=[30,36];
			gameQA(game,response);
		break;
		case 'img':
			gameIMG(game,response);
			break;
		default:
		console.log("esto ya puede ser otra cosa, como imagen"+gameType);
		break;
	}
	
	game.setAttribute('id','game');
	document.getElementById('mid_game').innerText='';
	document.getElementById('mid_game').appendChild(game);
	document.getElementById('category').innerText = globals['QA'][globals['curQuestion']][3].toUpperCase();
	document.getElementById('ontoy').innerText = (globals['curQuestion']+1)+' de '+globals['numItems'];
	
	if(globals['showVirtualKeyboard']){
		createVirtualKeyboard(game,positions);
	}
	//guess phrase FORTUNE ONLY MOVE carefully
	let cbGuess = document.getElementById('optionKey');
	if(cbGuess){
		document.getElementById('optionKey').addEventListener('click',function(){
			let adivina = document.getElementById('guessPhraseTxt');
			adivina.setAttribute('style','display:inline-block');
			let cbGuess = document.getElementById('optionKey');
			cbGuess.checked=true;
			cbGuess.setAttribute('disabled','disabled');
			adivina.focus();
			adivina.select();			
		});
	}

    
	evalKeys();

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// REFERENTES AL KEYBOARD /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createVirtualKeyboard(game,positions){

	let kbCont = createElementJS('div','kbCont');
	let rowKb = false;
	for(l=0;l<validChars.length;l++){
		if(l==0 || l==10 || l==20 || l==30){
			if (rowKb!==false){
				kbCont.appendChild(rowKb);
			}
			rowKb = createElementJS('div','kbRow_'+l,{'class':'keyRow'});
		}
		if(l==positions[0]){
			let key = createElementJS('span','kb_ENTER',{'class':'keyLetter'});	
			key.innerHTML='&nbsp;Enter&nbsp;';
			rowKb.appendChild(key);
		}		
		let key = createElementJS('span','kb_'+l,{'class':'keyLetter'});
		key.innerText=validChars[l];
		rowKb.appendChild(key);
		if(l==positions[1]){
			let key = createElementJS('span','kb_BACKSPACE',{'class':'keyLetter'});	
			key.innerHTML='&nbsp;<--&nbsp;';
			rowKb.appendChild(key);
		}


	}
	
	kbCont.appendChild(rowKb);
	game.appendChild(kbCont);

    //crea events del VIRTUAL KEYBOARD
	let boxes = document.querySelectorAll('.keyLetter');
	boxes.forEach(box => {
	  box.addEventListener('click', function handleClick(event) {
		 let id = this.getAttribute('id').replace('kb_','');
		 if (id!='BACKSPACE' && id!='ENTER'){
			id = validChars[id];
		 }
		selectedKey(id);
	  });
	});
}

//ESTO ES PARA COLOREAR CORRECTAS, MEDIO CORRECTAS E INCORRECTAS EN VIRTUAL KEYBOARD
function evalKeys(){
	if(globals['curGame']!==false){
		for (l in validChars) { //por cada letra en el teclado = validChars
			let letra = validChars[l];
			let newClass = "";
			if(globals['keys_wrong'].indexOf(letra)!==-1){
				newClass = 'keys_wrong';
			}else if(globals['keys_wrong_position'].indexOf(letra)!==-1){
				newClass = 'keys_wrong_position';
			}else if(globals['keys_ok'].indexOf(letra)!==-1){
				newClass = 'keys_ok';
			}
			try{
				let keyElement = document.getElementById('kb_'+l);
				keyElement.setAttribute('class',keyElement.getAttribute('class')+" "+newClass);
			}catch(e){
				//console.log(e);
			}
		}
	}
}

//called by even virtual keyboard lQV
//ACCIONES AL PRESS DEL USUARIO, ES PARA RESPUESTA PARCIAL, POR ESO SE QUEDA AQUI Y NO EN Q__A
//SIN EMBARGO SU ACCION ES DEPENDIENTE DEL TIPO DE JUAGEO A CADDA UNO SE LE ASIGNA SU METODO
function selectedKey(name){
	if(globals['curGame']=='wordle'){
        selectedKeyWordle(name);
	}else if(globals['curGame']=='fortune'){
		selectedKeyFortune(name);		
	}else if(globals['curGame']=='qa'){
		selectedKeyQA(name);	
	}
	//evalua si wrong, wrong pos o es ok
	//console.log('selected keys',name);
}