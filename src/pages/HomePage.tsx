import GlobalNavigation from "../components/GlobalNavigation";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";
import { bookRequestRepository } from "../repositories/bookRequestRepository";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  const books = bookRepository.getAll();
  const requests = bookRequestRepository.getByUser(user.id);

  const isAdmin = authRepository.isAdmin();
  const isPrincipalAdmin = authRepository.isPrincipalAdmin();

  const logout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
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

          {isAdmin && (
            <Link to="/admin/libros/nuevo">
              Agregar libros
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/solicitudes-libros">
              Solicitudes
            </Link>
          )}

          {isPrincipalAdmin && (
            <Link to="/admin/solicitudes-administrador">
              Solicitudes de administradores
            </Link>
          )}
        </nav>

        <button className="sketch-profile" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <section className="sketch-hero sketch-hero--admin-art">
        <div className="sketch-welcome-copy">
          <h1>Bienvenido a la biblioteca galáctica, <span>{user.name.trim().split(/\s+/)[0]}</span></h1>
        </div>
        {false && <div className="sketch-hero-copy">
          <span className="sketch-kicker">
            BIENVENIDO A TU BIBLIOTECA
          </span>

          <h1>¡Hola, {user.name}!</h1>

          <p>
            Prepárate para explorar nuevas historias, aprender y encontrar
            tu próxima aventura entre miles de páginas.
          </p>

          <Link className="sketch-button" to="/books">
            Explorar libros
          </Link>
        </div>}

        <div className="sketch-space-scene" aria-hidden="true">
          <div className="sketch-planet-large" />
          <div className="sketch-planet-small" />
          <div className="sketch-planet-medium" />
          <div className="sketch-planet-ringed" />
          <div className="sketch-moon" />
          <div className="sketch-star">✦</div>
          <div className="sketch-star sketch-star-two">✧</div>
          <div className="sketch-platform" />

          <div className="sketch-hero-robot">
            <div className="robot-head">
              <div className="robot-eye robot-eye-left" />
              <div className="robot-eye robot-eye-right" />
              <div className="robot-mouth" />
            </div>
            <div className="robot-neck" />
            <div className="robot-body"><div className="robot-chest-light" /></div>
            <div className="robot-arm robot-arm-left" />
            <div className="robot-arm robot-arm-right" />
            <div className="robot-leg robot-leg-left" />
            <div className="robot-leg robot-leg-right" />
            <div className="robot-foot robot-foot-left" />
            <div className="robot-foot robot-foot-right" />
          </div>
        </div>
      </section>

      <section className="sketch-stats">
        <article>
          <span>Libros registrados</span>
          <strong>{books.length}</strong>
        </article>

        <article>
          <span>Categorías</span>
          <strong>{new Set(books.map((book) => book.category)).size}</strong>
        </article>

        <article>
          <span>Mis solicitudes</span>
          <strong>{requests.length}</strong>
        </article>
      </section>

      <section className="sketch-catalog">
        <div className="sketch-section-heading">
          <span className="sketch-kicker">
            TU ESPACIO DE LECTURA
          </span>

          <h2>Continúa tu aventura</h2>

          <p>
            Explora el catálogo y encuentra algo nuevo para leer.
          </p>

          <Link className="sketch-button" to="/books">
            Ver todo el catálogo
          </Link>
        </div>

        <div className="sketch-book-grid">
          {books.slice(0, 4).map((book, index) => (
            <article className="sketch-book-card" key={book.id}>
              <Link to={`/books/${book.id}`}>
                <div
                  className={`sketch-cover ${
                    [
                      "cover-blue",
                      "cover-purple",
                      "cover-orange",
                      "cover-green",
                    ][index % 4]
                  }`}
                >
                  <span>{book.title.charAt(0).toUpperCase()}</span>
                  <strong>{book.title}</strong>
                </div>
              </Link>

              <div className="sketch-book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>

                <Link to={`/books/${book.id}`}>
                  Ver libro →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="sketch-footer">
        Biblioteca Galáctica · La lectura también es una aventura.
      </footer>
    </main>
  );
}

export default HomePage;
