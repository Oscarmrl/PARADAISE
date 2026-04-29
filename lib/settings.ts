import pool from "./db";

const DEFAULT_HERO = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85&auto=format&fit=crop";

// Promesa singleton: se ejecuta una sola vez por proceso,
// garantiza que la tabla existe antes de cualquier query.
let initPromise: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!initPromise) {
    initPromise = pool
      .query(`
        CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
        INSERT INTO settings (key, value)
        VALUES ('hero_image', '${DEFAULT_HERO}')
        ON CONFLICT (key) DO NOTHING;
      `)
      .then(() => {})
      .catch((err) => {
        // Si falla, permitir reintento en la siguiente llamada
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}

export async function getSetting(key: string): Promise<string | null> {
  await ensureTable();
  const { rows } = await pool.query<{ value: string }>(
    "SELECT value FROM settings WHERE key = $1",
    [key]
  );
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await ensureTable();
  await pool.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2`,
    [key, value]
  );
}
