
//arma presentacion de interface
function gameIMG(game,response){
    //esconde el keyboard
    globals['showVirtualKeyboard'] = false;
    let word = response.word;
    //let opciones = Object.keys(keys);
    //retiro de las opciones la respuesta
    //opciones.indexOf(word);
    //crea botones de 5 de las opciones seleccionadas de opciones menos la respuesta, pa que no salga nombre
    //el boton al click se manda la respuesta 


    //CREO EL ELEMENTO PARA LA IMAGEN
    let param = createElementJS('img','q_img',{'src':response.src});
    game.appendChild(param);

    //CREO LOS BOTONES DEl QUIZZ
    let options = 3; //cantidad de opciones adicionales a la respuesta
    //scar 3 indices del arreglo que no sean la respuesta
    //primero sacar la respuesta y ya tomar la muestra
    let opcionesResp = globals['cats'][response.categoria];
    let posResp = opcionesResp.indexOf(word); 
    let preArray = [];
    let posArray = [];
    //saco las opciones anteriores a respuesta
    if(posResp!==0){
        preArray = opcionesResp.slice(0,posResp);
    }
    //saco las opciones posteriores a respuesta
    if(posResp!==opcionesResp.length-1){
        posArray = opcionesResp.slice(posResp+1,opcionesResp.length)
    }
    
    opcionesResp = preArray.concat(posArray);

    //Saco la muestra
    opcionesResp = shuffleArray(opcionesResp).slice(0,options);
    //vuelvo a sortear pa que no quede siempre al inicio o al final
    opcionesResp = shuffleArray(opcionesResp.concat([word]));

    //CREO EL ELEMENTO PARA LAS OPCIONES
    let divOpciones = createElementJS('div','q_opc');
    //hago un input oculto para no cambiar mucho el proceso
    divOpciones.appendChild(createElementJS('input','res_img',{'class':'cHide'}));

    divOpciones.appendChild(createElementJS('br','br0'));
    //HTML genero botones de las opciones
    for(o in opcionesResp){
        let optionBtn = createElementJS('button','btn_'+o,{'type':'button','value':opcionesResp[o]});
        optionBtn.innerText = opcionesResp[o].replace('_',' ').toUpperCase();
        optionBtn.addEventListener("click", function(){
            //obtengo valor del boton
            console.log(this.value);
            let myImput = document.getElementById('res_img').value=this.value;
            evalAnswer('img');
        });
        divOpciones.appendChild(optionBtn);
        divOpciones.appendChild(createElementJS('br','br0'));	
    }
    game.appendChild(divOpciones);
    game.appendChild(createElementJS('br','br0'));		
    game.appendChild(createElementJS('br','br0'));    
}


function whichWordImg(response,registro){
    let src = registro[1].split("/").slice(-2).join("/");
    midPath = +response.word+'/';

    response.src = 'src/data/'+response.ref+'/'+src;
    response.orig = response
    response.word = response.word.replaceAll('_',' ').toUpperCase();
    return response;
}



//FUNCIONES ANSWER
function evalAnswerImg(){
	
	let userRespuesta = document.getElementById('res_img').value.toUpperCase().split('').filter(item=>validChars.includes(item)).join("").replace(' ','');
	let wordRespuesta = globals['word'].toUpperCase().split('').filter(item=>validChars.includes(item)).join("").replace(' ','');
    
	if (userRespuesta==wordRespuesta){
		switchView('gameView',{'res':'win','subView':'answerView'});
	}else{
		switchView('gameView',{'res':'lost','subView':'answerView','userRes':userRespuesta});
	}			    
}
