addEventListener("load", (event) => {
    loadData();
    document.getElementById('filtro').addEventListener("change", (event)=>{
        loadData();
    });    
});

const bits = ["Cigarro","Comida","Refresco","Chatarra"];

let botsDiv = document.getElementById('botsDiv');
for (b in bits){
    let text = bits[b];
    let elem = createElementJS('button',{id:text});
    elem.innerText = text;
    elem.addEventListener("click", (event)=>{
        let info = new Date();
        record = info.getDay()+'/'+info.getMonth()+'/'+info.getFullYear()+'_'+info.getHours()+':'+info.getMinutes()+':'+info.getSeconds();
        addRecord(event.target.id,record);
    });
    botsDiv.append(elem);
}

function createElementJS(typeEl, extra=false){
	let elem = document.createElement(typeEl);
	if(extra){
		for (e in extra){
			elem.setAttribute(e,extra[e]);		
		}
	}
	return elem;
}

function addRecord(varName,info){
    let curValue = localStorage.getItem(varName);
    console.log(curValue,varName);
    if (curValue === null) {
        curValue = '';
    }
    localStorage.setItem(varName,curValue+'@'+info);
    loadData();
}


function loadData(){
    let typeReport = document.getElementById('filtro').value;
    let listReport = document.getElementById("list");
    let allValues = {};
    for (b in bits){
        //aqui iria el filtro por bits si no en selected no lo hace
        let infoBit = localStorage.getItem(bits[b]);
        if (infoBit !== null) {
            let records = infoBit.split('@');
            for(r in records){
                let parts = records[r].split("_");
                if(parts[0].length>0){
                    if(allValues[parts[0]]===undefined){
                        allValues[parts[0]]=[[bits[b],parts[1]]];
                    }else{
                        allValues[parts[0]].push([bits[b],parts[1]]);
                    }
                }
            }
        }        
    }

    if(typeReport=='Dia'){
        for (x in allValues){
            let lista = createElementJS('ul');
            //por cada registro en el dia
            for (r in allValues[x]){
                let item = createElementJS('li');
                item.innerText = allValues[x][r][1] + '->' + allValues[x][r][0];
                lista.append(item);
            }
            listReport.append(lista);
        }
    }

    console.log(allValues);
}


