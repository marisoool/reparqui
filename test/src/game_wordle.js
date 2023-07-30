//QUESTION FUNCTIONS

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


function gameWordle(game,response){

    let word = response.word;

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
}

function selectedKeyWordle(name){
		//console.log("wordle");
		//si es valido
		if (validChars.indexOf(name)!==-1){
			setCharValueWordle(name);
		}else if (name=='ENTER'){
			evalAnswer('wordle');
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
}



//ANSWER FUNCTIONS

function evalAnswerWordle(){
		//console.log("entra aqui pero solo aploica a wordle");
		//TODO: si la palabra no es valida osea no esta en ningun lado del json, mensaje nonono
		
		globals['anims'] = [];
		let correctLetters = 0;
		//Convierte palabre que si es en un arreglo
		let arrWord = globals['word'].toUpperCase().split('');
		//trae todos los valores de la row
		let rowCont = ''
		try{
			rowCont = document.getElementById('row_'+globals['curRow']).innerText;
		}catch(e){
			console.log(e);
			
		}
		
		//si es brand new osea es el primer wordle y todo esta vacio
		let esPrimera = document.getElementById('row_0').innerText.length;

		if (esPrimera > 0){

			let numContent = rowCont.length;
			let validTerms = term[numContent];
			if (validTerms && validTerms.indexOf(rowCont)==-1 && rowCont!=globals['word'].toUpperCase()){
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
		}else{
			console.log("se hizo enter pero esta vacio, tons nada");
		}


}