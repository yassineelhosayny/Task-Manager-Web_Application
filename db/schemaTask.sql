CREATE TABLE IF NOT EXISTS task(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descrizione TEXT NOT NULL,
    importante INT default 0,
    privato INT default 0,
    progetto TEXT,
    scadenza TIMESTAMP,
    completato INT default 0,
     id_utente INTEGER,
    FOREIGN KEY(id_utente) REFERENCES utente(id) ON DELETE CASCADE
);


INSERT INTO task(id,descrizione,importante,privato,progetto,scadenza,completato,id_utente) 
SELECT id,descrizione,importante,privato,progetto,scadenza,completato,1 FROM old_task;;