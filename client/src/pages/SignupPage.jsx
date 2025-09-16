import React, { useState } from "react";
import "../styles/Signup.css";
import { Link } from "react-router-dom";
const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // Aqui você pode adicionar lógica para registro
    alert(`Registro realizado para: ${name} (${email})`);
  };

  return (
    <section className="signup-retro">
      <div className="signup-retro__container">
        <h1 className="signup-retro__title">Registro</h1>
        <form className="signup-retro__form" onSubmit={handleSubmit}>
          <label htmlFor="name" className="signup-retro__label">
            Nome
          </label>
          <input
            id="name"
            type="text"
            className="signup-retro__input"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email" className="signup-retro__label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="signup-retro__input"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="signup-retro__label">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className="signup-retro__input"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword" className="signup-retro__label">
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="signup-retro__input"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-retro__btn">
            Registrar
          </button>
        </form>
        <p>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
