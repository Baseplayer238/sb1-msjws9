import { StudyNote, Highlight } from '../models/study-note';
import * as SQLite from 'nativescript-sqlite';

export class DatabaseService {
  private database: any;

  async init() {
    this.database = await new SQLite('study_notes.db');
    await this.createTables();
  }

  private async createTables() {
    await this.database.execSQL(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        subject TEXT,
        bookmarked INTEGER,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    await this.database.execSQL(`
      CREATE TABLE IF NOT EXISTS highlights (
        id TEXT PRIMARY KEY,
        note_id TEXT,
        text TEXT,
        color TEXT,
        position INTEGER,
        FOREIGN KEY(note_id) REFERENCES notes(id)
      )
    `);
  }

  async saveNote(note: StudyNote): Promise<void> {
    await this.database.execSQL(
      `INSERT OR REPLACE INTO notes VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [note.id, note.title, note.content, note.subject, note.bookmarked ? 1 : 0, 
       note.createdAt.getTime(), note.updatedAt.getTime()]
    );
  }

  async getNotes(): Promise<StudyNote[]> {
    const rows = await this.database.all('SELECT * FROM notes ORDER BY updated_at DESC');
    return rows.map(row => ({
      id: row[0],
      title: row[1],
      content: row[2],
      subject: row[3],
      bookmarked: row[4] === 1,
      createdAt: new Date(row[5]),
      updatedAt: new Date(row[6]),
      highlights: []
    }));
  }
}