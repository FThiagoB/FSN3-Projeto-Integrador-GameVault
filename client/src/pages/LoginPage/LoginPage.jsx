import React, { useState, useRef, useEffect } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroLogin, setErroLogin] = useState(false);
  const { user, logout } = useAuth();

  const emailInputRef = useRef(null);
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["authToken"]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/profile");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4500/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const { token } = await response.json();

      setCookie("authToken", token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    } catch (error) {
      console.error("Erro:", error);
      setErroLogin(true);
      emailInputRef.current?.focus();
      notifyError(`${error}`);
    }
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <section className={styles.loginRetro}>
      <div className={styles.loginRetroContainer}>
        <h1 className={styles.loginRetroTitle}>Login</h1>
        <form className={styles.loginRetroForm} onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.loginRetroLabel}>
            Email
          </label>
          <input
            id="email"
            ref={emailInputRef}
            type="email"
            className={`${styles.loginRetroInput} ${
              erroLogin ? styles.invalidInput : ""
            }`}
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className={styles.loginRetroLabel}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={`${styles.loginRetroInput} ${
              erroLogin ? styles.invalidInput : ""
            }`}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.loginRetroBtn}>
            Entrar
          </button>
        </form>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Ainda sem conta? <Link to="/signup">Cadastre-se</Link>
        </p>

        <ToastContainer />
      </div>
    </section>
  );
};

export default LoginPage;
