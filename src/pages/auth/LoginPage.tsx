import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-hero" aria-label="Presentación de la biblioteca">
        <div className="login-hero__badge">Lectura sin límites</div>
        <h2>Gestiona tus préstamos y descubre nuevas historias.</h2>
        <p>
          Un espacio moderno para consultar libros, acceder a recursos y mantener
          tu cuenta de biblioteca siempre al día.
        </p>
      </section>

      <LoginForm error={error} onSubmit={handleLogin} />
    </main>
  );
}

export default LoginPage;
