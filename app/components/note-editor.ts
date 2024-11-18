import { NavigatedData, Page, Frame, Observable } from '@nativescript/core';
import { StudyNote } from '../models/study-note';
import { DatabaseService } from '../services/database.service';
import { ExportService } from '../services/export.service';
import { GeminiService } from '../services/gemini.service';

export class NoteEditorViewModel extends Observable {
  private dbService: DatabaseService;
  private exportService: ExportService;
  private geminiService: GeminiService;
  
  public note: StudyNote;
  public isGenerating: boolean = false;
  public generatedImages: { imageUrl: string }[] = [];

  constructor(noteId?: string) {
    super();
    this.dbService = new DatabaseService();
    this.exportService = new ExportService();
    this.geminiService = new GeminiService(AIzaSyDBrVy_u_z0PswpZlpB9x5yRXvw_a9BaIQ); // Replace with actual API key
    this.initializeNote();
  }

  private initializeNote() {
    this.note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      subject: '',
      highlights: [],
      bookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async onGenerateContent() {
    if (!this.note.title) {
      alert('Please enter a title first');
      return;
    }

    this.isGenerating = true;
    this.notifyPropertyChange('isGenerating', true);

    try {
      const result = await this.geminiService.generateStudyMaterial(this.note.title);
      
      this.note.content = result.content;
      this.notifyPropertyChange('note', this.note);

      // For demonstration, we'll just show placeholders for the images
      this.generatedImages = result.imagePrompts.map(prompt => ({
        imageUrl: 'res://placeholder'
      }));
      this.notifyPropertyChange('generatedImages', this.generatedImages);

    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      this.isGenerating = false;
      this.notifyPropertyChange('isGenerating', false);
    }
  }

  async onSave() {
    try {
      this.note.updatedAt = new Date();
      await this.dbService.saveNote(this.note);
      Frame.topmost().goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  async onExportText() {
    try {
      const filePath = await this.exportService.exportAsText(this.note, 'txt');
      console.log('Text file exported to:', filePath);
    } catch (error) {
      console.error('Error exporting text:', error);
    }
  }

  async onExportMarkdown() {
    try {
      const filePath = await this.exportService.exportAsText(this.note, 'md');
      console.log('Markdown file exported to:', filePath);
    } catch (error) {
      console.error('Error exporting markdown:', error);
    }
  }
}

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new NoteEditorViewModel();
}