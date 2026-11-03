import GlobalNavigation from "../components/GlobalNavigation";

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";

function BooksPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("search") ?? "");
  const [category, setCategory] = useState("Todas");
  const [refresh, setRefresh] = useState(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allBooks = bookRepository.getAll();

  const categories = [
    "Todas",
    ...Array.from(new Set(allBooks.map((book) => book.category))),
  ];

  const filteredBooks = bookRepository.search(search).filter(
    (book) => category === "Todas" || book.category === category
  );

  const handleDelete = (id: string) => {
    if (!authRepository.isAdmin()) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este libro?"
    );

    if (!confirmed) return;

    const deleted = bookRepository.deleteById(id);

    if (deleted) {
      setRefresh((previous) => previous + 1);
    }
  };

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="sketch-page">
      <GlobalNavigation />
      <header className="sketch-header">
        <Link className="sketch-logo" to="/">
          <span>B</span>
          Biblioteca Galáctica
        </Link>

        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>
          <Link to="/books">Catálogo</Link>

          {authRepository.canManageBooks() && <Link to="/admin/libros/nuevo">Agregar libros</Link>}
        </nav>

        <button
          className="sketch-profile"
          type="button"
          onClick={handleLogout}
        >
          {user.name} · Salir
        </button>
      </header>

      <section className="sketch-hero sketch-hero--catalog-art">
        <div className="catalog-robot-scene" aria-hidden="true">
          <div className="catalog-planet catalog-planet-left" />
          <div className="catalog-galaxy" />
          <div className="catalog-planet catalog-planet-right" />
          <div className="catalog-books-stack"><i /><i /><i /></div>
          <div className="catalog-reading-robot">
            <div className="catalog-robot-head">
              <span className="catalog-robot-eye" />
              <span className="catalog-robot-eye" />
              <span className="catalog-robot-smile" />
            </div>
            <div className="catalog-robot-body" />
            <div className="catalog-robot-arm catalog-robot-arm-left" />
            <div className="catalog-robot-arm catalog-robot-arm-right" />
            <div className="catalog-open-book"><span /><span /></div>
            <div className="catalog-robot-leg catalog-robot-leg-left" />
            <div className="catalog-robot-leg catalog-robot-leg-right" />
          </div>
          <span className="catalog-spark catalog-spark-one">✦</span>
          <span className="catalog-spark catalog-spark-two">✧</span>
        </div>
        <div className="catalog-hero-copy">
          <span className="sketch-kicker">BIBLIOTECA GALÁCTICA</span>
          <h1>Explora un universo lleno de libros</h1>
          <p>Cada libro es una nueva aventura. Encuentra tu próxima historia favorita y descubre nuevos conocimientos.</p>
          <a className="sketch-button" href="#catalogo">Explorar catálogo</a>
        </div>
      </section>

      <section className="sketch-catalog" id="catalogo">
        <div className="sketch-section-heading">
          <span className="sketch-kicker">NUESTRO UNIVERSO</span>

          <h2>Descubre los libros</h2>

          <p>
            Busca libros por título, autor, año o categoría.
          </p>
        </div>

        <div className="sketch-search">
          <input
            type="search"
            placeholder="Buscar libros..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="sketch-filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p>
          Mostrando {filteredBooks.length} de {allBooks.length} libros
        </p>

        <div className="sketch-book-grid" key={refresh}>
          {filteredBooks.map((book, index) => {
            const coverClasses = [
              "cover-blue",
              "cover-purple",
              "cover-orange",
              "cover-green",
            ];

            return (
              <article className="sketch-book-card" key={book.id}>
                <Link to={`/books/${book.id}`}>
                  <div
                    className={`sketch-cover ${
                      coverClasses[index % coverClasses.length]
                    }`}
                  >
                    <span>
                      {book.title.charAt(0).toUpperCase()}
                    </span>

                    <strong>{book.title}</strong>
                  </div>
                </Link>

                <div className="sketch-book-info">
                  <span>{book.category}</span>

                  <h3>{book.title}</h3>

                  <p>{book.author}</p>

                  <p>{book.year}</p>


                  <Link to={`/books/${book.id}`}>
                    Ver detalles →
                  </Link>

                  {authRepository.isAdmin() && (
                    <button
                      type="button"
                      onClick={() => handleDelete(book.id)}
                    >
                      Eliminar libro
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="sketch-empty">
            <h3>No encontramos libros</h3>
            <p>
              Prueba con otro título, autor o categoría.
            </p>
          </div>
        )}
      </section>

      <footer className="sketch-footer">
        Biblioteca Galáctica · La lectura también es una aventura.
      </footer>
    </main>
  );
}

export default BooksPage;
