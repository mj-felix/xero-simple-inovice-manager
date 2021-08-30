import path, { join } from 'path';
import { Low, JSONFile } from 'lowdb';
import asyncHandler from 'express-async-handler';

const __dirname = path.resolve();
const file = join(__dirname, 'backend', 'database', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const connect = asyncHandler(async () => {
    await db.read();
    if (!db.data.invoices) {
        db.data = {
            invoices: []
        };
    }
    await db.write();
});

export { db, connect };