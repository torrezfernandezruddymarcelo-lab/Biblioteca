import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRepository } from "../repositories/bookRepository";

function AdminBookCreatePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (!authRepository.isAdmin()) return <Navigate to="/" replace />;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericYear = Number(year);

    if (!title.trim() || !author.trim() || !category.trim()) {
      setMessage("Completa los campos obligatorios.");
      return;
    }

    if (!Number.isInteger(numericYear) || numericYear < 0) {
      setMessage("Introduce un año válido.");
      return;
    }

    bookRepository.add({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      year: numericYear,
      description: description.trim(),
      status: "Disponible",
      ...(pdfUrl.trim() ? { pdfUrl: pdfUrl.trim() } : {}),
    });

    navigate("/books");
  };

  return (
    <main className="sketch-page">
      <header className="sketch-header">
        <Link className="sketch-logo" to="/">B Biblioteca Galáctica</Link>
        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>
          <Link to="/books">Catálogo</Link>
          <Link to="/admin/solicitudes-libros">Solicitudes</Link>
        </nav>
      </header>

      <section className="sketch-form-section">
        <span className="sketch-kicker">ADMINISTRACIÓN</span>
        <h1>Agregar un nuevo libro</h1>
        <p>Incorpora una nueva aventura al catálogo.</p>

        <form className="sketch-admin-form" onSubmit={handleSubmit}>
          <label>
            Título del libro *
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label>
            Autor *
            <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </label>

          <label>
            Categoría *
            <input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </label>

          <label>
            Año de publicación
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>

          <label>
            Ruta del PDF (opcional)
            <input
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="/libros/mi-libro.pdf"
            />
          </label>

          {message && <p role="alert">{message}</p>}

          <button className="sketch-button" type="submit">
            Guardar libro
          </button>

          <Link to="/books">Cancelar</Link>
        </form>
      </section>
    </main>
  );
}

export default AdminBookCreatePage;