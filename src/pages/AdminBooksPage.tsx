import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";
import type { Book } from "../types/book";

function AdminBooksPage() {
  const user = authRepository.getCurrentUser();
  const [books] = useState<Book[]>(() => bookRepository.getAll());

  if (!user || !authRepository.isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  const isPrincipalAdmin = authRepository.isPrincipalAdmin();

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Panel de administración</h1>
          <p>Bienvenido, {user.name}</p>
        </div>
        <Link to="/">Volver al inicio</Link>
      </header>

      <section className="admin-menu">
        <h2>Administración de Biblioteca</h2>
        <p>Selecciona una opción.</p>
        <div className="admin-menu-options">
          <Link to="/admin/libros/nuevo" className="admin-option">
            <span>📚</span>
            <strong>Agregar libros</strong>
            <small>Registrar nuevos libros.</small>
          </Link>


          {isPrincipalAdmin && (
            <Link to="/admin/solicitudes-administrador" className="admin-option">
              <span>👩‍🏫</span>
              <strong>Solicitudes de docentes</strong>
              <small>Aprobar o rechazar solicitudes para obtener el rol de docente.</small>
            </Link>
          )}
        </div>
      </section>

      <section className="admin-books">
        <h2>Libros registrados</h2>
        {books.length === 0 ? (
          <p>No hay libros registrados todavía.</p>
        ) : (
          <div className="admin-books-list">
            {books.map((book) => (
              <article key={book.id} className="admin-book-item">
                <div>
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>Categoría: {book.category}</p>
                  <p>Estado: {book.status}</p>
                </div>
                <Link to={`/books/${book.id}`}>Ver libro</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBooksPage;
