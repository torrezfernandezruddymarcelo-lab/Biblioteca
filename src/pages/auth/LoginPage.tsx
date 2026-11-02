
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
      <section className="login-hero">
        <img className="login-hero__image" src="/images/portada-galactica.png" alt="Robot explorador junto a una biblioteca espacial" />
        <div className="login-hero__badge">🚀 ACCESO A LA GALAXIA</div>
        <h1>¡Bienvenido, explorador!</h1>
        <p>
          Inicia sesión para descubrir libros, solicitar préstamos
          y continuar tu aventura por el universo del conocimiento.
        </p>
        <div style={{ fontSize: 35, marginTop: 20 }}>🌟 🪐 ✨</div>
      </section>

      <section className="login-card">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 45 }}>🛸</div>
          <h2>Iniciar sesión</h2>
          <p style={{ color: "#7188a8" }}>
            Ingresa tus datos para continuar
          </p>
        </div>

        <LoginForm error={error} onSubmit={handleLogin} />

        <p style={{ textAlign: "center", marginTop: 22 }}>
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" style={{ fontWeight: 900 }}>
            Regístrate aquí
          </Link>
        </p>

        <p style={{ textAlign: "center" }}>
          <Link to="/" style={{ color: "#7188a8" }}>
            ← Volver al inicio
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
