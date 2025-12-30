"use strict"
//const btn = document.querySelector("button[id='addTask']");
console.log("collegato");


const btn = document.getElementById("addTask");
const formAddTask = document.getElementById("overlay");
let editON =false;
let editTaskId = null;

if(btn)
btn.addEventListener("click",(event)=>{
    event.preventDefault();
    console.log("clicked");
    btn.style.backgroundColor ="#0b7515ff"
    editON = false;
    editTaskId = null;
    formaddingTask.reset();
    
    // Cambia titolo
    document.querySelector("#overlay h3").innerText = "Adding Task";;
    formAddTask.classList.add("show");
    
    
});

const annullaBtn = document.getElementById("cancel");
annullaBtn.addEventListener("click",()=>{
     formAddTask.classList.remove("show");
     editON =false;
     editTaskId = null;
     formaddingTask.reset();
});

function renderTasks(task){
        const li = document.createElement('li');
        const div = document.createElement('div');
        const div2 = document.createElement('div');
        const input = document.createElement('input');
        const label = document.createElement('label');

        const div3 = document.createElement('div');
        div3.innerHTML =`
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-person-square" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                  </svg>
        `;
        const svgperson = div3.querySelector("svg");
        const divPerSvgdele = document.createElement('div');
        divPerSvgdele.innerHTML = ` 
            <svg xmlns="http://www.w3.org/2000/svg" name ='delete' width="1.5em" height="1.5em" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 445 511.78">
                <path fill="red" fill-rule="nonzero" d="M122.53 496.61h199.94c14.62 0 27.64-5.93 37.21-15.49 9.88-9.89 16.13-23.63 16.75-38.73l12.62-305.34H55.95l12.62 305.33c.62 15.11 6.87 28.85 16.75 38.74 9.57 9.56 22.59 15.49 37.21 15.49zm93.6-295.06c0-4.19 3.4-7.59 7.58-7.59 4.19 0 7.59 3.4 7.59 7.59v230.57c0 4.18-3.4 7.58-7.59 7.58-4.18 0-7.58-3.4-7.58-7.58V201.55zm85.67.03c-.01-4.17 3.36-7.57 7.52-7.59 4.17-.01 7.57 3.36 7.59 7.53l1.38 230.56a7.558 7.558 0 01-7.52 7.59c-4.17.01-7.56-3.36-7.58-7.52l-1.39-230.57zm-175.09 0a7.558 7.558 0 017.52-7.59 7.565 7.565 0 017.58 7.53l1.39 230.56c.01 4.17-3.36 7.57-7.52 7.59-4.17.01-7.57-3.36-7.59-7.52l-1.38-230.57zM36.88 61.56h109.24V47.48c0-13.07 5.35-24.94 13.95-33.54C168.66 5.34 180.54 0 193.6 0h57.8c13.06 0 24.94 5.34 33.53 13.94 8.6 8.6 13.95 20.47 13.95 33.54v14.08h109.24c10.15 0 19.37 4.15 26.05 10.83l.44.47C441.03 79.51 445 88.53 445 98.44v31.02c0 4.19-3.4 7.59-7.58 7.59h-33.24l-12.64 305.93c-.79 19.06-8.68 36.39-21.14 48.86-12.32 12.31-29.08 19.94-47.93 19.94H122.53c-18.85 0-35.61-7.63-47.93-19.94-12.46-12.47-20.35-29.81-21.14-48.86L40.8 137.05H7.58c-4.18 0-7.58-3.4-7.58-7.59V98.44C0 88.31 4.15 79.1 10.83 72.42c6.68-6.71 15.9-10.86 26.05-10.86zm371.24 15.16H36.88c-5.97 0-11.4 2.45-15.33 6.39a21.542 21.542 0 00-6.39 15.33v23.44H429.84V98.44c0-5.81-2.3-11.1-6.03-15.01l-.36-.32c-3.93-3.94-9.36-6.39-15.33-6.39zM251.4 15.16h-57.8c-8.88 0-16.96 3.64-22.81 9.5-5.86 5.86-9.5 13.94-9.5 22.82v14.08h122.42V47.48c0-8.88-3.64-16.96-9.5-22.82-5.85-5.86-13.93-9.5-22.81-9.5z"/>
            </svg>
            `;
        const divPerEditSvg = document.createElement('div');
        divPerEditSvg.innerHTML=`
                <svg height="1.4em" width="1.4em"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                       name ='edit'  viewBox="0 0 512 512" xml:space="preserve">
                <path style="fill:#DD539C;" d="M505.842,130.44L443.7,68.299L381.559,6.158c-9.099-9.101-24.973-7.982-35.449,2.495L239.856,114.905
                    l32.955,32.955l45.663,45.665l45.665,45.661l32.955,32.955L503.35,165.889C513.827,155.412,514.944,139.539,505.842,130.44z"/>
                <path style="fill:#EFC377;" d="M85.444,426.555L6.828,347.934c-4.373,4.373-6.825,10.295-6.828,16.48l0.003,55.312v68.969
                    c0,6.438,2.61,12.262,6.825,16.478c4.218,4.215,10.044,6.825,16.478,6.825h68.966l55.314,0.002c6.182,0,12.11-2.458,16.478-6.825
                    L85.444,426.555z"/>
                <polygon style="fill:#F4D944;" points="364.141,239.189 318.475,193.525 272.812,147.863 239.858,114.905 6.828,347.934 
                    85.444,426.555 164.064,505.175 397.094,272.141 "/>
                <path style="fill:#ECB555;" d="M0.003,488.693c0,6.439,2.61,12.262,6.825,16.478l78.617-78.617L6.828,347.934
                    c-4.373,4.373-6.825,10.295-6.828,16.48l0.003,55.312V488.693z"/>
                <polygon style="fill:#F1CC30;" points="318.475,193.525 272.813,147.863 239.858,114.905 6.828,347.934 85.444,426.555 "/>
                <path style="fill:#DB348A;" d="M318.475,193.525L443.7,68.299L381.559,6.158c-9.099-9.101-24.973-7.982-35.449,2.493
                    L239.856,114.905l32.955,32.955L318.475,193.525z"/>
                </svg> `;
        const svgDele = divPerSvgdele.querySelector("svg");
        const svgEdit = divPerEditSvg.querySelector("svg");
        //assegnare task id al svg della cancellazione
        svgDele.dataset.id = task.id;
        svgEdit.dataset.id = task.id;
        const span = document.createElement('span');
        const small = document.createElement('small');
        const span2 = document.createElement('span');

        span2.innerText = "!!!";
        span2.classList.add("text-danger","pr-1");
        li.classList.add("list-group-item");
        div.classList.add("d-flex" ,"w-100", "justify-content-between");
        div2.classList.add("form-check");
        input.type= "checkbox";
        input.classList.add("form-check-input");
        label.classList.add("form-check-label");
        
       
        //inputCheckBox stato + attributo name
        if(task.completato === 1)
             input.checked =true;
        input.setAttribute("name","completato");
        //assign data
        if(!task.importante){
         label.innerText = task.descrizione;
        }
        else{
            label.appendChild(span2);
            const div4 = document.createElement('span');
            div4.innerText = task.descrizione;
            label.appendChild(div4);
        }


         if(task.progetto.toLowerCase() === "upo"){
            span.innerText = "UPO";
            span.classList.add("badge","bg-primary","mx-4");
         }
         else{
            span.innerText = "Personale";
             span.classList.add("badge","bg-success","mx-4");
         }
         const date = new Date(task.scadenza);
         small.innerText = date.toString().slice(0,21);

        div2.appendChild(input);
        div2.appendChild(label);
        div2.appendChild(span);
        
        div.appendChild(div2);

        if(task.progetto === "upo"){
        div.appendChild(svgperson);
        }
        /**/
        const containerData_Dele = document.createElement("div");
        containerData_Dele.classList.add("containerData_DeleGap")
        containerData_Dele.appendChild(small);
        containerData_Dele.appendChild(svgEdit);
        containerData_Dele.appendChild(svgDele);
        div.appendChild(containerData_Dele);
        li.appendChild(div);
        li.dataset.id = task.id;

        document.getElementById("TaskResult").appendChild(li);
}

