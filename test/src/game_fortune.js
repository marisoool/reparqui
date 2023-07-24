//	QUESTION FUNCTIONS
function setCharValueFortune(key){
	
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
		globals['f_chances']++;
		if(chances-globals['f_chances']==0){
			let cbGuess = document.getElementById('optionKey');
			//cbGuess.checked=true;
			cbGuess.click();
			cbGuess.setAttribute('disabled','disabled');
			document.getElementById('guessPhraseTxt').focus();
			document.getElementById('guessPhraseTxt').select();
		}else{
			let allRows = document.getElementsByClassName('wrdFortune');
			palabras = [];
			for (r in allRows){
				palabras.push(r.innerText);
			}
			if (globals['word']==palabras.join(" ")){
				cbGuess.click();
				document.getElementById('guessPhraseTxt').innerText=palabras.join(" ");
				document.getElementById('kb_ENTER').click();
				
			}
			
		}
        if(allLetters<0){
            let allSpans = [...new Set(document.getElementsByClassName('fortSpan'))];
            if(allSpans==allLetters){
                alert("no la cierres verifica en g_fort ln 64 hirrrrrrr fcs");
            }
        }
	}


	let quedan = chances - globals['f_chances'];
	document.getElementById('chancesRecord').innerText=''+(quedan)+" de "+(chances)+' oportunidades';
	
}


function gameFortune(game,response){

    let word = response.word;
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
        let elWord = createElementJS('div','wrd_'+p,{'class':'wrdFortune'});
        for (l in palabras[p]){
            let input = createElementJS('span',p+'_'+l);
            
            if(freeLetters.indexOf(palabras[p][l])!==-1 || regalo.indexOf(palabras[p][l])!==-1){
                input.innerText = palabras[p][l];
                input.setAttribute('class','fort_input fortSpan');
                globals['keys_ok'].push(palabras[p][l]);
            }else{
                input.setAttribute('class','wordle_input fortSpan');
            }
            elWord.appendChild(input);
        }
        game.appendChild(elWord);
    }
    
    let optionKey = createElementJS('div','optReg');
    optionKey.appendChild(createElementJS('br','br0'));
    let optionKeySel = createElementJS('input','optionKey',{type:"checkbox",'value':'guessPhrase'});
    let labelKey = createElementJS('label','lblKey');
    labelKey.innerText='Adivinar frase';
    let inputGuess = createElementJS('input','guessPhraseTxt',{'type':'text','style':'display:none;'});
    let chances = createElementJS('span','chancesRecord');
    optionKey.appendChild(optionKeySel);
    optionKey.appendChild(labelKey);
    optionKey.appendChild(chances);
    optionKey.appendChild(createElementJS('br','br1'));
    optionKey.appendChild(inputGuess);
    game.appendChild(optionKey);
    
    
    
    globals['f_chances']=0;
    let chances2 = Math.floor((word.length*.15)*3);
    chances.innerText=chances2+' oportunidades.';		    

}

function selectedKeyFortune(name){
		//tengo un key de entrada
		let elemChecked = document.getElementById('optionKey');
		if (elemChecked.checked){
			if (name=='ENTER'){
				evalAnswer('fortune');
			}
		}else{
			
			if (validChars.indexOf(name)!==-1){
				setCharValueFortune(name);
			}else if (name=='ENTER'){
				evalAnswer();
			}else{
				console.log("NO No no "+name);
			}					
		}

}

function whichWordFortune(response){
    response.word = response.word.replace('—',' — ').replace('/',' / ');
    return response;
}


//ANSWER FUNCTIONS

function evalAnswerFortune(){
	//evalua que todas las letras de 
	
	let myValids = validChars.concat([' ']);
	let userRespuesta = document.getElementById('guessPhraseTxt').value.toUpperCase().split('').filter(item=>myValids.includes(item));
	let wordRespuesta = globals['word'].toUpperCase().split('').filter(item=>myValids.includes(item));
	
	if (userRespuesta.join("")==wordRespuesta.join("")){
		switchView('gameView',{'res':'win','subView':'answerView'});
	}else{
		switchView('gameView',{'res':'lost','subView':'answerView'});
	}			
}