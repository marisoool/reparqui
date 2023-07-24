
var validChars = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Ñ","Z","X","C","V","B","N","M"];

//called by main.js:switchView
function loadGameView(values){ //crea divs define si questionpage or answer page, staarts listener keyboard
	if (!document.getElementById('gameView')){
		let gameCont = createElementJS('div','gameView');
		let hv = createElementJS('div','top_game');
		let logo = createElementJS('img','gameLogo',{'src':'src/imgs/logo.png'});
		hv.appendChild(logo);
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
		hv.appendChild(recordsCont);
		gameCont.appendChild(hv);
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
			if (globals['QA']!='undefined'){
				clearInterval(myTimer);
				loadQuestionView();
			}
		},500);
	}		
	
}

//Called by event click main:startButton
function startGame(){
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
			
			// si es valor single toma (no tiene subdata) numByQuiz o resto si es el ultimo
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


