const sqlite = require("sqlite3");

const db = new sqlite.Database("task.db",(err)=>{
                                          if(err) throw err;
                                          console.log("Data base connessa.!");
                                                });
/*db.serialaze(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS task(
        id INTEGER PRIMARY KEY,
        nome TEXT,
        
})*/
module.exports = db;


