import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { authRepository } from "../../repositories/authRepository";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"ALUMNO" | "DOCENTE">("ALUMNO");
  const [message, setMessage] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = authRepository.register({ name, carnet, password, accountType });
    setMessage(result.message);

    if (result.success) {
      navigate("/login", { replace: true, state: { message: result.message } });
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__header">
          <span className="login-card__eyebrow">Biblioteca Galáctica</span>
          <h1>Crear una cuenta</h1>
          <p>Regístrate como alumno o solicita acceso como docente.</p>
        </div>

        <div className="login-form__group">
          <label htmlFor="register-name">Nombre completo</label>
          <input id="register-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="login-form__group">
          <label htmlFor="register-carnet">Carnet</label>
          <input id="register-carnet" value={carnet} onChange={(e) => setCarnet(e.target.value)} required />
        </div>

        <div className="login-form__group">
          <label htmlFor="register-account-type">Tipo de cuenta</label>
          <select
            id="register-account-type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as "ALUMNO" | "DOCENTE")}
          >
            <option value="ALUMNO">Alumno</option>
            <option value="DOCENTE">Docente (requiere aprobación)</option>
          </select>
        </div>

        <div className="login-form__group">
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={4}
            required
          />
        </div>

        {message && <p role="alert">{message}</p>}

        <button className="login-form__submit" type="submit">Registrarme</button>
        <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </main>
  );
}

export default RegisterPage;
