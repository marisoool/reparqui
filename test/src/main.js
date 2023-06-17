
var globals = [];
globals['sc']=0;
globals['data'] = {};
globals['pages'] = {'homeView':false, 'gameView':false, 'dictView':false}; //lista de views del sitio
globals['numItems']=10;
globals['listener']=false;
globals['curGame']=false;

globals['curQuestion'] = 0;
globals['selectedTopics']=[];
globals['QA'] = [];
globals['correct']=0;
globals['incorrect']=0;

globals['keys_wrong']=[];
globals['keys_wrong_position']=[];
globals['keys_ok']=[];

var validChars = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Ñ","Z","X","C","V","B","N","M"];

var mainCont = document.getElementById('mainCont');
mainCont.onclick = function(){if (globals['sc']>1){this.onclick=null;switchView('homeView');}else{globals['sc']++;}};


startListeningKeyboard();

function evalKeys(){
	console.log("entra a evalKeys",globals['curGame'],globals['curView']);
	if(globals['curGame']!==false){
		for (l in validChars) {
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
				console.log(e);
			}
		}
		
	}
}

function whichWord(){	


	//So es ABREVIAtura se cambia de lugar en el QA
	if (globals['QA'][globals['curQuestion']][3]=='Abreviaturas'){
		let temp = globals['QA'][globals['curQuestion']][0];
		globals['QA'][globals['curQuestion']][0]=globals['QA'][globals['curQuestion']][1];
		globals['QA'][globals['curQuestion']][1]=temp;
	}

	let word = globals['QA'][globals['curQuestion']][0].trim();
	word = word.replace('@?@','');
	//console.log('--\>'+word);

	// si son mas de una opcion, AKA tiene una coma
	let options = word.split(",");
	options = shuffleArray(options);
	word = options[0];
	//console.log('---\>'+word);	

	//si GLOSARIO
	//ESTO ESTA MAL POR QUE LO CORRECTO ES SACAR LO QUE ESTA ENTRE @R:@ Y @:R@ SPLITEAR CON PIPE Y TOMAR LA SEGUNTA PALABRA 1 + SEGUNDA + RESTO
	if(word.indexOf('@')!==-1){
		let parts_pref = word.split('@r:@');
		let parts_suf = parts_pref[1].split('@:r@');
		let middle = parts_suf[0].split('|');
		word = parts_pref[0].trim() + ' ' + middle[1].trim() + ' ' + parts_suf[1].trim();
	}

	word = word.trim();
	globals['word']=word;
	//aqui veo que van a jugar
	let optionsGame = [];
	//optionsGame.push('flashCard');
	
	//si la palabra cumple con las caracteristicas del juego se agrega el nombre del juego a las opciones, al final se selecciona una opcion por palabra
	//para wordle requiero que sea mayor de 5 letras, 
	if (word.length>4 && word.length<12 && /^[a-zA-Z]+$/.test(word) && word.length==word.replace(" ","").length && globals['QA'][globals['curQuestion']][2]=='txt'){
		optionsGame.push('wordle');
		optionsGame.push('wordle');
		optionsGame.push('wordle');
		optionsGame.push('fortune');
	}else if(globals['QA'][globals['curQuestion']][2]=='txt'){
		optionsGame.push('fortune');
	}else if(globals['QA'][globals['curQuestion']][2]=='img'){
		alert("es imagen");
	}
	
	
	if (optionsGame.length>1){
		gameType=shuffleArray(optionsGame)[0];
	}else{
		gameType=optionsGame[0];
	}
	
	//globals['gameType']=gameType;
	
	return [word,gameType];
}

