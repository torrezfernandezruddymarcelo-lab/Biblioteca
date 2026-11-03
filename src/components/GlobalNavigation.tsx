import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

function GlobalNavigation() {
  const user = authRepository.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const canManageBooks = authRepository.canManageBooks();
  const isPrincipalAdmin = authRepository.isPrincipalAdmin();

  const logout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/books?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <aside className="library-sidebar">
        <Link to="/" className="library-sidebar-brand">
          <span className="library-brand-book" aria-hidden="true"><i>✦</i><b>📖</b><i>✧</i></span>
          <strong>Biblioteca<br /><em>Galáctica</em></strong>
          <small>UN UNIVERSO POR LEER</small>
        </Link>
        <div className="library-sidebar-divider" />
        <span className="library-menu-caption">MENÚ PRINCIPAL</span>
        <nav className="library-side-links">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">⌂ <span>Inicio</span></Link>
          <Link className={location.pathname.startsWith("/books") ? "active" : ""} to="/books">▤ <span>Catálogo</span></Link>
          {canManageBooks && <Link className={location.pathname === "/admin/libros/nuevo" ? "active" : ""} to="/admin/libros/nuevo">＋ <span>Agregar libros</span></Link>}
          {isPrincipalAdmin && <Link className={location.pathname === "/admin/solicitudes-administrador" ? "active" : ""} to="/admin/solicitudes-administrador">♙ <span>Administradores</span></Link>}
        </nav>
        <div className="library-sidebar-bottom">✦ <span>Explora. Aprende. Imagina.</span></div>
      </aside>
      <header className="library-topbar">
        <form className="library-global-search" onSubmit={submitSearch}>
          <span>⌕</span>
          <input aria-label="Buscar en el catálogo" placeholder="Buscar libros, autores o categorías..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit">Buscar</button>
        </form>
        <div className="library-account">
          <span className="library-account-avatar">♙</span>
          <span className="library-account-name">{user?.name ?? "Mi cuenta"}</span>
          <button type="button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}>↪</button>
        </div>
      </header>
    </>
  );
}
export default GlobalNavigation;
