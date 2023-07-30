
function loadAnswerView(vals){
	console.log(vals);
	if(vals.userRes){
		console.log(vals.userRes); //lo que se puso, hacer el comparativo
	}
	let curGame = globals['curGame'];
	resetStates();
	globals['curGame']=false;
	document.getElementById("game").remove();
	let mainCont = document.getElementById('mid_game');
	
	//crea un contenedor general para facil remove
	let msjCont = createElementJS('div','msjCont');
	
	if (vals.res=='win') {
		classRef = 'correct';
		globals['correct']++;
	}else{
		classRef = 'incorrect';
		globals['incorrect']++;
	}
	
	document.getElementById('okRec').innerText = globals['correct'];
	document.getElementById('nokRec').innerText = globals['incorrect'];
	//document.getElementById('calif').innerText = "Calificación: "+(globals['correct']*100)/globals['numItems'];
	
	//msjCont.appendChild(msj);
	
	//Elementos del termino






	//gametype dependant
	let desc = createElementJS('div','desc');
	let concept = createElementJS('H4','concept',{'class':classRef});
	if(curGame=='qa'){
		concept.innerText=globals['QA'][globals['curQuestion']][0];
	}else{
		concept.innerText=globals['word'];
	}
	
	desc.appendChild(concept);

	let detailShort = createElementJS('p','detAn',{'class':'f_content'});
	let content = globals['QA'][globals['curQuestion']][1];
	if(curGame=='qa'){
		content = content.split('(','').join("").split(')','').join();
	}

	detailShort.innerHTML=content;
	desc.appendChild(detailShort);
	
	msjCont.appendChild(desc);
	







	//BOTONES DE NAVEGACION
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
	
	window.scrollTo(0,0);
	
	//BOTONES ABAJO A LOCAL STORAGE

	//barra etiquetas fav err remove
	let botonesFlotantes = createElementJS('div','btnFloat');
	let breakP = createElementJS('br');
	let btnFav = createElementJS('button','btnFav');
	btnFav.innerText = 'FAV';
	let btnErr = createElementJS('button','btnErr');
	btnErr.innerText = 'ERR';
	let btnRem = createElementJS('button','btnRem');
	btnRem.innerText = 'REM';
	//acciones click
	btnFav.addEventListener('click', function handleClick(event) {
		if (localStorage.getItem("myFavs") === null) {
			localStorage.setItem("myFavs",'');
		}
		let myFavs = localStorage.getItem('myFavs');
		myFavs+='|'+globals['QA'][globals['curQuestion']];
		localStorage.setItem("myFavs",myFavs);
	});
	
	btnErr.addEventListener('click', function handleClick(event) {
		if (localStorage.getItem("myErrs") === null) {
			localStorage.setItem("myErrs",'');
		}
		let myErrs = localStorage.getItem('myErrs');
		myErrs+='|'+globals['QA'][globals['curQuestion']];
		localStorage.setItem("myErrs",myErrs);
	});	
	
	btnRem.addEventListener('click', function handleClick(event) {
		if (localStorage.getItem("myRems") === null) {
			localStorage.setItem("myRems",'');
		}
		let myRems = localStorage.getItem('myRems');
		myRems+='|'+globals['QA'][globals['curQuestion']];
		localStorage.setItem("myRems",myRems);
	});

	botonesFlotantes.appendChild(btnFav);
	botonesFlotantes.appendChild(btnErr);
	botonesFlotantes.appendChild(btnRem);
	
	mainCont.appendChild(breakP);
	mainCont.appendChild(botonesFlotantes);
}




function evalAnswer(game) {

	if(game=='fortune'){
		evalAnswerFortune();
	}else if(game=='wordle'){
		evalAnswerWordle();
	}else if(game=='qa'){
		evalAnswerQA();
	}else if(game=='img'){
		evalAnswerImg();
	}
}
