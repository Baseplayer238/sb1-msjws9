import { File, Folder, knownFolders, path } from '@nativescript/core';
import { StudyNote } from '../models/study-note';

export class ExportService {
  async exportAsText(note: StudyNote, format: 'txt' | 'md'): Promise<string> {
    const documents = knownFolders.documents();
    const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${format}`;
    const filePath = path.join(documents.path, fileName);

    let content: string;
    if (format === 'md') {
      content = `# ${note.title}\n\n## ${note.subject}\n\n${note.content}`;
    } else {
      content = `${note.title}\n\n${note.subject}\n\n${note.content}`;
    }

    const file = File.fromPath(filePath);
    await file.writeText(content);

    return filePath;
  }
}