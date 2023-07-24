//leave prevention
window.onbeforeunload = () => {
	return true;
  };
  
//Setups
var mainCont = document.getElementById('mainCont');
mainCont.onclick = function(){if (globals['sc']>1){this.onclick=null;switchView('homeView');}else{globals['sc']++;}};


startListeningKeyboard();








function resetStates(){	
	
	globals['curGame']=false;
	globals['curCol']=0;
	globals['curRow']=0;
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
		startBtn.addEventListener("click",startGame);
		homeCont.appendChild(msj);
		homeCont.appendChild(startCont);
		
		mainCont.appendChild(homeCont);
	}
}

function switchView(curView,values={}){
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
