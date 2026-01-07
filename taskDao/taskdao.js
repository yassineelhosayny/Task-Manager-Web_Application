const db = require("../db/db");

exports.listaAllTasks = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM task";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log("DB enable to get data from data base");
        return reject(err);
      } else return resolve(rows);
    });
  });
};
//getUtenteByEmail
exports.getUtenteByEmail = function (email) {
  return new Promise((resolve, reject) => {
    const queryemail = "SELECT * FROM utente WHERE email = ?";

    db.get(queryemail, [email], (err, utente) => {
      if (err) {
        return reject(err);
      } else if (!utente) {
        return resolve(null);
      } else {
        return resolve({
          id: utente.id,
          nome: utente.nameUtente,
          ruolo: utente.ruolo,
          password: utente.passwordBcrypted,
        });
      }
    });
  });
};
//getUtenteById
exports.getUtenteById = function (id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM utente WHERE id = ?";
    db.get(query, [id], (err, row) => {
      if (err) {
        return reject(err);
      } else if (!row) {
        return resolve(null);
      } else {
        return resolve({
          id: row.id,
          nome: row.nameUtente,
          ruolo: row.ruolo,
          password: row.passwordBcrypted,
        });
      }
    });
  });
};

//registrazione
exports.registraUtente = function (nome, email, passwordHash) {
  return new Promise((resolve, reject) => {
    const ruolo = "utente";

    const query =
      "INSERT INTO utente(nameUtente,email,passwordBcrypted,ruolo) Values (?,?,?,?)";
    db.run(query, [nome, email, passwordHash, ruolo], function (err) {
      if (err) {
        console.log("errore: nella registrazione del utente!");
        return reject(err);
      } else {
        console.log(`utente ${email}, Registrazione effetuata`);
        resolve({
          id: this.lastID,
          ruolo,
          nome,
        });
      }
    });
  });
};
//inserimento token
exports.salvaToken = function (id, token, age, tipo) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO tokens(id_utente,token,tipo,data_fine) VALUES (?,?,?,?)";
    db.run(query, [id, token, tipo, age], function (err) {
      if (err) {
        console.log(`errore nel inserimento del token per utente :${id}`);
        return reject(err);
      } else {
        return resolve({
          changes: this.changes,
        });
      }
    });
  });
};
//cancella token
exports.deleteToken = function (token) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM tokens WHERE token = ? ";

    db.run(query, [token], (err) => {
      if (err) {
        return reject(err);
      }
      if (this.changes === 0) console.log("token non esiste");
      else console.log("token è stato cancelato.");
      return resolve({
        success: true,
        message:
          this.changes === 0 ? "token non esiste" : "token è stato cancelato.",
      });
    });
  });
};
//get token
exports.getIdToken = function (token) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT id_utente FROM tokens WHERE token = ? AND data_fine > CURRENT_TIMESTAMP ";
    db.get(query, [token], (err, tokenid) => {
      if (err) {
        return reject(err);
      } else if (!tokenid) {
        resolve(null);
      }
      return resolve(tokenid);
    });
  });
};

//Task by id
exports.getTaskById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM task WHERE id=?";
    console.log("DB: get task: id=", id);
    db.get(sql, [id], (err, rows) => {
      if (err) {
        console.log("ci è stato un errore a livello della data base");
        return reject(err);
      }
      if (!rows) {
        console.log("Nessun task trovato con id:", id);
        return reject(new Error("Task non trovato"));
      }
       else resolve(rows);
    });
  });
};

//add task

exports.aggiungiTask = function (
  id_utente,
  descrizione,
  importante,
  privato,
  progetto,
  scadenza,
  completato
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO task(descrizione,importante,privato,progetto,scadenza,completato,id_utente) VALUES (?,?,?,?,?,?,?)";
    db.run(
      sql,
      [
        descrizione,
        importante,
        privato,
        progetto,
        scadenza,
        completato,
        id_utente,
      ],
      function (err) {
        if (err) {
          console.log(
            "DB: errore nel inserimento di questa task: ",
            id_utente,
            descrizione,
            importante,
            privato,
            progetto,
            scadenza,
            completato
          );
          return reject(err);
        } else {
          console.log("task aggiunta con successo: ", descrizione);
          resolve({
            Success: true,
            id: this.lastID,
            descrizione: descrizione,
          });
        }
      }
    );
  });
};

//modificare una task

exports.modificareTask = function (
  id,
  descrizione,
  importante,
  privato,
  progetto,
  scadenza,
  completato
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE task SET descrizione = ?,importante= ?,privato= ?,progetto= ?,scadenza=?,completato=? WHERE id = ?";
    db.run(
      sql,
      [descrizione, importante, privato, progetto, scadenza, completato, id],
      function (err) {
        if (err) {
          console.log("DB: errore nella modifica della task.");
          return reject(err);
        } else {
          console.log("DB: task modificata con successo!");
          resolve({
            changes: this.changes,
            messagio: "DB: task modificata con successo!",
          });
        }
      }
    );
  });
};

