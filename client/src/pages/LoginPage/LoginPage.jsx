import React, { useState, useRef } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroLogin, setErroLogin] = useState(false);
  const { user, logout } = useAuth();

  const emailInputRef = useRef(null); // Aponta para o input de email
  const navigate = useNavigate();

  // Cookie para armazenar o token JWT
  const [cookies, setCookie] = useCookies(['authToken']);

  // Bloqueia essa rota caso o usuário esteja logado
  if( user )
    navigate("/profile");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      // Realiza a requisição pro backend passando email e senha
      const response = await fetch(`http://localhost:4500/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica se houve algum problema
      if (!response.ok) {
        const {message} = await response.json();
        throw new Error( message );
      }

      // Armazena o token no cookie
      const { token } = await response.json();

      setCookie('authToken', token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 dia
      });
    }
    catch( error ){
      console.error('Erro:', error);
      setErroLogin( true );
      emailInputRef.current?.focus();
      alert( error );
    }
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
            ref={emailInputRef}
            type="email"
            className={`login-retro__input ${erroLogin? "invalid-input": ""}`}
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
            className={`login-retro__input ${erroLogin? "invalid-input": ""}`}
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
