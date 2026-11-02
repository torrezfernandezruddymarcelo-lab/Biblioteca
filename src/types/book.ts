export type BookStatus = "Disponible" | "Reservado" | "Prestado";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  status: BookStatus;
  description: string;
  pdfUrl?: string;
}