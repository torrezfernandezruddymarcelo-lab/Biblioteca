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

function AdminRoleRequestsPage() {
  const user = authRepository.getCurrentUser();

  const [requests, setRequests] = useState<AdminRequest[]>(() =>
    storageService.get<AdminRequest[]>(REQUESTS_KEY) ?? []
  );

  if (!user || !authRepository.isPrincipalAdmin()) {
    return <Navigate to="/" replace />;
  }

  const updateRequests = (updatedRequests: AdminRequest[]) => {
    setRequests(updatedRequests);
    storageService.set(REQUESTS_KEY, updatedRequests);
  };

  const handleApprove = (request: AdminRequest) => {
    const promoted = authRepository.promoteToAdmin(request.userId);

    if (!promoted) {
      alert("No se pudo encontrar al usuario.");
      return;
    }

    const updatedRequests = requests.map((item) =>
      item.id === request.id
        ? { ...item, status: "Aprobada" as const }
        : item
    );

    updateRequests(updatedRequests);
    alert(`${request.userName} ahora es administrador.`);
  };

  const handleReject = (request: AdminRequest) => {
    const updatedRequests = requests.map((item) =>
      item.id === request.id
        ? { ...item, status: "Rechazada" as const }
        : item
    );

    updateRequests(updatedRequests);
    alert("Solicitud rechazada.");
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "Pendiente"
  );

  return (
    <main className="admin-page">
      <GlobalNavigation />
      <header className="admin-header">
        <div>
          <h1>Solicitudes de administradores</h1>
          <p>Bienvenido, {user.name}</p>
        </div>

        <Link to="/admin/libros">Volver al panel</Link>
      </header>

      <section className="admin-books">
        <h2>Solicitudes pendientes</h2>

        {pendingRequests.length === 0 ? (
          <p>No hay solicitudes pendientes.</p>
        ) : (
          <div className="admin-books-list">
            {pendingRequests.map((request) => (
              <article key={request.id} className="admin-book-item">
                <div>
                  <h3>{request.userName}</h3>
                  <p>Carnet: {request.carnet}</p>
                  <p>
                    Fecha:{" "}
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                  <p>Estado: {request.status}</p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleApprove(request)}
                  >
                    Aceptar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(request)}
                  >
                    Rechazar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <h2>Historial de solicitudes</h2>

        {requests.filter((item) => item.status !== "Pendiente").length === 0 ? (
          <p>Todavía no hay solicitudes procesadas.</p>
        ) : (
          requests
            .filter((item) => item.status !== "Pendiente")
            .map((request) => (
              <article key={request.id} className="admin-book-item">
                <div>
                  <h3>{request.userName}</h3>
                  <p>Carnet: {request.carnet}</p>
                  <p>Estado: {request.status}</p>
                </div>
              </article>
            ))
        )}
      </section>
    </main>
  );
}

export default AdminRoleRequestsPage;
