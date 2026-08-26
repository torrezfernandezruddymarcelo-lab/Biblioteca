import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedCarnet = carnet.trim();

    if (!normalizedCarnet || !password) {
      return;
    }

    onSubmit({
      carnet: normalizedCarnet,
      password,
    });
  };

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="login-card__header">
        <span className="login-card__eyebrow">Biblioteca digital</span>
 codex/mostrar-estructura-de-archivos-fqxbm8
        <h1>Bienvenido de nuevo</h1>
        <p>Ingresa con tus credenciales para continuar explorando el catálogo.</p>
      </div>

      <div className="login-form__group">
        <label htmlFor="carnet">Carnet de identidad</label>

        <h1>Bienvenido de nuevo</h1>

        <p>
          Ingresa con tus credenciales para continuar explorando el catálogo.
        </p>
      </div>

      <div className="login-form__group">
        <label htmlFor="carnet">Carnet de identidad</label>

 main
        <input
          id="carnet"
          name="carnet"
          type="text"
          value={carnet}
          onChange={(event) => setCarnet(event.target.value)}
          placeholder="Ej. 12345678"
          autoComplete="username"
          required
        />
      </div>

      <div className="login-form__group">
        <label htmlFor="password">Contraseña</label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <p className="login-form__error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button className="login-form__submit" type="submit">
        Ingresar
      </button>
    </form>
  );
}

 codex/mostrar-estructura-de-archivos-fqxbm8
export default LoginForm;

export default LoginForm;
 main
