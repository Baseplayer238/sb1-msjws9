export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  highlights: string[];
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Highlight {
  noteId: string;
  text: string;
  color: string;
  position: number;
}