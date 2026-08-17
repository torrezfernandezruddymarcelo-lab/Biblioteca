import { Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";

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
];

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    
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

          <div className="home-search" role="search">
            <label htmlFor="book-search">Buscar en biblioteca</label>
            <div>
              <input
                id="book-search"
                name="book-search"
                placeholder="Buscar por título, autor o categoría"
                type="search"
              />
              <button type="button">Buscar</button>
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
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="home-panel home-panel--accent" id="actividad">
          <span className="home-kicker">Actividad reciente</span>
          <h2>Todo al día</h2>
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

export default HomePage;