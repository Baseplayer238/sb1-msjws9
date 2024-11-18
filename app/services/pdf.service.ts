import { File, Folder, knownFolders, path } from '@nativescript/core';

export class PdfService {
  async generatePdf(note: any): Promise<string> {
    const documents = knownFolders.documents();
    const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(documents.path, fileName);

    // Create a simple text file for now since HTML to PDF conversion
    // requires additional native dependencies
    const content = `${note.title}\n\n${note.content}`;
    const file = File.fromPath(filePath);
    await file.writeText(content);

    return filePath;
  }
}