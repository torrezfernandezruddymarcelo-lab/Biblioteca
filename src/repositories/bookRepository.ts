import initialBooks from "../data/books.json";
import { storageService } from "../services/storageService";
import type { Book } from "../types/book";

const BOOKS_KEY = "biblioteca_books";

const getBooks = (): Book[] => {
  const storedBooks = storageService.get<Book[]>(BOOKS_KEY);
  const defaults = initialBooks as Book[];

  if (!storedBooks) return defaults;

  // Mantiene los libros guardados y agrega los nuevos del catálogo inicial
  // que todavía no existen en el almacenamiento local del navegador.
  const mergedBooks = [...storedBooks];
  defaults.forEach((defaultBook) => {
    const existingIndex = mergedBooks.findIndex((book) => book.id === defaultBook.id);

    if (existingIndex === -1) {
      mergedBooks.push(defaultBook);
    } else {
      mergedBooks[existingIndex] = {
        ...defaultBook,
        ...mergedBooks[existingIndex],
        pdfUrl: mergedBooks[existingIndex].pdfUrl || defaultBook.pdfUrl,
      };
    }
  });

  return mergedBooks.map(({ status: _status, ...book }) => book as Book);
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
      [book.title, book.author, book.category, String(book.year)]
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
};
