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
    overlay.classList.add("show");
    formAddTask.classList.toggle("hidden");
    
});
