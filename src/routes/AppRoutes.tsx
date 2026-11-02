
import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import BooksPage from "../pages/BooksPage";
import BookDetailPage from "../pages/BookDetailPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AdminBooksPage from "../pages/AdminBooksPage";
import AdminBookCreatePage from "../pages/AdminBookCreatePage";
import AdminBookRequestsPage from "../pages/AdminBookRequestsPage";

import AdminRequestPage from "../pages/AdminRequestsPage";
import AdminRoleRequestsPage from "../pages/AdminRoleRequestsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/books" element={<BooksPage />} />
      <Route path="/books/:bookId" element={<BookDetailPage />} />

      <Route
        path="/solicitar-administrador"
        element={<AdminRequestPage />}
      />

      <Route
        path="/admin/libros"
        element={<AdminBooksPage />}
      />

      <Route
        path="/admin/libros/nuevo"
        element={<AdminBookCreatePage />}
      />

      <Route
        path="/admin/solicitudes-libros"
        element={<AdminBookRequestsPage />}
      />

      <Route
        path="/admin/solicitudes-administrador"
        element={<AdminRoleRequestsPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
