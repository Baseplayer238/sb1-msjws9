export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}