function loadQuestionView() { //carga vista de la pregunta para jugar
	//resets guesses
	globals['keys_wrong']=[];
	globals['keys_wrong_position']=[];
	globals['keys_ok']=[];
	
	
	if (document.getElementById("msjCont")){
		document.getElementById("msjCont").remove();
	}

	//MID CONTENT
	let game = document.createElement('div');
    
	//funcion me da gametype
	let gameInfo=whichWord();
	let gameType = gameInfo[1];
	let word = gameInfo[0];
	globals['curGame']=gameType;
	switch(gameType){
		case 'wordle':
			globals['curRow']=0;
			globals['curCol']=0;
			
			globals['columns'] = word.length;
			globals['rows'] = 6;
			//creo n x m inputs
			for (r=0;r<globals['rows'];r++) {
				//crea row
				let rowEl = document.createElement('div');
				rowEl.setAttribute('id','row_'+r);
				for (c=0;c<globals['columns'];c++) {
					//crea input
					let input = document.createElement('span');
					input.setAttribute('id',r+'_'+c);
					input.setAttribute('class','wordle_input');
					rowEl.appendChild(input);
				}
				game.appendChild(rowEl);
			}
		
		
		break;
		case 'fortune':
		
		//requiero n elementos de A-z validChars
		
		//ooooo de inventario de letras de la palabra y tomo al azar 4
		let allLetters = [...new Set(word.toUpperCase())].filter(item => validChars.includes(item));
		let freeLetters = [...new Set(word.toUpperCase())].filter(item => !validChars.includes(item));
		//agrego los 3 de regalo en freeLetters
		let nregalo = 3;
		if(word.length<5){
			nregalo = 1;
		}
		let regalo = shuffleArray(allLetters).slice(0,nregalo);
		let palabras = word.toUpperCase().split(' ');
		for(p in palabras){
			let elWord = createElementJS('div','wrd_'+p);
			for (l in palabras[p]){
				let input = createElementJS('span',p+'_'+l);
				
				if(freeLetters.indexOf(palabras[p][l])!==-1 || regalo.indexOf(palabras[p][l])!==-1){
					input.innerText = palabras[p][l];
					input.setAttribute('class','fort_input');
					globals['keys_ok'].push(palabras[p][l]);
				}else{
					input.setAttribute('class','wordle_input');
				}
				elWord.appendChild(input);
			}
			game.appendChild(elWord);
		}
		
		let optionKey = createElementJS('div','optReg');
		let optionKeySel = createElementJS('input','optionKey',{type:"checkbox",'value':'guessPhrase'});
		let labelKey = createElementJS('label','lblKey');
		labelKey.innerText='Adivinar frase';
		let inputGuess = createElementJS('input','guessPhraseTxt',{'type':'text','style':'display:none;'});
		optionKey.appendChild(optionKeySel);
		optionKey.appendChild(labelKey);
		optionKey.appendChild(createElementJS('br','br1'));
		optionKey.appendChild(inputGuess);
		game.appendChild(optionKey);
		
		
		//startListeningKeyboard();
		//console.log("aqui me quedo, falta, al keyup si el modo en gues letter, ve si existe la letra, si el modo en guess, se escribe la palabra");
		
		
		
		break;
		default:
		console.log("esto ya puede ser otra cosa, como imagen"+gameType);
		break;
	}
	
	//game.innerHTML=gameType+" "+word;
	
	game.setAttribute('id','game');
	document.getElementById('mid_game').innerText='';
	document.getElementById('mid_game').appendChild(game);
	document.getElementById('category').innerText = globals['QA'][globals['curQuestion']][3].toUpperCase();
	document.getElementById('ontoy').innerText = (globals['curQuestion']+1)+' de '+globals['numItems'];
	
	
	//VIRTUAL KEYBOARD
	let kbCont = createElementJS('div','kbCont');
	let rowKb = false;
	for(l=0;l<validChars.length;l++){
		if(l==0 || l==10 || l==20 || l==30){
			if (rowKb!==false){
				kbCont.appendChild(rowKb);
			}
			rowKb = createElementJS('div','kbRow_'+l,{'class':'keyRow'});
		}
		if(l==30){
			let key = createElementJS('span','kb_ENTER',{'class':'keyLetter'});	
			key.innerHTML='&nbsp;Enter&nbsp;';
			rowKb.appendChild(key);
		}		
		let key = createElementJS('span','kb_'+l,{'class':'keyLetter'});
		key.innerText=validChars[l];
		rowKb.appendChild(key);
		if(l==36){
			let key = createElementJS('span','kb_BACKSPACE',{'class':'keyLetter'});	
			key.innerHTML='&nbsp;<--&nbsp;';
			rowKb.appendChild(key);
		}


	}
	
	kbCont.appendChild(rowKb);
	game.appendChild(kbCont);
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
	
	//guess phrase
	let cbGuess = document.getElementById('optionKey');
	if(cbGuess){
		document.getElementById('optionKey').addEventListener('click',function(){
			document.getElementById('guessPhraseTxt').setAttribute('style','display:inline-block');
		});
	}
	evalKeys();
	
}

