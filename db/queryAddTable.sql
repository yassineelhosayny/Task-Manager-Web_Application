CREATE TABLE IF NOT EXISTS utente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nameUtente TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordBcrypted TEXT NOT NULL,
    ruolo TEXT NOT NULL CHECK (ruolo IN ('utente','admin','guest')),
    dataIscrizione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS tokens (
    id_token INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utente INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- 'REMEMBER_ME'
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fine TIMESTAMP NOT NULL,
    FOREIGN KEY(id_utente) REFERENCES utente(id) ON DELETE CASCADE
);

/*AGGIUNGER ID UTENTE A TASK*/
ALTER TABLE task ADD COLUMN id_utente INTEGER;
ALTER TABLE task ADD FOREIGN KEY (id_utente) REFERENCES utente(id) ON DELETE SET NULL;

-- Inserisco un admin
INSERT INTO utente (nameUtente, email, passwordBcrypted, ruolo)
VALUES ('yassine', 'y@mail.com', 'tobeHashed', 'admin');


UPDATE task SET id_utente = 1;
