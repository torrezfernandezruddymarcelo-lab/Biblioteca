import GlobalNavigation from "../components/GlobalNavigation";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";
import { bookRequestRepository } from "../repositories/bookRequestRepository";

function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const user = authRepository.getCurrentUser();
  const book = bookId ? bookRepository.getById(bookId) : null;

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  if (!book) {
    return (
      <main className="sketch-page">\n      <GlobalNavigation />
        <section className="sketch-catalog">
          <h1>Libro no encontrado</h1>
          <Link to="/books">Volver al catálogo</Link>
        </section>
      </main>
    );
  }

  const handleRequest = () => {
    const result = bookRequestRepository.create(book.id, {
      id: user.id,
      name: user.name,
      carnet: user.carnet,
    });

    setSuccess(result.success);
    setMessage(result.message);
  };

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="sketch-page">
      <header className="sketch-header">
        <Link className="sketch-logo" to="/">
          <span>B</span> Biblioteca Galáctica
        </Link>

        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>
          <Link to="/books">Catálogo</Link>
        </nav>

        <button className="sketch-profile" onClick={handleLogout}>
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
            <p><strong>Estado:</strong> {book.status}</p>
            <p><strong>Solicitante:</strong> {user.name}</p>

            {book.pdfUrl && (
              <a href={book.pdfUrl} target="_blank" rel="noreferrer">
                Leer PDF
              </a>
            )}

            {user.role === "USUARIO" && (
              <button
                className="sketch-button"
                type="button"
                onClick={handleRequest}
                disabled={book.status !== "Disponible"}
              >
                {book.status === "Disponible"
                  ? "Solicitar préstamo"
                  : "Libro no disponible"}
              </button>
            )}

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={success ? "request-success" : "request-error"}
              >
                {message}
              </p>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

export default BookDetailPage;