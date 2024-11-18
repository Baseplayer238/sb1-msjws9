import { EventData, NavigatedData, Observable, Page } from '@nativescript/core';
import { DatabaseService } from '../services/database.service';
import { StudyNote } from '../models/study-note';

export class NotesListViewModel extends Observable {
  private dbService: DatabaseService;
  public notes: StudyNote[] = [];
  public searchQuery: string = '';

  constructor() {
    super();
    this.dbService = new DatabaseService();
    this.loadNotes();
  }

  async loadNotes() {
    try {
      this.notes = await this.dbService.getNotes();
      this.notifyPropertyChange('notes', this.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  onAddNote() {
    // Navigate to note editor
  }

  onNoteTap(args: any) {
    const note = this.notes[args.index];
    // Navigate to note editor with selected note
  }

  onSearch() {
    // Implement search functionality
  }

  onClearSearch() {
    this.searchQuery = '';
    this.loadNotes();
  }
}

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new NotesListViewModel();
}