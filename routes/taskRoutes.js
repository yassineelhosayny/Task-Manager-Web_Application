const express =require('express');
const session = require("express-session");
const sessionDb = require("connect-sqlite3")(session);
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const miniapp = express.Router();  /****mini server per route soto il server principale app */
const taskdao = require("../taskDao/taskdao");



//per stringa random come secret in session
require("dotenv").config();

miniapp.use(session({
  name:"connect.sid",
  secret:process.env.SESSION_SECRET,
  rolling:true,
  resave:false,
  saveUninitialized: false,

  cookie:{
    maxAge : 1000*60*60*24, //un giorno
    sameSite: "lax",
    secure: process.env.NODE_ENV ==='produzione',
    httpOnly:true
  },

  store: new sessionDb({
    db:"../task.db",
    table:"sessions"
  })

}));
async function hashPassword(pass){
  const saltiQty = 10;
  const passwordHash = await bcrypt.hash(pass,saltiQty);
  return passwordHash;
}

async function validaDati(req,res,next){
  const {nome,email,password,ricordami} = req.body;
  if(!nome || nome.trim().length > 20 || nome.trim().length < 2)
    return res.status(400).json({
        success:false,
        error: "Nome non valido!!"
    });
  if(!email.includes("@")){
    return res.status(400).json({
        success:false,
        error: "Email non valido!!"
    });
  }
  if(password.length < 4){ //solo per facillitare i test manuale
      return res.status(400).json({
        success:false,
        error: "Password troppo corto!!"
    });
  }
  req.nome =nome.trim();
  req.email = email;
  req.passwordHash = await hashPassword(password);
  req.ricordami = ricordami === true ? true : false;

  next();
}

//create account
miniapp.post("/registrazione",validaDati,async (req,res)=>{
    try{
      //se utente esiste già
      const esiste = await taskdao.getUtenteByEmail(req.email);
      if(esiste){
        return res.status(400).json({

        })
      }

      const utente = await taskdao.registraUtente(req.nome,req.email,req.passwordHash);
      if(!utente)
        throw new Error("Errore: la registrazione non è stata effetuata");

      //salva sessionDb
      req.session.utente =utente.id;
      req.session.ruolo = utente.ruolo;
      
      if(req.ricordami){
        const token = crypto.randomBytes(32).toString('hex');
        const age = Date.now()+ 1000*60*60*24*30; //30giorni
        const tipo = 'ricorda_mi';

        const salvaToken = await taskdao.salvaToken(utente.id,token,age,tipo);
        if(salvaToken){
          res.cookie(tipo,token,{
          maxAge:1000*60*60*24*30,
          secure: process.env.NODE_ENV === 'produzione',
          httpOnly:true,
          sameSite: 'lax'
        });
        }
      }

      return res.json({
        success:true,
        data: {
          id:utente.id,
          ruolo :utente.ruolo
        }
      });

    }catch(err){
      return res.status(500).json({
        success:false,
        error: err.message
      });
    }
});
//login
miniapp.get("/login",(req,res)=>{
    res.render("signIn");
});

//register
miniapp.get("/register",(req,res)=>{
  res.render("register");
});


//get lista dei libri basando su filterSelected: UN SINGOLO PARAMETRO nel QUERY.
miniapp.get("/tasks", async (req, res) => {
  try {
    const filter = req.query || {};
      //restiusci i task basando al filterSelected
    const  tasks = await taskdao.cercaTask(filter);
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
  res.redirect("/tasks");
});

//get un singolo task con id
function validaTaskId(req, res, next) {
  const id = Number(req.query.id);
  if (id <= 0 || isNaN(id) || !id)
    res.status(400).json({
      success: false,
      error: "task id non valido",
    });
  else {
    req.taskId = id;
    next();
  }
}
miniapp.get("/task", validaTaskId, async (req, res) => {
  try {
    const task = await taskdao.getTaskById(req.taskId);
    console.log(task);
    return res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
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