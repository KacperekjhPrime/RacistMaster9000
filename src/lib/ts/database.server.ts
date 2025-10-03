import sqlite from "better-sqlite3";
import envPaths from "env-paths";
import { join } from "path";
import { databaseSchema } from "$lib/ts/databaseSchema.server";

const dbPath = join(envPaths('RacistMaster9000').data);

export const db = sqlite(dbPath);
db.pragma('journal_mode = WAL');
db.exec(databaseSchema);
console.log('Opened database connection');

process.on('sveltekit:shutdown', () => {
    db.close();
    console.log('Closed database connection.');
});