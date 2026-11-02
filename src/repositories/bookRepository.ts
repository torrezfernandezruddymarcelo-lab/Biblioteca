import initialBooks from "../data/books.json";
import { storageService } from "../services/storageService";
import type { Book } from "../types/book";

const BOOKS_KEY = "biblioteca_books";

// IDs de las obras que venían precargadas en el catálogo.
const PRELOADED_BOOK_IDS = new Set([
  "book-1",
  "book-2",
  "book-3",
  "book-4",
  "book-5",
  "obra-clasicas-de-siempre",
]);

const getBooks = (): Book[] => {
  const storedBooks = storageService.get<Book[]>(BOOKS_KEY);
  const defaults = initialBooks as Book[];

  // Conserva únicamente los libros agregados desde el panel de administración.
  const userBooks = (storedBooks ?? []).filter(
    (book) => !PRELOADED_BOOK_IDS.has(book.id)
  );

  return userBooks.map(({ status: _status, ...book }) => book as Book);
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
