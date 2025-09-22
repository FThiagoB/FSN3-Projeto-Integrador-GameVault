import React, { useEffect, useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { ToastContainer, toast } from "react-toastify";

const SignupPage = () => {

  const notifySuccess = (Mensagem) =>
  toast.success(Mensagem, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const notifyError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 1500,       // um pouco mais de tempo para ler o erro
    hideProgressBar: false,
    closeOnClick: true,    // permitir fechar ao clicar
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState('');

  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Bloqueia essa rota caso o usuário esteja logado
  useEffect(() => {
    if (user) navigate("/profile");
    setRole("user");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notifyError("As senhas não coincidem!");
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
      role: role,
    };

    try {
      // Realiza a requisição pro backend passando email e senha
      const response = await fetch(`http://localhost:4500/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify(data),
      });

      // Verifica se houve algum problema
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      notifySuccess("Usuário cadastrado com sucesso.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    }
    catch (error) {
      console.error('Erro:', error);
      notifyError(error);
    }
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

          <div style={{ "display": "flex", "flex-direction": "row", "justifyContent": "space-around", "gap": "5" }}>
            <label>
              <input
                type="radio"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />
              <span style={{ padding: "0px 10px" }}>User</span>
            </label>

            <label>
              <input
                type="radio"
                value="seller"
                checked={role === 'seller'}
                onChange={() => setRole('seller')}
              />
              <span style={{ padding: "0px 10px" }}>Seller</span>
            </label>
          </div>

          <button type="submit" className="signup-retro__btn">
            Registrar
          </button>
        </form>
        <p style={{ "margin-top": "10px", "text-align": "center" }}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
      <ToastContainer/>
    </section>
  );
};

export default SignupPage;
