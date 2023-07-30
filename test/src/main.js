//leave prevention
window.onbeforeunload = () => {
	return true;
  };
  
//Setups
var mainCont = document.getElementById('mainCont');
mainCont.onclick = function(){if (globals['sc']>1){this.onclick=null;switchView('homeView');}else{globals['sc']++;}};

//indicadores
var first = true;


startListeningKeyboard();








function resetStates(){	
	
	globals['curGame']=false;
	globals['curCol']=0;
	globals['curRow']=0;
	globals['temp']={};
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
		startBtn.addEventListener("click", startGame);
		homeCont.appendChild(msj);
		homeCont.appendChild(startCont);
		
		mainCont.appendChild(homeCont);
	}
}

function showLoading(){
	let loadView = document.getElementById('loadingView');
	if(!loadView){
		loadView = createElementJS('div','loadingView');
		loadView.innerHTML='<svg version="1.1" id="L6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">   <rect fill="none" stroke="#fff" stroke-width="4" x="25" y="25" width="50" height="50">  <animateTransform     attributeName="transform"     dur="0.5s"     from="0 50 50"     to="180 50 50"     type="rotate"     id="strokeBox"     attributeType="XML"     begin="rectBox.end"/>  </rect>   <rect x="27" y="27" fill="#fff" width="46" height="50">  <animate     attributeName="height"     dur="1.3s"     attributeType="XML"     from="50"      to="0"     id="rectBox"      fill="freeze"     begin="0s;strokeBox.end"/>  </rect></svg><br><div>Loading quiz</div>';
		mainCont.appendChild(loadView);		
		loadView.style.display='block'
	}else{
		console.log(loadView.style.display);
		if(loadView.style.display!='none'){
			loadView.style.display='none';
			document.body.style.overflow = 'visible';
		}else{
			loadView.style.display='block'
			document.body.style.overflow = 'hidden';
		}
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
