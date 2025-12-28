"use strict"
//const btn = document.querySelector("button[id='addTask']");
console.log("collegato");


const btn = document.getElementById("addTask");
const formAddTask = document.getElementById("overlay");
if(btn)
btn.addEventListener("click",(event)=>{
    event.preventDefault();
    console.log("clicked");
    btn.style.backgroundColor ="#0b7515ff";
    formAddTask.classList.add("show");
    
    
});

const annullaBtn = document.getElementById("cancel");
annullaBtn.addEventListener("click",()=>{
     formAddTask.classList.remove("show");
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
        const svg = div3.querySelector("svg");
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


         if(task.progetto === "upo"){
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
        div.appendChild(svg);
        }
        /**/

        div.appendChild(small);
        li.appendChild(div);


        document.getElementById("TaskResult").appendChild(li);

 
}

async function fetchTasks(){
    try{
    const res = await fetch("/tasks");
    const data = await res.json();
    
    //clear dom
    document.getElementById("TaskResult").innerHTML=``;
    data.data.forEach((task)=>{
        renderTasks(task);
    });
    }
    catch(err){
        alert(err.message || err);
    }

}

//add task
const addingTaskBtn = document.getElementById("addTaskSub");
const formaddingTask = document.getElementById("Task");
formaddingTask.addEventListener("submit",async (e)=>{
    console.log("adding task iniciated!");
    e.preventDefault();
    const descrizione = formaddingTask.descrizione.value;
    const scadenza = new Date(formaddingTask.data.value);
    const progetto = formaddingTask.progetto.value;
    const importante = formaddingTask.importante.checked ? 1:0;
    const privato = formaddingTask.privato.checked ? 1: 0;

    try{
    const res = await fetch("/task/addingTask",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({
            descrizione,scadenza,progetto,importante,privato
        })
    });
    const data = await res.json();
    if(res.ok || data.success)
         fetchTasks();
    console.log("task aggiuno con successo!");
    formAddTask.classList.remove("show");
    }catch(err){
        alert(err.error);
    }

});


fetchTasks();

//filter selected
const selected = document.querySelector("aside a[filter-data]");

