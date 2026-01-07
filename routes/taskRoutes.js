const express =require('express');
const session = require("express-session");
const sessionDb = require("connect-sqlite3")(session);
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const miniapp = express.Router();  /****mini server per route soto il server principale app */
const taskdao = require("../taskDao/taskdao");
const cookieParser = require("cookie-parser");


miniapp.use(cookieParser());



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
  if(!nome || nome?.trim().length > 20 || nome?.trim().length < 2)
    return res.render("register",{
      errors:{
        nome:"Nome non valido"
      }
    });
  if(!email.includes("@")){
    return res.render("register",{
        error: {
          email: "Email non valido!!"}
    });
  }
  if(password.length < 4){ //solo per facillitare i test manuale
      return res.render("register",{
        errors:{
          password:"Password troppo corto"
        }
      });
  }
  req.nome =nome.trim();
  req.email = email;
  req.passwordHash = await hashPassword(password);
  req.ricordami = ricordami === "on";


  next();
}
//assegnaSession
function assegnaSession(req,id,nome,ruolo){
      req.session.utente = id;
      req.session.ruolo = ruolo;
      req.session.nome = nome;
}
async function ricordamiToken(req,res){
        const token = crypto.randomBytes(32).toString('hex');
        const age = new Date(Date.now() + 1000*60*60*24*30).toISOString(); //30giorni
        const tipo = 'ricorda_mi';

        await taskdao.salvaToken(req.session.utente,token,age,tipo);

        return {token,age,tipo};
}
//logOut
miniapp.post("/logout",async (req,res)=>{
  //clear token
  const token = req.cookies.ricorda_mi;
  const deleToken = await taskdao.deleteToken(token);

  res.clearCookie("ricorda_mi");
  
  //clear session
  req.session.destroy(err=>{
    if(err)
      res.status(500).send("Errore nel logout!");

      res.clearCookie("connect.sid");
      res.redirect("/home");
  });
});
async function getReady(req,res,next){
  const {email,password,ricordami} = req.body;

  if(!email.includes("@")){
    return res.render("register",{
        error: {
          email: "Email non valido!!"}
    });
  }
  if(password.length < 4){ //solo per facillitare i test manuale
      return res.render("register",{
        errors:{
          password:"Password troppo corto"
        }
      });
  }
  req.email = email.trim();
  req.password = password;
  req.ricordami = ricordami === "on";

  next();
}
async function haAcesso(req,res){
  //se ci una sessione 
  if(req.session?.utente){
   return true;
  }
  //se ci un token
  const token = req.cookies.ricorda_mi;

  if(token){
    const idUtente = await taskdao.getIdToken(token);
    if (!idUtente) return false;

    const utente  = await taskdao.getUtenteById(idUtente.id_utente);
    assegnaSession(req,utente.id,utente.nome,utente.ruolo);
    return true;
  }
  else return false;
}
//login
miniapp.post("/login",getReady,async(req,res)=>{
  
if(await haAcesso(req,res)){
   return res.render("index",{
      utente : { nome: req.session.nome },
      errors:null
   });
}
 //se non ci niente fa il login
 
else{
  const utente = await taskdao.getUtenteByEmail(req.email);
  if(!utente){
    return res.render("signIn",{
      errors:{
        email: "Email o Password errati!."
      }
    })
  }
  const passwordValido = await bcrypt.compare(req.password,utente.password);
  if(!passwordValido){
    return res.status(401).render("signIn",{
      errors:{
        email: "Email o Password errati!."
      }
    })
  }
  assegnaSession(req, utente.id, utente.nome, utente.ruolo);

  //ricordami checked
  if(req.ricordami )
  {
    const {tipo,token,age}= await ricordamiToken(req,res);
    res.cookie(tipo,token,{
          maxAge:1000*60*60*24*30,
          secure: process.env.NODE_ENV === 'produzione',
          httpOnly:true,
          sameSite: 'lax'
        });
  }

  return res.render("index",{
      utente :{
        nome: req.session.nome
      },
      errors:null
    })

 }
});

