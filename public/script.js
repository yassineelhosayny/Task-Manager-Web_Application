"use strict"
//const btn = document.querySelector("button[id='addTask']");
console.log("collegato");

const btn = document.getElementById("addTask");
if(btn)
btn.addEventListener("click",(event)=>{
    event.preventDefault();
    console.log("clicked");
    btn.style.backgroundColor ="#E8F777";
    document.body.style.opacity = 0.5;

    

});