function loadGameView(values){ //crea divs define si questionpage or answer page, staarts listener keyboard
	
	if (!document.getElementById('gameView')){
		let gameCont = createElementJS('div','gameView');
		
		let hv = createElementJS('div','top_game');
		let logo = createElementJS('img','gameLogo',{'src':'src/imgs/logo.png'});
		hv.appendChild(logo);
		gameCont.appendChild(hv);
		
		let recordsCont = createElementJS('div','records');
		let categoria = createElementJS('span','category');
		let oknok = createElementJS('div','ok_nok');
		let okRec = createElementJS('span','okRec');
		let nokRec = createElementJS('span','nokRec');
		oknok.appendChild(okRec);
		oknok.appendChild(nokRec);
		let calif = createElementJS('span','calif');
		let ontoy = createElementJS('span','ontoy');
		
		recordsCont.appendChild(categoria);
		recordsCont.appendChild(oknok);
		recordsCont.appendChild(calif);
		recordsCont.appendChild(ontoy);

		gameCont.appendChild(recordsCont);
		

		let midDiv = createElementJS('div','mid_game');
		
		gameCont.appendChild(midDiv);
		
		let botCont = createElementJS('div','bot_game');	

		
		gameCont.appendChild(botCont);
		
		mainCont.appendChild(gameCont);
	}	
	
	
	if (values.subView=='answerView'){
		setTimeout(loadAnswerView(values), 8000);
	}else{
		//uso un timer para ver si ya se cargo el QA
		let myTimer = setInterval(function(){
		//console.log(globals['QA']);
			if (globals['QA']!='undefined'){
				clearInterval(myTimer);
				loadQuestionView();
			}
		},500);

	}		

	
}

function evalQuestion(game) {

	if(game=='fortune'){
		//evalua que todas las letras de 
		
		let myValids = validChars.concat([' ']);
		let userRespuesta = document.getElementById('guessPhraseTxt').value.toUpperCase().split('').filter(item=>myValids.includes(item));
		let wordRespuesta = globals['word'].toUpperCase().split('').filter(item=>myValids.includes(item));
		
		if (userRespuesta.join("")==wordRespuesta.join("")){
			switchView('gameView',{'res':'win','subView':'answerView'});
		}else{
			switchView('gameView',{'res':'lost','subView':'answerView'});
		}		
	}else{
		//console.log("entra aqui pero solo aploica a wordle");
		//TODO: si la palabra no es valida osea no esta en ningun lado del json, mensaje nonono
		
		globals['anims'] = [];
		let correctLetters = 0;
		//Convierte palabre que si es en un arreglo
		let arrWord = globals['word'].toUpperCase().split('');
		//trae todos los valores de la row
		let rowCont = document.getElementById('row_'+globals['curRow']).innerText;
		let numContent = rowCont.length;
		let validTerms = term[numContent];
		if (validTerms.indexOf(rowCont)==-1){
			alert("Word not in dictionary");
		}else{

			//por cada columna
			for (x=0;x<globals['columns'];x++){
				//selecciona el elemento
				let curLetterEl = document.getElementById(globals['curRow']+'_'+x);
				//califica
				if(arrWord[x]==curLetterEl.innerText){
					globals['keys_ok'].push(arrWord[x]);
					curLetterEl.className += " wordle_ok wordle_hide";
					correctLetters++;
				}else if (arrWord.indexOf(curLetterEl.innerText)!==-1){
					globals['keys_wrong_position'].push(curLetterEl.innerText);
					curLetterEl.className += " wordle_almost wordle_hide";
				}else{
					globals['keys_wrong'].push(curLetterEl.innerText);
					curLetterEl.className += " wordle_nok wordle_hide";
				}
				
				globals['anims'].push(curLetterEl.animate(
						 [
							// keyframes			
							{ transform: "scaleY(0)"},
							{ transform: "scaleY(-1)"},
						  ],
						  { delay: 150*x, duration: 250, iterations: 1, easing: "ease-out",id:globals['curRow']+"_"+x}
						  ) 
				);
			}
			
			let c = 0;
			for (a in globals['anims']){
				if (c<(globals['columns']-1)){
					globals['anims'][a].finished.then(
					(value) => {					
						let elem = document.getElementById(value.id);
						elem.className = elem.className.replace(' wordle_hide','');
						
					  },
					  function(error) { /* code if some error */ }
					);
				
				}else{
					globals['anims'][a].finished.then(
					
					function(value) { 
						let elem = document.getElementById(value.id);
						elem.className = elem.className.replace(' wordle_hide','');
						if (correctLetters==globals['columns']){
								switchView('gameView',{'res':'win','subView':'answerView'});
						}else{
							//TODO: si last row :(
							if (globals['curRow']==globals['rows']-1){
								switchView('gameView',{'res':'lost','subView':'answerView'});
							}else{
								globals['curRow']++;
								globals['curCol']=0;
							}
						}
					  },
					  function(error) { /* code if some error */ }
					);
				
				}
				c++;
			}
		}
		evalKeys();
	}
}


