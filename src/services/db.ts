import Dexie, { Table } from 'dexie';
import { StudyNote } from '../types';

export class StudyMaterialsDB extends Dexie {
  notes!: Table<StudyNote>;

  constructor() {
    super('studyMaterialsDB');
    this.version(1).stores({
      notes: '++id, title, subject, bookmarked, createdAt, updatedAt'
    });
  }
}

export const db = new StudyMaterialsDB();