//cancella una task
exports.rimuoveTask = function (id, idU) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM task WHERE id=? AND id_utente=?";
    db.run(sql, [id, idU], function (err) {
      if (err) {
        console.log("DB: errore nella cancelazione del taskcon id= ", id);
        return reject(err);
      } else {
        console.log(
          this.changes === 0
            ? `task con id: ${id}. Non esiste`
            : `task con id: ${id}. è stata cancellata con successo`
        );
        resolve({
          change: this.changes,
          messagio:
            this.changes === 0
              ? `task con id: ${id}. Non esiste`
              : `task con id: ${id}. è stata cancellata con successo`,
        });
      }
    });
  });
};
//modifica una task dinamic
exports.modificaTaskDinamico = function (id, variabile) {
  return new Promise((resolve, reject) => {
    const variabileAspettate = [
      "descrizione",
      "importante",
      "privato",
      "progetto",
      "scadenza",
      "completato",
    ];

    const keys = Object.keys(variabile).filter((v) =>
      variabileAspettate.includes(v)
    );
    if (keys.length === 0) {
      return reject(new Error("nessun campo valido da aggiornare"));
    }

    const setVariabile = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => variabile[k]);

    const sql = `UPDATE task SET ${setVariabile} WHERE id = ?`;

    db.run(sql, [...values, id], function (err) {
      if (err) {
        console.log("DB: errore nella modifica del task id: ", id);
        return reject(err);
      } else {
        console.log(
          `DB:task con id:${id} è stato modificato, dati modificati: ${variabile}`
        );
        resolve({
          change: this.changes,
          messaggio:
            this.changes === 0
              ? `task con id : ${id}, Non Trovato`
              : `task con id : ${id}, è stato modificato con successo`,
        });
      }
    });
  });
};
exports.getAllTasksPrivate = function (id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM task WHERE id_utente=? AND privato = ? ";
    db.all(query, [id, 1], (err, tasks) => {
      if (err) {
        return reject(err);
      }
      return resolve(tasks);
    });
  });
};


exports.cercaTask = function (attributiObj, idU) {
  console.log("=== DEBUG cercaTask ===");
  console.log("attributiObj ricevuto:", JSON.stringify(attributiObj));
  console.log("idU:", idU);
  if (!attributiObj || typeof attributiObj !== "object") {
    attributiObj = {};
  }

  const isGuest = !idU;

  return new Promise((resolve, reject) => {
    const attributiConsentiti = [
      "descrizione",
      "importante",
      "privato",
      "progetto",
      "scadenza",
      "completato",
    ];

    const attributi = Object.keys(attributiObj).filter((k) =>
      attributiConsentiti.includes(k)
    );

    // ---- BASE QUERY (UNICA STRUTTURA) ----
    let baseSelect = `
      SELECT
        task.id            AS id,
        task.descrizione,
        task.importante,
        task.privato,
        task.progetto,
        task.scadenza,
        task.completato,
        task.id_utente,
        utente.nameUtente  AS nome_proprietario
      FROM task
      JOIN utente ON task.id_utente = utente.id
    `;

    let where = [];
    let params = [];

    // ---- PERMISSIONI ----
    if (isGuest) {
      where.push("task.privato = 0");
    } else {
      where.push("(task.id_utente = ? OR task.privato = 0)");
      params.push(idU);

      //condivisi
      if(attributiObj["privato"] === "0" && attributi.length===1){
        const query = `
      SELECT
        task.id            AS id,
        task.descrizione,
        task.importante,
        task.privato,
        task.progetto,
        task.scadenza,
        task.completato,
        task.id_utente,
        utente.nameUtente  AS nome_proprietario
      FROM task
      JOIN utente ON task.id_utente = utente.id
      WHERE task.privato = 0 AND task.id_utente = ?
    `;
     
     params =[idU];
     return db.all(query, params, (err, rows) => {
        if (err) {
          console.log("DB: errore nel filtro DATE.");
          return reject(err);
        }
        return resolve(rows);
      });
      }
    }


    // ---- NESSUN FILTRO ----
    if (attributi.length === 0) {
      const sql = `${baseSelect} WHERE ${where.join(" AND ")}`;

      return db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("DB: errore nella ricerca di task.");
          return reject(err);
        }
        resolve(rows);
      });
    }

    // ---- FILTRO SCADENZA (oggi / settimanali) ----
    if (attributi.includes("scadenza") && attributi.length === 1) {
      const oggi = new Date().toISOString().slice(0, 10);

      if (attributiObj.scadenza === "oggi") {
        where.push("DATE(task.scadenza) = DATE(?)");
        params.push(oggi);
      }

      if (attributiObj.scadenza === "setimanali") {
        const prossimi7 = new Date();
        prossimi7.setDate(prossimi7.getDate() + 7);
        const fine = prossimi7.toISOString().slice(0, 10);

        where.push("DATE(task.scadenza) BETWEEN DATE(?) AND DATE(?)");
        params.push(oggi, fine);
      }

      const sql = `${baseSelect} WHERE ${where.join(" AND ")}`;

      return db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("DB: errore nel filtro DATE.");
          return reject(err);
        }
        resolve(rows);
      });
    }
     

    // ---- FILTRI GENERICI ----
    attributi.forEach((k) => {
      if (k === "descrizione") {
        where.push("task.descrizione LIKE ?");
        params.push(`%${attributiObj[k]}%`);
      } else {
        where.push(`task.${k} = ?`);
        params.push(attributiObj[k]);
      }
    });

    const sql = `${baseSelect} WHERE ${where.join(" AND ")}`;

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.log("DB: errore nella ricerca di task.");
        return reject(err);
      }
      resolve(rows);
    });
  });
};