async function fetchTasks(filterOBJ={}){
    try{
        //add query parameter //=>done
    const query = new URLSearchParams(filterOBJ).toString();
    
    console.log(query);
    const res = await fetch(`/tasks?${query}`);
    const tasks = await res.json();
    
    //clear dom
    document.getElementById("TaskResult").innerHTML=``;

        tasks.data.forEach((task)=>{
        renderTasks(task);
    });
    }
    catch(err){
        alert(err.message || err);
    }

}

//add task/edit 
const addingTaskBtn = document.getElementById("addTaskSub");
const formaddingTask = document.getElementById("Task");

formaddingTask.addEventListener("submit",async (e)=>{
    e.preventDefault();

    console.log("adding task iniciated!");
    const descrizione = formaddingTask.descrizione.value;
    const scadenza = new Date(formaddingTask.data.value);
    const progetto = formaddingTask.progetto.value.toLowerCase();
    const importante = formaddingTask.importante.checked ? 1:0;
    const privato = formaddingTask.privato.checked ? 1: 0;
    const completato = 0;

    try{
        if(!editON){
                const res = await fetch("/task/addingTask",{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body : JSON.stringify({
                        descrizione,scadenza,progetto,importante,privato, completato
                    })
                });
                const data = await res.json();
                if(res.ok || data.success)
                    fetchTasks();
                console.log("task aggiuno con successo!");
                formaddingTask.reset();
                formAddTask.classList.remove("show");
        }
        else{
                const res = await fetch("/task/modificaTask",{
                        method: "PUT",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({id: editTaskId,descrizione,scadenza,progetto,importante,privato,completato})
                    });
                    
                    const update = await res.json();
                    console.log(update.data);
                    if(res.ok || update.success)
                        fetchTasks();

                    formaddingTask.reset();
                    formAddTask.classList.remove("show");
                    editON =false;
                    editTaskId = null;
        }
    }catch(err){
        alert(err.error);
    }

});