function resetStates(){	
	
	globals['curGame']=false;
	globals['curCol']=0;
	globals['curRow']=0;
}

function loadAnswerView(vals){
	resetStates();
	globals['curGame']=false;
	//console.log(vals.res);
	document.getElementById("game").remove();
	let mainCont = document.getElementById('mid_game');
	
	//crea un contenedor general para facil remove
	let msjCont = createElementJS('div','msjCont');
	
	let msj = createElementJS('div','msjAns');
	let textMsj = createElementJS('h2','titAn');
	if (vals.res=='win') {
		msj.setAttribute('id','msjOK');
		textMsj.innerText = 'Muy bien!!!';
		globals['correct']++;
	}else{
		msj.setAttribute('id','msjNOK');
		textMsj.innerText = 'Uppppps!!!';
		globals['incorrect']++;
	}
	
	document.getElementById('okRec').innerText = globals['correct'];
	document.getElementById('nokRec').innerText = globals['incorrect'];
	document.getElementById('calif').innerText = "Calificación: "+(globals['correct']*100)/globals['numItems'];
	
	
	
	msj.appendChild(textMsj);
	msjCont.appendChild(msj);
	
	//Elementos del termino
	let desc = createElementJS('div','desc');
	let concept = createElementJS('H4','concept');
	concept.innerText=globals['word'];
	desc.appendChild(concept);
	let detailShort = createElementJS('p','detAn');
	detailShort.innerText=globals['QA'][globals['curQuestion']][1];
	desc.appendChild(detailShort);
	
	msjCont.appendChild(desc);
	
	//elementos botones
	let botonera = createElementJS('div','btnAn');
	let btnExit = createElementJS('button','btnExit');
	btnExit.innerText = 'Salir';
	btnExit.onclick = function() {
		switchView('homeView');
	};
	botonera.appendChild(btnExit);
	
	let btnNext = createElementJS('button','btnNext');
	btnNext.innerText = 'Siguiente';
	btnNext.onclick = function() {
		globals['curGame']=false;
		//TODO si ya es el ultimo resumenQuiz
		globals['curQuestion']+=1;
		if (globals['curQuestion']==globals['QA'].length){
			alert("se va a resumen del quiz");
			switchView('resQuiz');
		}else{
			loadQuestionView();
		}
	};
	botonera.appendChild(btnNext);
	
	msjCont.appendChild(botonera);
	mainCont.appendChild(msjCont);
	document.getElementById('btnNext').focus();
}

function switchView(curView,values={}){
	//console.log(curView);
	globals['curView']=curView;
	switch(curView){
		case 'gameView':
			loadGameView(values);
			break;
		default:
			curView='homeView';
			loadHomeView();
			break;
	}
	
	for (v in globals['pages']){
		//console.log(v);
		let page = document.getElementById(v);;
		if (page){
			if (v==curView){
				page.className='cShow';
			}else{
				page.className='cHide';
			}			
		}

	}
}

function button_click(){
	if (this.className == "temaBtnSel"){
		this.className = "temaBtn";
		//console.log(globals['selectedTopics'].indexOf(this.id))
		nselectedTopics = globals['selectedTopics'].slice(0,globals['selectedTopics'].indexOf(this.id)).concat(globals['selectedTopics'].slice(globals['selectedTopics'].indexOf(this.id)+1,globals['selectedTopics'].lenght));
		globals['selectedTopics'] = nselectedTopics;
	}else{
		globals['selectedTopics'].push(this.id);
		this.className="temaBtnSel";
	}
}

function loadHomeView(){
	if (!document.getElementById('homeView')){
		let homeCont = createElementJS('div','homeView');
		let hv = createElementJS('div','top');
		let logo = createElementJS('img','hlogo',{'src':'src/imgs/logo.png'});
		
		hv.appendChild(logo);
		homeCont.appendChild(hv);

		let botonera = createElementJS('div','mid');
		for (db in dbLists){
			let btn = createElementJS('button',db);
			btn.textContent = dbLists[db]['name'];
			btn.className = "temaBtn";
			btn.addEventListener("click", button_click);
			botonera.appendChild(btn);
		}	
		
		homeCont.appendChild(botonera);
		
		let startCont = createElementJS('div','bot');
		let msj = createElementJS('div',"menuErr");
		msj.className='cHide';
		let startBtn = createElementJS('button','startBtn');
		startBtn.innerText = 'START';
		
		startCont.appendChild(startBtn);
		startBtn.addEventListener("click",start_game);
		homeCont.appendChild(msj);
		homeCont.appendChild(startCont);
		
		mainCont.appendChild(homeCont);
	}
}

