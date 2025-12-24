CREATE TABLE IF NOT EXISTS task(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descrizione TEXT NOT NULL,
    importante INT default 0,
    privato INT default 0,
    progetto TEXT,
    scadenza TIMESTAMP,
    completato INT default 0
)