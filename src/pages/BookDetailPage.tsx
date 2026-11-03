import GlobalNavigation from "../components/GlobalNavigation";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";
import { bookRequestRepository } from "../repositories/bookRequestRepository";

function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [message, setMessage] = useState("");

  const user = authRepository.getCurrentUser();
  const book = bookId ? bookRepository.getById(bookId) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (!book) {
    return (
      <main className="sketch-page">
        <GlobalNavigation />
        <section className="sketch-catalog">
          <h1>Libro no encontrado</h1>
          <Link to="/books">Volver al catálogo</Link>
        </section>
      </main>
    );
  }

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleRequest = () => {
    const result = bookRequestRepository.create(book.id, user);
    setMessage(result.message);
  };

  return (
    <main className="sketch-page">
      <GlobalNavigation />
      <header className="sketch-header">
        <Link className="sketch-logo" to="/">
          <span>B</span> Biblioteca Galáctica
        </Link>

        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>
          <Link to="/books">Catálogo</Link>
        </nav>

        <button className="sketch-profile" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="sketch-catalog">
        <Link to="/books">← Volver al catálogo</Link>

        <div className="sketch-book-layout">
          <div className="sketch-book-card">
            <div className="sketch-cover cover-blue">
              <span>{book.title.charAt(0).toUpperCase()}</span>
              <strong>{book.title}</strong>
            </div>
          </div>

          <article className="sketch-book-info">
            <span className="sketch-kicker">{book.category}</span>
            <h1>{book.title}</h1>
            <h3>{book.author}</h3>
            <p>{book.description}</p>
            <p><strong>Año:</strong> {book.year}</p>
            <p><strong>Disponibilidad:</strong> {book.status}</p>

            {book.pdfUrl && (
              <a className="sketch-button" href={book.pdfUrl} target="_blank" rel="noreferrer">
                Ver libro en línea
              </a>
            )}

            <button
              className="sketch-button"
              type="button"
              onClick={handleRequest}
              disabled={book.status !== "Disponible"}
            >
              {book.status === "Disponible" ? "Solicitar préstamo" : "No disponible"}
            </button>

            {message && <p role="status" aria-live="polite">{message}</p>}
          </article>
        </div>
      </section>
    </main>
  );
}

export default BookDetailPage;
