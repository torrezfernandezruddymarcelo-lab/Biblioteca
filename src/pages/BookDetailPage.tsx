import GlobalNavigation from "../components/GlobalNavigation";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";

function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();

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

            {book.pdfUrl && (
              <a className="sketch-button" href={book.pdfUrl} target="_blank" rel="noreferrer">
                Ver libro en línea
              </a>
            )}

          </article>
        </div>
      </section>
    </main>
  );
}

export default BookDetailPage;