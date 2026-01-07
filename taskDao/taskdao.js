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
          password: utente.passwordBcrypted
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
          password: row.passwordBcrypted
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
      if(this.changes === 0) console.log("token non esiste"); else console.log("token è stato cancelato.");
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
    const query = "SELECT id_utente FROM tokens WHERE token = ? AND data_fine > CURRENT_TIMESTAMP ";
    db.get(query, [token], (err, tokenid) => {
      if (err) {
        return reject(err);
      } else if (!this.lastId) {
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
      } else resolve(rows);
    });
  });
};

//add task

exports.aggiungiTask = function (
  descrizione,
  importante,
  privato,
  progetto,
  scadenza,
  completato
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO task(descrizione,importante,privato,progetto,scadenza,completato) VALUES (?,?,?,?,?,?)";
    db.run(
      sql,
      [descrizione, importante, privato, progetto, scadenza, completato],
      function (err) {
        if (err) {
          console.log(
            "DB: errore nel inserimento di questa task: ",
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
exports.rimuoveTask = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM task WHERE id=?";
    db.run(sql, [id], function (err) {
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

exports.cercaTask = function (attributiObj) {
  if (!attributiObj || typeof attributiObj !== "object") {
    attributiObj = {};
  }

  return new Promise((resolve, reject) => {
    const attributeAspettate = [
      "descrizione",
      "importante",
      "privato",
      "progetto",
      "scadenza",
      "completato",
    ];
    const attributi = Object.keys(attributiObj).filter((k) =>
      attributeAspettate.includes(k)
    );
    if (attributi.length === 0) {
      db.all("SELECT * FROM task", [], (err, rows) => {
        if (err) {
          console.log("DB: errore nella ricerca di task.");
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
      return;
    }
    const conditions = attributi
      .map((k) => {
        if (k === "descrizione") {
          return `${k} LIKE ?`;
        } else {
          return `${k} = ?`;
        }
      })
      .join(" AND ");
    const conditionsValore = attributi.map((k) => {
      if (k === "descrizione") {
        return `%${attributiObj[k]}%`;
      } else {
        return attributiObj[k];
      }
    });

    console.log("chiama del DB con filter:", conditionsValore);
    console.log("chiama del DB con conditions:", conditions);

    if (attributi.includes("scadenza") && attributi.length === 1) {
      const date = attributiObj["scadenza"];

      let params, query;
      const oggi = new Date().toISOString().slice(0, 10);
      if (date === "oggi") {
        //oggi

        query = `SELECT * FROM task WHERE DATE(scadenza) = DATE(?)`;
        params = [oggi];
      } else if (date === "setimanali") {
        const prossimi7 = new Date();
        prossimi7.setDate(prossimi7.getDate() + 7);
        const prossimi7Giorni = prossimi7.toISOString().slice(0, 10);

        query = `SELECT * FROM task WHERE DATE(scadenza) BETWEEN DATE(?) AND DATE(?)`;
        params = [oggi, prossimi7Giorni];
      }

      db.all(query, params, (err, rows) => {
        if (err) {
          console.log("DB: errore nel filtro di DATE!");
          return reject(err);
        } else {
          console.log(`Task con filtrazione "${date}" trovati: ${rows.length}`);
          return resolve(rows);
        }
      });
      return;
    }

    const sql = `SELECT * FROM task WHERE ${conditions} `;
    db.all(sql, [...conditionsValore], (err, rows) => {
      if (err) {
        console.log("DB: errore nella ricerca di task.");
        return reject(err);
      } else {
        console.log("Tasks trovate: ", rows);
        resolve(rows);
      }
    });
  });
};
