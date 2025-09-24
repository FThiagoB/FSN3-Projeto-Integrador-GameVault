import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import { Link, useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";
import { useAuth } from "../../contexts/AuthContext";

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
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      name,
      email,
      password,
      role: "user",
    };

    try {
      const response = await fetch(`http://localhost:4500/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      notifySuccess("Usuário cadastrado com sucesso.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erro:", error);
      notifyError(`${error}`);
    }
  };

  return (
    <section className={styles.signupRetro}>
      <div className={styles.signupRetroContainer}>
        <h1 className={styles.signupRetroTitle}>Registro</h1>
        <form className={styles.signupRetroForm} onSubmit={handleSubmit}>
          <label htmlFor="name" className={styles.signupRetroLabel}>
            Nome
          </label>
          <input
            id="name"
            type="text"
            className={styles.signupRetroInput}
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email" className={styles.signupRetroLabel}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.signupRetroInput}
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className={styles.signupRetroLabel}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={styles.signupRetroInput}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword" className={styles.signupRetroLabel}>
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.signupRetroInput}
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.signupRetroBtn}>
            Registrar
          </button>
        </form>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SignupPage;
