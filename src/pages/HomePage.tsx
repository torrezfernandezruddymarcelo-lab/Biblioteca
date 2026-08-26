 codex/mostrar-estructura-de-archivos
import { useState } from "react";

 main
import { Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";

 codex/mostrar-estructura-de-archivos
const recentActivity = [
  "Reserva confirmada para Clean Code",
  "Nuevo material agregado a la categoría Ciencia",
  "Recuerda devolver tus préstamos antes de la fecha límite",

const quickStats = [
  {
    label: "Libros disponibles",
    value: "1.248",
    helper: "Catálogo actualizado",
  },
  {
    label: "Mis préstamos",
    value: "03",
    helper: "2 por devolver",
  },
  {
    label: "Reservas",
    value: "05",
    helper: "En seguimiento",
  },
];

const featuredBooks = [
  {
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    tag: "Literatura",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    tag: "Programación",
  },
  {
    title: "Breve historia del tiempo",
    author: "Stephen Hawking",
    tag: "Ciencia",
  },
];

const recentActivity = [
  "Reserva confirmada para Arquitectura limpia",
  "Devolución pendiente: Historia universal ilustrada",
  "Nuevo material agregado a Tecnología",
 main
];

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");

  const books = bookRepository.getAll();
  const filteredBooks = bookRepository.search(searchTerm);
  const availableBooks = books.filter((book) => book.status === "Disponible").length;
  const reservedBooks = books.filter((book) => book.status === "Reservado").length;

 codex/mostrar-estructura-de-archivos
  const quickStats = [
    {
      label: "Libros registrados",
      value: books.length.toString().padStart(2, "0"),
      helper: "Catálogo base listo",
    },
    {
      label: "Disponibles",
      value: availableBooks.toString().padStart(2, "0"),
      helper: "Listos para préstamo",
    },
    {
      label: "Reservados",
      value: reservedBooks.toString().padStart(2, "0"),
      helper: "Con seguimiento activo",
    },
  ];


 main
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
 codex/mostrar-estructura-de-archivos

    
 main
    <main className="home-page">
      <nav className="home-nav" aria-label="Navegación principal">
        <a className="home-nav__brand" href="#inicio">
          <span aria-hidden="true">B</span>
          Biblioteca
        </a>

        <div className="home-nav__links">
          <a href="#catalogo">Catálogo</a>
          <a href="#actividad">Actividad</a>
          <a href="#perfil">Perfil</a>
        </div>
 codex/mostrar-estructura-de-archivos

        <button className="home-nav__logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      <section className="home-hero" id="inicio">
        <div className="home-hero__content">
          <span className="home-kicker">Inicio</span>
          <h1>Bienvenido, {user.name}</h1>
          <p>
            Explora el catálogo, revisa disponibilidad y encuentra rápidamente
            los libros principales de la biblioteca.
          </p>



        <button className="home-nav__logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

  
       
      <section className="home-hero" id="inicio">
        <div className="home-hero__content">
          <span className="home-kicker">Inicio</span>
          <h1>Bienvenido, {user.name}</h1>
          <p>
            Explora libros, revisa tus préstamos y mantén tus reservas organizadas
            desde una página principal clara, moderna y conectada con tu biblioteca.
          </p>

 main
          <div className="home-search" role="search">
            <label htmlFor="book-search">Buscar en biblioteca</label>
            <div>
              <input
                id="book-search"
                name="book-search"
 codex/mostrar-estructura-de-archivos
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por título, autor, año o categoría"
                type="search"
                value={searchTerm}
              />
              <button type="button" onClick={() => setSearchTerm("")}>
                Limpiar
              </button>

                placeholder="Buscar por título, autor o categoría"
                type="search"
              />
              <button type="button">Buscar</button>
 main
            </div>
          </div>
        </div>

        <aside className="home-profile-card" id="perfil" aria-label="Datos del usuario">
          <div className="home-profile-card__avatar" aria-hidden="true">
            {user.name.charAt(0)}
          </div>
          <span>Sesión activa</span>
          <h2>{user.name}</h2>
          <p>Carnet: {user.carnet}</p>
          <p>Rol: {user.role}</p>
        </aside>
      </section>

      <section className="home-stats" aria-label="Resumen de biblioteca">
        {quickStats.map((stat) => (
          <article className="home-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.helper}</p>
          </article>
        ))}
      </section>

      <section className="home-grid">
        <article className="home-panel" id="catalogo">
          <div className="home-panel__header">
            <span className="home-kicker">Catálogo destacado</span>
 codex/mostrar-estructura-de-archivos
            <h2>5 libros agregados</h2>
            <p>
              Mostrando {filteredBooks.length} de {books.length} libros del catálogo.
            </p>
          </div>

          <div className="home-books">
            {filteredBooks.map((book) => (
              <article className="home-book" key={book.id}>
                <div className="home-book__cover" aria-hidden="true">
                  {book.title.charAt(0)}
                </div>
                <div className="home-book__content">
                  <span>{book.category}</span>
                  <h3>{book.title}</h3>
                  <p>
                    {book.author} · {book.year}
                  </p>
                  <p>{book.description}</p>
                  <strong
                    className={`home-book__status home-book__status--${book.status.toLowerCase()}`}
                  >
                    {book.status}
                  </strong>

            <h2>Libros para empezar hoy</h2>
          </div>

          
          <div className="home-books">
            {featuredBooks.map((book) => (
              <article className="home-book" key={book.title}>
                <div className="home-book__cover" aria-hidden="true">
                  {book.title.charAt(0)}
                </div>
                <div>
                  <span>{book.tag}</span>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
 main
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="home-panel home-panel--accent" id="actividad">
          <span className="home-kicker">Actividad reciente</span>
 codex/mostrar-estructura-de-archivos
          <h2>Proyecto listo</h2>
          <p>
            El Home ya conecta usuarios, cierre de sesión, búsqueda y catálogo inicial
            de libros para continuar construyendo la biblioteca.
          </p>

          <h2>Todo al día</h2>
 main
          <ul className="home-activity">
            {recentActivity.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

 codex/mostrar-estructura-de-archivos
export default HomePage;

export default HomePage;
 main
