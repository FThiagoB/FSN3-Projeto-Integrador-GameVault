import React, { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login com email: ${email}`);
  };

  return (
    <section className="login-retro">
      <div className="login-retro__container">
        <h1 className="login-retro__title">Login</h1>
        <form className="login-retro__form" onSubmit={handleSubmit}>
          <label htmlFor="email" className="login-retro__label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="login-retro__input"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="login-retro__label">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className="login-retro__input"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-retro__btn">
            Entrar
          </button>
        </form>
        <p>
          Ainda sem conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
