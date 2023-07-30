
//QUESTION FUNCTIONS
function setCharValueQA(key){
    let elems = document.getElementsByClassName('wordle_input');
    //el primer vacio es el objetivo
    let vacios = 0;
    let elegido = false;
    for(c=0;c<elems.length;c++){
        if(elems[c].innerText=='' && !elegido){
            elems[c].innerText=key;
            elegido = true;
        }else if(elems[c].innerText==''){
            vacios+=1;
        }
    }

    if(vacios==0){
        evalAnswer('qa');
    }

}



//arma presentacion de interface
function gameQA(game,response){

    
    let word = response.word;

    let orig = globals['QA'][globals['curQuestion']];
    validChars = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Ñ","Z","X","C","V","B","N","M"];
    //modifica layout del teclado
    const ptr = /\([0-9\.].*?\)/g;
    let matches = [...orig[1].matchAll(ptr)];
    //estos dos arreglos estan unidos por el indice, uno es el subWord y el otro el tipo, si es free or not
    //OJO en validacion de la respuesta quitar () de orig a ver si con eso

    let palabras = [];
    let typePalabras = []
    
    
    let last = false;
    for (m in matches){

        let match=matches[m];
        let long_match = match[0].length;
        if(!last && match.index>0){ //hay texto antes del primer valor
            palabras.push(orig[1].slice(0,match.index));
            typePalabras.push('free');
        }

        if (last){
            palabras.push(orig[1].slice(last,match.index));
            typePalabras.push('free');
        }

        palabras.push(orig[1].slice(match.index,match.index+long_match).replace('(','').replace(')',''));
        typePalabras.push('unfree');


        
        last = match.index+long_match;
    }
 
    palabras.push(orig[1].slice(last));
    typePalabras.push('free');


    //CREO EL ELEMENTO PARA LA PREGUNTA
    let param = createElementJS('p','param');
    param.innerText=orig[0];
    game.appendChild(param);

    //CREO UN ELEMENTO PARA LA RESPUESTA
    let resp = createElementJS('div','resp');
    

    //CREO ELEMENTOS PARA PALABRAS
    let its = palabras.length;
    let elDiv = false;
    //let temp = '';
    for(i=0;i<its;i++){
        //todas con un mismo class para join easy
        if(typePalabras[i]=='free'){ //fijas
            let elDiv = createElementJS('div','wrd_'+i,{'class':'wrdFortune'});
            for (l in palabras[i]){
                let input = createElementJS('span',i+'_'+l,{'class':'fortx_input wrdSep wrdRes'});
                input.innerText = palabras[i][l];
                elDiv.appendChild(input);
            }
            //por cada letra de la palabra
            resp.appendChild(elDiv);
        }else{ //para guess
            let elDiv = createElementJS('div','wrd_'+i,{'class':'wrdFortune'});
            for (l in palabras[i]){
                let typeLetra = 'wordle_input';
                if (validChars.indexOf(palabras[i][l])==-1){
                    typeLetra = 'fortune_input'
                }
                let input = createElementJS('span',i+'_'+l,{'class':typeLetra+' wrdRes'});
                if(typeLetra=='fortune_input'){
                    input.innerText = palabras[i][l];
                }
                elDiv.appendChild(input);
            }
            resp.appendChild(elDiv);
        }
    }
    game.appendChild(resp);
    game.appendChild(createElementJS('br','br0'));		
    game.appendChild(createElementJS('br','br0'));
}


function selectedKeyQA(name){
    if (validChars.indexOf(name)!==-1){
        setCharValueQA(name);
    }else if (name=='ENTER'){
        let elems = document.getElementsByClassName('wordle_input');
        if(elems.length>0 && elems.innerText && elems.innerText.length>0){
            evalAnswer('qa');
        }else{
            console.log('aquip en qa revisar que pasa si no hay para rellenar y se da enter');
        }
        
    }else if(name=="BACKSPACE"){
        //quita el valor del utlimo
        let elems = document.getElementsByClassName('wordle_input');
        let numEls = elems.length-1
        for(e=numEls;e>-1;e--){ // de atras para adelante
            if(elems[e].innerText!=''){
                elems[e].innerText = '';
                break;
            }
        }
    }else{
        console.log("NO No no "+name);
    }					

}

function whichWordQA(response,registro){
    response.word = registro[1];
    response.question = registro[0];
    return response;
}




//ANSWER FUNCTIONS
function evalAnswerQA(){
	let myValids = validChars.concat([' ']);
	let userRespuesta = document.getElementById('resp').innerText.toUpperCase().split('').filter(item=>myValids.includes(item)).join("").replaceAll(' ','');
	let wordRespuesta = globals['word'].toUpperCase().split('').filter(item=>myValids.includes(item)).join("").replace(' ','');
    let realResp = document.getElementById('resp').innerText.toUpperCase().split('').filter(item=>item!='\n').join("");
	if (userRespuesta==wordRespuesta){
		switchView('gameView',{'res':'win','subView':'answerView'});
	}else{
		switchView('gameView',{'res':'lost','subView':'answerView','userRes':realResp});
	}			    
}