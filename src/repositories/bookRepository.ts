import books from "../data/books.json";
import type { Book } from "../types/book";

const catalog = books as Book[];

export const bookRepository = {
  getAll(): Book[] {
    return catalog;
  },

  getById(id: string): Book | null {
    return catalog.find((book) => book.id === id) ?? null;
  },

  search(term: string): Book[] {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      return catalog;
    }

    return catalog.filter((book) => {
      const searchableText = [
        book.title,
        book.author,
        book.category,
        book.status,
        String(book.year),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedTerm);
    });
  },
};
