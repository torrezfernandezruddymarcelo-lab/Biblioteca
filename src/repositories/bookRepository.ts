import initialBooks from "../data/books.json";
import { storageService } from "../services/storageService";
import type { Book } from "../types/book";

const BOOKS_KEY = "biblioteca_books";

const getBooks = (): Book[] => {
  return storageService.get<Book[]>(BOOKS_KEY) ?? (initialBooks as Book[]);
};

const saveBooks = (books: Book[]) => {
  storageService.set(BOOKS_KEY, books);
};

export const bookRepository = {
  getAll(): Book[] {
    return getBooks();
  },

  getById(id: string): Book | null {
    return getBooks().find((book) => book.id === id) ?? null;
  },

  search(term: string): Book[] {
    const normalized = term.trim().toLowerCase();

    if (!normalized) return getBooks();

    return getBooks().filter((book) =>
      [
        book.title,
        book.author,
        book.category,
        book.status,
        String(book.year),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  },

  add(bookData: Omit<Book, "id">): Book {
    const books = getBooks();

    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
    };

    saveBooks([...books, newBook]);
    return newBook;
  },

  deleteById(id: string): boolean {
    const books = getBooks();
    const updated = books.filter((book) => book.id !== id);

    if (updated.length === books.length) return false;

    saveBooks(updated);
    return true;
  },

  updateStatus(id: string, status: Book["status"]): boolean {
    const books = getBooks();
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) return false;

    books[index] = { ...books[index], status };
    saveBooks(books);
    return true;
  },
};