//create account
miniapp.post("/registrazione",validaDati,async (req,res)=>{
    try{
      //se utente esiste già
      const esiste = await taskdao.getUtenteByEmail(req.email);
      if(esiste){
        return res.render("register",{
          errors: {
            email:"Email assegnato a un altra persona!"
          }
        })
      }

      const utente = await taskdao.registraUtente(req.nome,req.email,req.passwordHash);
      if(!utente)
        if(esiste){
        return res.render("register",{
          errors: {
            email:"la registrazione non è stata efettuata!"
          }
        })
      }

      //salva sessionDb 
       assegnaSession(req,utente.id,utente.nome,utente.ruolo);
     
      
      if(req.ricordami )
        {
          const {tipo,token,age}= await ricordamiToken(req,res);
          res.cookie(tipo,token,{
                maxAge:1000*60*60*24*30,
                secure: process.env.NODE_ENV === 'produzione',
                httpOnly:true,
                sameSite: 'lax'
              });
        }

      return res.render("index",{
        utente:{
          nome: utente.nome
        },
        errors:null
      });

    }catch(err){
      return res.status(500).json({
        success:false,
        error: err.message
      });
    }
});
//home
miniapp.all("/home", (req, res) => {
  res.render("index",{
      utente: req.session?.nome ? 
      { nome: req.session.nome, }: null,
      errors:null
    }
)});
miniapp.all("/",(req,res)=>{
  res.redirect("/home");
});
//login
miniapp.get("/login",(req,res)=>{
    res.render("signIn",{
      errors:null
    });
});

//register
miniapp.get("/register",(req,res)=>{
  res.render("register");
});


//get lista dei libri basando su filterSelected: UN SINGOLO PARAMETRO nel QUERY.
miniapp.get("/tasks", async (req, res) => {
  try {
  const idUtente = req.session?.utente;  //
  const ruoloUtente = req.session?.ruolo; //

    const filter = req.query || {};
      if(!idUtente && (filter["privato"] === "1" || filter["privato"] === "0")){
      return res.status(401).json({
        success: false,
        error: "Devi effettuare il login per accedere a questo contenuto",
        redirectTo: "/login"  // Suggerisci dove andare
      });
    }
      //restiusci i task basando al filterSelected
    const  tasksPublic = await taskdao.cercaTask(filter,idUtente);
    if(!tasksPublic){
      res.render("index",{
        errors:{
          general: "errore nella ricarica del filter!"
        }
      });
    }
    res.json({
      success: true,
      id: idUtente? idUtente: null,  //
      ruolo: ruoloUtente? ruoloUtente : null, //
      data: tasksPublic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
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
  //controllo se authenticato
  if(!(await haAcesso(req,res))){
   return res.redirect("/login");
}

  const { descrizione, importante, privato, progetto, scadenza, completato } = req.body;
  const id_utente = req.session.utente;
  try {
    const insert = await taskdao.aggiungiTask(
      id_utente,
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
    //controllo se authenticato
  if(!(await haAcesso(req,res))){
   return res.redirect("/login");
}
    const id_utente = req.session.utente;
    const ruolo = req.session.ruolo;
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
    const task = await taskdao.getTaskById(id);

    if(task.id_utente === id_utente || ruolo === "admin"){
        const update = await taskdao.modificaTaskDinamico(id,req.body);
        if (update.changes === 0)
          return res.status(404).json({
            success: false,
            error: "Task Non Trovata",
          });
        return res.json({
          success: true,
          data: update,
        });
    }
     return res.status(403).json({
      success: false,
      error: "Non poi modificare una task non il tuo!!",
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
        //controllo se authenticato
  if(!(await haAcesso(req,res))){
   return res.redirect("/login");
    }
    const id_utente = req.session.utente;
    const ruolo = req.session.ruolo;
    const id = Number(req.body.id);

    const task = await taskdao.getTaskById(id);
    if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task non trovata",
        });
      }

    if(task.id_utente === id_utente || ruolo === "admin"){
    const rimoved = await taskdao.rimuoveTask(id,id_utente);
    if (rimoved.change === 0) {
      return res.status(404).json({
        success: false,
        error: "Task non trovato",
      });
    }
    return res.json({
      success: true,
      data: rimoved,
    });
    }
    return res.status(403).json({
      success: false,
      error: "Non poi cancellare una task non il tuo!!",
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
    if(!(await haAcesso(req,res))){
   return res.redirect("/login");
    }
    const id_utente = req.session.utente;
    const task = await taskdao.getTaskById(req.taskId);

        console.log("server stell alive.");
    if(task.id_utente === id_utente){
          console.log("server stell alive.");
    const taskcomplited = await taskdao.modificaTaskDinamico(req.taskId,req.body);
    if(taskcomplited.change === 0){
      return res.status(404).json({
        success:false,
        error: "Task non trovato"
      });
    }
    return res.json({
      success: true,
      data: taskcomplited
    });
  }
  return res.status(403).json({
      success: false,
      error: "Non poi assegnare una task come completata se non il tuo!!",
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
    const result = await taskdao.cercaTask(req.query,req.session?.utente);
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