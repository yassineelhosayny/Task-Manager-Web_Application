const db = require("../db/db");

exports.listaAllTasks = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM task";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log("DB enable to get data from data base");
        return reject(err);
      } else resolve(rows);
    });
  });
};

//Task by id
exports.getTaskById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM task WHERE id=?";
    db.get(sql, [id], (err, rows) => {
      if (err) {
        console.log("ci è stato un errore a livello della data base");
        return reject(err);
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
            dbSuccess: true,
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
    }
    const conditions = attributi.map((k) => `${k} = ?`).join(" AND ");
    const conditionsValore = attributi.map((k) => attributiObj[k]);

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
