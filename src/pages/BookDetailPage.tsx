import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";

function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const user = authRepository.getCurrentUser();
  const book = bookId ? bookRepository.getById(bookId) : null;

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!book) {
    return (
      <main className="book-detail-page">
        <section className="book-detail-shell book-detail-shell--empty">
          <span className="home-kicker">Libro no encontrado</span>
          <h1>No pudimos encontrar este libro</h1>
          <p>Vuelve al catálogo para seleccionar uno de los libros disponibles.</p>
          <Link className="book-detail__back" to="/">
            Volver al Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="book-detail-page">
      <nav className="home-nav" aria-label="Navegación de detalle">
        <Link className="home-nav__brand" to="/">
          <span aria-hidden="true">B</span>
          Biblioteca
        </Link>

        <div className="home-nav__links">
          <Link to="/">Home</Link>
          <a href="#detalle">Detalle</a>
          <a href="#prestamo">Préstamo</a>
        </div>

        <button className="home-nav__logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      <section className="book-detail-shell" id="detalle">
        <div className="book-detail__cover" aria-hidden="true">
          {book.title.charAt(0)}
        </div>

        <article className="book-detail__content">
          <span className="home-kicker">{book.category}</span>
          <h1>{book.title}</h1>
          <p className="book-detail__author">{book.author}</p>
          <p>{book.description}</p>

          <dl className="book-detail__meta">
            <div>
              <dt>Año</dt>
              <dd>{book.year}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <strong
                  className={`home-book__status home-book__status--${book.status.toLowerCase()}`}
                >
                  {book.status}
                </strong>
              </dd>
            </div>
            <div>
              <dt>Usuario</dt>
              <dd>{user.name}</dd>
            </div>
          </dl>

          <div className="book-detail__actions" id="prestamo">
            <Link className="book-detail__back" to="/">
              Volver al catálogo
            </Link>
            <button className="book-detail__reserve" type="button">
              Solicitar préstamo
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default BookDetailPage;