function start_game(){
	let numItems = globals['numItems'];
	let msj = document.getElementById('menuErr');
    let selectedTopics = globals['selectedTopics'];
	let numSel = selectedTopics.length; //NUMERO TOPICS SELECCIONADOS
	if (numSel > 0) {
		msj.className='cHide';
		let numByQuiz = Math.floor(numItems/numSel);
		selectedTopics = shuffleArray(selectedTopics); //SHUFFLE TEMAS
		let curSelected = 1; // para saber cuantos ya se han seleccionado
		
		for (i in selectedTopics){
			let info = dbLists[selectedTopics[i.toString()].toString()]				
			// aqui si es el ultimo se recalcula por que por el floor pueden ser menos
			//console.log(curSelected,' == ',numSel);
			if (curSelected==numSel) {
				numByQuiz = numItems - (numByQuiz*(numSel-1));
				//console.log("entra a ultimo que es "+info.name+" que se van a sacar "+numByQuiz);
			}
		

			
			// si es valor single toma numByQuiz o resto si es el ultimo
			if (!isLiteralObject(dbLists[selectedTopics[i.toString()].toString()].valor)) {
				let scr = document.createElement('script');
				scr.setAttribute('src','src/data/'+info.ref+'/data.js');
				document.body.appendChild(scr);
				scr.onload=function(){
					let dataTits = Object.keys(data);
					let randomData = shuffleArray(dataTits);
					let selTits = randomData.slice(0,numByQuiz);
					for (x in selTits){
						let idx = selTits[x];
						globals['QA'].push([idx,data[idx],info.type,info.name]);
					}
				};
				
			}else{ // tiene subdatas
				let numKeys = Object.keys(info.valor).length; //numero subdatas
				
				//GENERO UNA LISTA DE LOS VALORES DE CADA SUBCONJUTNO DE DATOS letra_indiceKeyValores
				let allValues = [];
				for (l in info.valor){
					for (v=0;v<info.valor[l];v++){
						allValues.push(l+"_"+v);
					}
				}
				
				let selectedRows = shuffleArray(allValues).slice(0,numByQuiz);
				//DE LOS SELECCIONADOS HAGO UNA LISTA DE SUBCONJUNTOS que se van a emplear, con los indices de las rows de ese subconjunto que se necesita
				let listaSubconjuntos = [];
				for (l in selectedRows){
					let parts = selectedRows[l].split("_");
					try{
						listaSubconjuntos[parts[0]].push(parts[1]);
					}catch{
						listaSubconjuntos[parts[0]]=[parts[1]];
					}
						
				}
				
				for(l in listaSubconjuntos){ // por cada letra en subconjuntos seleccionados, carga letra, lee y selecciona los afortunados
					let items = listaSubconjuntos[l];
					let scr = document.createElement('script');
					scr.setAttribute('src','src/data/'+info.ref+'/'+l+'.js');
					document.body.appendChild(scr);
					scr.onload=function(){
						let dataTits = Object.keys(data);								
						for (vx=0;vx<items.length;vx++){ // por cada row seleccionada
							let conc = dataTits[items[vx]];
							globals['QA'].push([conc,data[conc],info.type,info.name]);
						}
					};							
				}
			}

			curSelected++;
		}
	}else{
		msj.className='cShow';
	}
	
	//Revolvemos preguntas
	globals['QA'] = shuffleArray(globals['QA']);
	//cambiamos de vista
	switchView('gameView',{'subView':'questionView'});
	//console.log("falta, que si no estan todas las letras en linea al enter avise, que se metan palabras reales, funcion delay o sleep, watever it loses or win, answer, remove listener or at list set some global to listen=false and if at function");

}

function setCharValueWordle(key){
	//console.log("setCharValueWordle",key);
	if (globals['curCol']<globals['columns']){
		//globals[curRow]++;
		let spanEl = document.getElementById(globals['curRow']+'_'+globals['curCol']);
		spanEl.innerText = key;
		spanEl.setAttribute('class','wordle_input');			
		globals['curCol']++;
	}
}

