import initialBooks from "../data/books.json";
import { storageService } from "../services/storageService";
import type { Book, BookStatus } from "../types/book";

const BOOKS_KEY = "biblioteca_books";

const normalizeBook = (book: Partial<Book> & Pick<Book, "id" | "title" | "author" | "category" | "year" | "description">): Book => ({
  ...book,
  status: book.status === "Prestado" ? "Prestado" : "Disponible",
});

const getBooks = (): Book[] => {
  const storedBooks = storageService.get<Book[]>(BOOKS_KEY) ?? [];
  const defaults = (initialBooks as Book[]).map(normalizeBook);
  const customBooks = storedBooks
    .filter((book) => !defaults.some((defaultBook) => defaultBook.id === book.id))
    .map(normalizeBook);

  return [...defaults, ...customBooks];
};

const saveBooks = (books: Book[]): void => {
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
    const books = getBooks();

    if (!normalized) return books;

    return books.filter((book) =>
      [book.title, book.author, book.category, String(book.year)]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  },

  add(bookData: Omit<Book, "id" | "status"> & { status?: BookStatus }): Book {
    const books = getBooks();
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      status: bookData.status ?? "Disponible",
    };

    saveBooks([...books, newBook]);
    return newBook;
  },

  updateStatus(id: string, status: BookStatus): boolean {
    const books = getBooks();
    const exists = books.some((book) => book.id === id);
    if (!exists) return false;

    saveBooks(books.map((book) => book.id === id ? { ...book, status } : book));
    return true;
  },

  deleteById(id: string): boolean {
    const books = getBooks();
    const updated = books.filter((book) => book.id !== id);

    if (updated.length === books.length) return false;

    saveBooks(updated);
    return true;
  },
};
