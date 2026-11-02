export type RequestStatus = "Solicitado" | "Aprobado" | "Rechazado" | "Devuelto";

export interface BookRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  carnet: string;
  requestedAt: string;
  status: RequestStatus;
}