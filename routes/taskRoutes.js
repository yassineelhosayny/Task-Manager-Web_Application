const express =require('express');
const miniapp = express.Router();  /****mini server per route soto il server principale app */
const taskdao = require("../taskDao/taskdao");


//get lista dei libri
miniapp.get("/tasks", async (req, res) => {
  try {
    const tasks = await taskdao.listaAllTasks();
    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
miniapp.all("/", (req, res) => {
  res.render("templetes/addingTaskForm.ejs");
});
//get un singolo task con id

function validaTaskId(req, res, next) {
  const id = Number(req.body.id);
  if (id <= 0 || isNaN(id) || !id)
    res.status(400).json({
      success: false,
      error: "task id non valido",
    });
  else {
    res.taskId = id;
    next();
  }
}
miniapp.get("/task", validaTaskId, async (req, res) => {
  try {
    const task = await taskdao.getTaskById(req.taskId);
    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//add un nuovo task
miniapp.post("/task/addingTask", async (req, res) => {
  const { descrizione, importante, privato, progetto, scadenza, completato } =
    req.body;
  try {
    const insert = await taskdao.aggiungiTask(
      descrizione,
      importante,
      privato,
      progetto,
      scadenza,
      completato
    );
    res.json({
      success: true,
      data: insert,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});
//modificare "put" un task
miniapp.put("/task/modificaTask", async (req, res) => {
  try {
    const id = req.body.id;
    const { descrizione, importante, privato, progetto, scadenza, completato } =
      req.body;

   /* const update = await taskdao.modificareTask(
      id,
      descrizione,
      importante,
      privato,
      progetto,
      scadenza,
      completato
    );*/
    const update = await taskdao.modificaTaskDinamico(id,req.body);
    if (update.changes === 0)
      return res.status(404).json({
        success: false,
        error: "Task Non Trovata",
      });
    res.json({
      success: true,
      data: update,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});
//cancellare un task "delete"
miniapp.delete("/task/rimuoverTask", async (req, res) => {
  try {
    const id = Number(req.body.id);
    const rimoved = await taskdao.rimuoveTask(id);
    if (rimoved.change === 0) {
      return res.status(404).json({
        success: false,
        error: "Task non trovato",
      });
    }
    res.json({
      success: true,
      data: rimoved,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});
//segnare un task come completato
function idIsValid(req,res,next){
  const id = Number(req.body.id);
  if(isNaN(id) || id === undefined || id<=0){
    return res.status(400).json({
      success: false,
      error: "task id non valido"
    });
  }
  req.taskId= id;
  next();
}
miniapp.put("/task/taskCompletata",idIsValid, async (req,res)=>{
  try{
    const taskcomplited = await taskdao.modificaTaskDinamico(req.taskId,req.body);
    if(taskcomplited.change === 0){
      return res.status(404).json({
        success:false,
        error: "Task non trovato"
      });
    }
    res.json({
      success: true,
      data: taskcomplited
    });
  }catch(err){
      res.status(500).json(
        {
          success: false,
          error: err.message
        }
      );
  }
});
/*Recuperare una lista di tutti i task che rispettino una certa proprietà, per esempio tutti i task 
“importanti”, tutti quelli con una certa scadenza, ecc. Pensa alle funzionalità dei “filtri” e dei 
“progetti” dei laboratori precedenti per una lista completa di opzioni. */

//generic flitre di un task con certe proprietà
miniapp.get("/task/cercaTask", async (req,res)=>{
  try{
    const result = await taskdao.cercaTask(req.query);
    res.json({
      success: true,
      data: result
    })
  }catch(err){
    res.status(500).json({
      success:false,
      error: err.message
    });
  }
});






module.exports = miniapp; //***********fondamentale per rendere miniapp usabile da app.js */