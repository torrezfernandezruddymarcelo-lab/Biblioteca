export type BookStatus = "Disponible" | "Prestado";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  pdfUrl?: string;
  status: BookStatus;
}
