import GlobalNavigation from "../components/GlobalNavigation";

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { bookRequestRepository } from "../repositories/bookRequestRepository";

function AdminBookRequestsPage() {
  const user = authRepository.getCurrentUser();
const [, setRefresh] = useState(0);
  const [message, setMessage] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (!authRepository.isAdmin()) return <Navigate to="/" replace />;

  const isPrincipalAdmin = authRepository.isPrincipalAdmin();

  const requests = bookRequestRepository.getAll();

  const execute = (
    action: () => { success: boolean; message: string }
  ) => {
    const result = action();
    setMessage(result.message);

    if (result.success) {
      setRefresh((value) => value + 1);
    }
  };

  return (
    <main className="sketch-page">
      <GlobalNavigation />
      <header className="sketch-header">
        <Link className="sketch-logo" to="/">
          B Biblioteca Galáctica
        </Link>

        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>

          <Link to="/books">Catálogo</Link>

          <Link to="/admin/libros/nuevo">
            Agregar libros
          </Link>

          <Link to="/admin/solicitudes-libros">
            Solicitudes
          </Link>

          {isPrincipalAdmin && (
            <Link to="/admin/solicitudes-administrador">
              Solicitudes de administradores
            </Link>
          )}
        </nav>
      </header>

      <section className="sketch-catalog">
        <span className="sketch-kicker">
          PANEL DE ADMINISTRACIÓN
        </span>

        <h1>Solicitudes de préstamo</h1>

        {message && <p role="status">{message}</p>}

        {requests.length === 0 ? (
          <p>No hay solicitudes registradas todavía.</p>
        ) : (
          <div className="sketch-request-list">
            {requests.map((request) => (
              <article
                className="sketch-request-card"
                key={request.id}
              >
                <h3>{request.bookTitle}</h3>

                <p>Solicitante: {request.userName}</p>

                <p>Carnet: {request.carnet}</p>

                <p>
                  Fecha:{" "}
                  {new Date(request.requestedAt).toLocaleString()}
                </p>

                <strong>Estado: {request.status}</strong>

                {request.status === "Solicitado" && (
                  <div className="sketch-request-actions">
                    <button
                      type="button"
                      onClick={() =>
                        execute(() =>
                          bookRequestRepository.approve(request.id)
                        )
                      }
                    >
                      Aprobar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        execute(() =>
                          bookRequestRepository.reject(request.id)
                        )
                      }
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {request.status === "Aprobado" && (
                  <button
                    type="button"
                    onClick={() =>
                      execute(() =>
                        bookRequestRepository.returnBook(request.id)
                      )
                    }
                  >
                    Registrar devolución
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBookRequestsPage;
