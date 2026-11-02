import GlobalNavigation from "../components/GlobalNavigation";

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";

interface AdminRequest {
  id: string;
  userId: string;
  userName: string;
  carnet: string;
  requestedAt: string;
  status: "Pendiente" | "Aprobada" | "Rechazada";
}

const REQUESTS_KEY = "biblioteca_admin_requests";

function AdminRequestPage() {
  const user = authRepository.getCurrentUser();

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (authRepository.isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleRequest = () => {
    const requests =
      storageService.get<AdminRequest[]>(REQUESTS_KEY) ?? [];

    const existing = requests.find(
      (request) =>
        request.userId === user.id &&
        request.status === "Pendiente"
    );

    if (existing) {
      setMessage("Ya tienes una solicitud pendiente.");
      setSuccess(false);
      return;
    }

    const newRequest: AdminRequest = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      carnet: user.carnet,
      requestedAt: new Date().toISOString(),
      status: "Pendiente",
    };

    storageService.set(REQUESTS_KEY, [
      ...requests,
      newRequest,
    ]);

    setMessage("Tu solicitud fue enviada correctamente.");
    setSuccess(true);
  };

  return (
    <main className="sketch-page">\n      <GlobalNavigation />
      <header className="sketch-header">
        <Link to="/" className="sketch-logo">
          <span>B</span>
          Biblioteca Galáctica
        </Link>

        <nav className="sketch-nav">
          <Link to="/">Inicio</Link>
          <Link to="/books">Catálogo</Link>
        </nav>
      </header>

      <section className="sketch-catalog">
        <span className="sketch-kicker">
          SOLICITUD DE ADMINISTRACIÓN
        </span>

        <h1>Solicitar ser administrador</h1>

        <p>
          Envía una solicitud para obtener permisos de
          administración en la Biblioteca Galáctica.
        </p>

        <article className="sketch-book-card">
          <div className="sketch-book-info">
            <h2>Datos del solicitante</h2>

            <p>
              <strong>Nombre:</strong> {user.name}
            </p>

            <p>
              <strong>Carnet:</strong> {user.carnet}
            </p>

            <p>
              <strong>Rol actual:</strong> Usuario
            </p>

            <button
              className="sketch-button"
              type="button"
              onClick={handleRequest}
            >
              Enviar solicitud
            </button>

            {message && (
              <p
                className={
                  success ? "request-success" : "request-error"
                }
                role="status"
              >
                {message}
              </p>
            )}

            <Link to="/books">Volver al catálogo</Link>
          </div>
        </article>
      </section>
    </main>
  );
}

export default AdminRequestPage;
