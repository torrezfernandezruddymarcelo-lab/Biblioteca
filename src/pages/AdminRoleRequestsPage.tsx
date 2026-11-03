import GlobalNavigation from "../components/GlobalNavigation";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";
import type { TeacherRequest } from "../types/auth";

function AdminRoleRequestsPage() {
  const user = authRepository.getCurrentUser();
  const [requests, setRequests] = useState<TeacherRequest[]>(() =>
    authRepository.getTeacherRequests()
  );

  if (!user || !authRepository.isPrincipalAdmin()) {
    return <Navigate to="/" replace />;
  }

  const refreshRequests = () => setRequests(authRepository.getTeacherRequests());

  const review = (request: TeacherRequest, decision: "Aprobada" | "Rechazada") => {
    const success = authRepository.reviewTeacherRequest(request.id, decision);
    if (!success) {
      alert("No se pudo procesar la solicitud. Actualiza la página e inténtalo de nuevo.");
      return;
    }
    refreshRequests();
    alert(decision === "Aprobada"
      ? request.userName + " ahora tiene el rol de docente."
      : "La solicitud de " + request.userName + " fue rechazada.");
  };

  const pending = requests.filter((item) => item.status === "Pendiente");
  const reviewed = requests.filter((item) => item.status !== "Pendiente");

  return (
    <main className="admin-page">
      <GlobalNavigation />
      <header className="admin-header">
        <div>
          <h1>Solicitudes de docentes</h1>
          <p>Bienvenido, {user.name}. Solo el administrador principal puede aprobarlas.</p>
        </div>
        <Link to="/admin/libros">Volver al panel</Link>
      </header>
      <section className="admin-books">
        <h2>Solicitudes pendientes ({pending.length})</h2>
        {pending.length === 0 ? <p>No hay solicitudes pendientes.</p> : (
          <div className="admin-books-list">
            {pending.map((request) => (
              <article key={request.id} className="admin-book-item">
                <div>
                  <h3>{request.userName}</h3>
                  <p>Carnet: {request.carnet}</p>
                  <p>Fecha: {new Date(request.requestedAt).toLocaleString()}</p>
                  <p>Estado: {request.status}</p>
                </div>
                <div>
                  <button type="button" onClick={() => review(request, "Aprobada")}>Aprobar como docente</button>
                  <button type="button" onClick={() => review(request, "Rechazada")}>Rechazar</button>
                </div>
              </article>
            ))}
          </div>
        )}
        <h2>Historial de solicitudes</h2>
        {reviewed.length === 0 ? <p>Todavía no hay solicitudes procesadas.</p> : reviewed.map((request) => (
          <article key={request.id} className="admin-book-item">
            <div>
              <h3>{request.userName}</h3>
              <p>Carnet: {request.carnet}</p>
              <p>Estado: {request.status}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminRoleRequestsPage;