function setCharValueFortune(key){
	
	//FALTA QUE, SOLO SE TENGANR 4 CHANCES O MENOS SI SON POCAS LETRAS, ADEMAS DE QUE AL COMPLETAR LAS LETRAS SE MANDE A SIGUIENTE CON WIN O LOSE
	//TAMBIEN FALTA QUE SE PONGA EL INPUT Y AL ENTER COMPARE SE MANDA A WIN O LOSE
	
	let allLetters = [...new Set(globals['keys_ok'].concat(globals['keys_wrong'].concat(globals['keys_wrong_position'])))].filter(item => validChars.includes(item));
	//console.log(allLetters);
	let lettersWord = [...new Set(globals['word'].toUpperCase())];
	
	//si todavia tiene chances
	let nregalo = 3;
	if(globals['word'].length<5){
		nregalo = 1;
	}
	let chances = Math.floor((globals['word'].length*.1)*3);
	//console.log(globals['word'].length,allLetters.length,'<',nregalo+chances);
	if((allLetters.length<=chances+nregalo)){
		//si ya esta en algun arreglo registrado ya sea wrong wrong pos o ok, no hace nada y es valido el char y esta en la palabra
		if (allLetters.indexOf(key)==-1 && validChars.indexOf(key)!==-1){
			if (lettersWord.indexOf(key)!==-1){
				let palabras = globals['word'].toUpperCase().split(' ');
				for(p in palabras){
					for (l in palabras[p]){
						if(palabras[p][l]==key){
							let elemOK = document.getElementById(p+'_'+l);
							elemOK.innerText=palabras[p][l];
						}
					}
				}
				//asigna a los arreglos globales
				globals['keys_ok'].push(key);
			}else{
				globals['keys_wrong'].push(key);
			}
			//colorea teclado
			evalKeys();
			
		}
		if(allLetters.length==chances+nregalo){
			let cbGuess = document.getElementById('optionKey');
			//cbGuess.checked=true;
			cbGuess.click();
			cbGuess.setAttribute('disabled','disabled');
			document.getElementById('guessPhraseTxt').focus();
			document.getElementById('guessPhraseTxt').select();
		}
	}
	
}


function selectedKey(name){
	if(globals['curGame']=='wordle'){
		//console.log("wordle");
		//si es valido
		if (validChars.indexOf(name)!==-1){
			setCharValueWordle(name);
		}else if (name=='ENTER'){
			evalQuestion();
		}else if(name=="BACKSPACE"){
			globals['curCol']--;
			if(globals['curCol']<0){
				globals['curCol']=0;
			}
			for (x=globals['curCol'];x<globals['columns'];x++){
				document.getElementById(globals['curRow']+'_'+x).innerText = '';
			}
		}else{
			console.log("NO No no "+name);
		}			
	}else if(globals['curGame']=='fortune'){
		
		//tengo un key de entrada
		let elemChecked = document.getElementById('optionKey');
		if (elemChecked.checked){
			if (name=='ENTER'){
				evalQuestion('fortune');
			}
		}else{
			
			if (validChars.indexOf(name)!==-1){
				setCharValueFortune(name);
			}else if (name=='ENTER'){
				evalQuestion();
			}else{
				console.log("NO No no "+name);
			}					
		}

		
		
	}	
	//evalua si wrong, wrong pos o es ok
	//console.log('selected keys',name);
	//evalKeys();
}


//Fisher-yates algorithm, regresa un arreglo en orden aleatorio
function shuffleArray(array){
	let x = array.length-1;
	for (i = x; i>0; i--){
		// i es el indice del arreglo comienza de atras a 0
		const j = Math.floor(Math.random() * (i+1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

//comienza a escuchar el teclado

function startListeningKeyboard(){
	globals['listener'] = document.addEventListener('keyup', (event) => {
		if (globals['curGame']!==false){
			var name = event.key;
			name = name.toUpperCase();		
			selectedKey(name);
		}
	  // Alert the key name and key code on keydown
	  
	}, false);		
}
	
//checa si es diccionario o arreglo

function isLiteralObject(a){
	return (!!a) && (a.constructor === Object);
}

function createElementJS(typeEl, idEl,extra=false){
	let elem = document.createElement(typeEl);
	elem.setAttribute('id',idEl);
	if(extra){
		for (e in extra){
			elem.setAttribute(e,extra[e]);		
		}
	}
	
	return elem;
}
