import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import BookDetailPage from "../pages/BookDetailPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