const taskResult = document.getElementById("TaskResult");
//edit task 
taskResult.addEventListener("click",async (e)=>{
    e.stopPropagation();
    const svgDele = e.target.closest("svg[name='edit']");
 
    if(!svgDele){
        return;
    }
    const id = svgDele.dataset.id;
    if(!id || isNaN(id))
        return;

    try{
        const query = new URLSearchParams({id}).toString();
        const res = await fetch(`/task?${query}`);
        const taskRes = await res.json();
        const task = taskRes.data;

        if(res.ok ){
            console.log(task);
            

            formaddingTask.descrizione.value = task.descrizione;

            const data = new Date(task.scadenza);
            const offsetMsecond = data.getTimezoneOffset() * 60000;
            const localTime = new Date(data.getTime() - offsetMsecond);
            formaddingTask.data.value = localTime.toISOString().slice(0,16);

            formaddingTask.progetto.value = task.progetto==="personale"? "Personale":"upo";
            formaddingTask.importante.checked = (task.importante);
            formaddingTask.privato.checked =(task.privato);
            formAddTask.classList.add("show");

            editON =true;
            editTaskId = task.id;
        }

    }catch(err){
        alert(err.error || err);
    }
    
});





//cancellazione di un task

taskResult.addEventListener("click",async (e)=>{
    e.stopPropagation();
    const svg = e.target.closest("svg[name='delete']");

    if(!svg) return;
    if(!svg.dataset.id) return;

    const id = svg.dataset.id;
    const consequence = confirm("Sei securo che voi cancella questa Task!!");
    if(!consequence){
        console.log("cancellazione annullata.");
        return;
    }
        try{
            console.log("cancellazione Task iniciated.");
            const res= await fetch("/task/rimuoverTask",{
                method: "DELETE",
                headers :{"Content-Type" : "application/json"},
                body: JSON.stringify({id})
            });
            const data = await res.json();

            if(!data.success ){
                console.log("errore: cancellazione fallita");
                            }
            document.querySelector(`li[data-id ="${id}"]`).remove();

        }catch(err){
            alert(err.error || err);
        }
    
    
});

//task è Completata
taskResult.addEventListener("change",async (e)=>{
    const inputCheckBox = e.target.closest('input[name="completato"]');
    if(!inputCheckBox)
        return;
    const completato = inputCheckBox.checked ? 1:0;

    const li = inputCheckBox.closest('li');
    if(!li || !li.dataset.id)
        return;

    const id = li.dataset.id;
    if(!id)
        return;
    try{
        console.log("compilazione Task iniciated.");
        const res = await fetch("/task/taskCompletata",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id,completato})
        });
        const data = await res.json();
        if(!res.ok)
            console.log("Errore nella richiesta dal server!.")
        console.log("stato del task è stato cambiato.")

    }catch(err){
        alert(err.error || err);
    }

});

//filter selected
const asideSelected = document.querySelectorAll("aside a[data-filter ]");
const main = document.querySelector("main");

function filterSelected(dataFilter){
    asideSelected.forEach(l =>{ 
        l.classList.remove("active")
        if(l.dataset.filter === dataFilter){
            l.classList.add("active")
            main.querySelector("h1").innerText = l.innerText;
            if(dataFilter === "condivisi" ){
                const obj ={ privato : 0};
                fetchTasks(obj);
            }
            else if(dataFilter === "tutti"){
                fetchTasks();
            }
            else if(dataFilter === "importante"){
                const obj ={importante: 1 };
                fetchTasks(obj);
            }
             else if(dataFilter === "privato"){
                const obj ={ privato : 1};
                fetchTasks(obj);
            }
             else if(dataFilter === "upo"){
                const obj ={progetto : "upo" };
                fetchTasks(obj);
            }
             else if(dataFilter ==="personale"){
                const obj ={progetto : "personale" };
                fetchTasks(obj);
            }
            //else per settimanali e oggi
            else if(dataFilter === "oggi" || dataFilter === "setimanali"){
                const obj ={scadenza : dataFilter  };
                fetchTasks(obj);
            }
    }
    
    
    });

    
}

asideSelected.forEach( l=> {
       l.addEventListener("click",(e)=>{
            e.preventDefault();
            //il suo dataFilter
            const datafilter= l.dataset.filter;
            console.log("filter selezionato:",datafilter);
            filterSelected(datafilter);
});
});


fetchTasks();
//cerca task
const cercaForm = document.querySelector("#cercaForm");
cercaForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const descrizione = cercaForm.cerca.value || "";
    if(descrizione){
        try{
            const res = await fetch(`/task/cercaTask?descrizione=${encodeURIComponent(descrizione)}`);
            const tasks = await res.json();

            document.getElementById("TaskResult").innerHTML=``;
            if(tasks.success && tasks.data.length >= 1){
            main.querySelector("h1").innerText = `Risultato Ricerca: "${descrizione}"`;
            tasks.data.forEach((task)=>{
            renderTasks(task);
            });
            }else{
                document.getElementById("TaskResult").innerHTML="<li class='list-group-item'>Nessun task trovato</li>";
            }
            cercaForm.cerca.focus();
            cercaForm.reset();
        }catch(err){
            alert(err.error);
        }
    }
});
