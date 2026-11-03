import { storageService } from "../services/storageService";
import { bookRepository } from "./bookRepository";
import type { BookRequest } from "../types/bookRequest";

const REQUESTS_KEY = "biblioteca_requests";

const getRequests = (): BookRequest[] =>
  storageService.get<BookRequest[]>(REQUESTS_KEY) ?? [];

const saveRequests = (requests: BookRequest[]) =>
  storageService.set(REQUESTS_KEY, requests);

export const bookRequestRepository = {
  getAll(): BookRequest[] {
    return getRequests();
  },

  getByUser(userId: string): BookRequest[] {
    return getRequests().filter((request) => request.userId === userId);
  },

  create(bookId: string, user: { id: string; name: string; carnet: string }) {
    const book = bookRepository.getById(bookId);
    if (!book) return { success: false, message: "El libro no existe." };
    if (book.status !== "Disponible") {
      return { success: false, message: `El libro no está disponible. Estado: ${book.status}.` };
    }

    const requests = getRequests();
    const duplicate = requests.some((request) =>
      request.bookId === bookId &&
      request.userId === user.id &&
      (request.status === "Solicitado" || request.status === "Aprobado")
    );
    if (duplicate) {
      return { success: false, message: "Ya tienes una solicitud pendiente o un préstamo activo para este libro." };
    }

    const request: BookRequest = {
      id: crypto.randomUUID(),
      bookId: book.id,
      bookTitle: book.title,
      userId: user.id,
      userName: user.name,
      carnet: user.carnet,
      requestedAt: new Date().toISOString(),
      status: "Solicitado",
    };
    saveRequests([...requests, request]);
    return { success: true, message: `¡Solicitud realizada con éxito! Se solicitó "${book.title}".` };
  },

  approve(id: string) {
    const requests = getRequests();
    const request = requests.find((item) => item.id === id);
    if (!request || request.status !== "Solicitado") {
      return { success: false, message: "La solicitud ya no está pendiente." };
    }
    const book = bookRepository.getById(request.bookId);
    if (!book || book.status !== "Disponible") {
      return { success: false, message: "El libro ya no está disponible." };
    }
    if (!bookRepository.updateStatus(request.bookId, "Prestado")) {
      return { success: false, message: "No se pudo actualizar la disponibilidad del libro." };
    }
    saveRequests(requests.map((item) =>
      item.id === id ? { ...item, status: "Aprobado" } : item
    ));
    return { success: true, message: "Solicitud aprobada correctamente." };
  },

  reject(id: string) {
    const requests = getRequests();
    const request = requests.find((item) => item.id === id);
    if (!request || request.status !== "Solicitado") {
      return { success: false, message: "No se pudo rechazar la solicitud." };
    }
    saveRequests(requests.map((item) =>
      item.id === id ? { ...item, status: "Rechazado" } : item
    ));
    return { success: true, message: "Solicitud rechazada." };
  },

  returnBook(id: string) {
    const requests = getRequests();
    const request = requests.find((item) => item.id === id);
    if (!request || request.status !== "Aprobado") {
      return { success: false, message: "No se puede registrar la devolución." };
    }
    if (!bookRepository.updateStatus(request.bookId, "Disponible")) {
      return { success: false, message: "No se pudo actualizar el libro." };
    }
    saveRequests(requests.map((item) =>
      item.id === id ? { ...item, status: "Devuelto" } : item
    ));
    return { success: true, message: "Libro devuelto correctamente." };
  },
};
