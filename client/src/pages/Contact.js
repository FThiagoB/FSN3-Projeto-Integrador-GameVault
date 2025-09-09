import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <section
      className="position-relative overflow-hidden"
      style={{
        minHeight: "90vh",
        width: "100%",
        background: "linear-gradient(to top, #312e81, #6b21a8, #be185d)",
        padding: "5rem 1rem",
      }}
    >
      {/* Círculos animados no fundo */}
      <div
        className="position-absolute w-100 h-100"
        style={{ top: 0, left: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "25%",
            width: "8rem",
            height: "8rem",
            backgroundColor: "#3b82f6",
            borderRadius: "9999px",
            filter: "blur(40px)",
            animation: "pulse 2s infinite",
            opacity: 0.2,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            right: "25%",
            width: "10rem",
            height: "10rem",
            backgroundColor: "#8b5cf6",
            borderRadius: "9999px",
            filter: "blur(40px)",
            animation: "pulse 2s infinite 1s",
            opacity: 0.2,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "7rem",
            height: "7rem",
            backgroundColor: "#ec4899",
            borderRadius: "9999px",
            filter: "blur(40px)",
            animation: "pulse 2s infinite 0.5s",
            opacity: 0.2,
          }}
        ></div>
      </div>

      {/* Container principal */}
      <div className="px-5 py-5 position-relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="text-center w-100 mb-4">
          <h1
            className="fw-bold mb-3 text-white"
            style={{
              fontSize: "3rem",
              fontFamily: '"Press Start 2P", system-ui',
            }}
          >
            <span
              style={{
                background: "linear-gradient(to right, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Entre em Contato
            </span>
          </h1>
          <p
            className="mx-auto lead"
            style={{
              maxWidth: "600px",
              color: "#d1d5db",
              fontSize: "1.25rem",
            }}
          >
            Algum jogo não está funcionando? Tem alguma dúvida? Entre em contato
            conosco.
          </p>
        </div>

        {/* Form */}
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div
              className="p-4 rounded-3"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.5))",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(55, 65, 81, 0.5)",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <form className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label small text-white">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control "
                    placeholder="Seu nome"
                    style={{
                      background: "rgba(31, 41, 55, 0.5), text-white",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="email"
                    className="form-label small text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control text-white"
                    placeholder="voce@exemplo.com"
                    style={{ background: "rgba(31, 41, 55, 0.5)" }}
                  />
                </div>
                <div className="col-12">
                  <label
                    htmlFor="message"
                    className="form-label small text-white"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control text-white"
                    rows="5"
                    placeholder="Sua mensagem..."
                    style={{ background: "rgba(31, 41, 55, 0.5)" }}
                  />
                </div>
                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg text-white fw-bold border-0"
                    style={{
                      background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                      padding: "1rem 2rem",
                      width: "100%",
                    }}
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className="border-top border-secondary pt-4 mt-4 text-center">
                <a
                  href="mailto:suporte@retrogames.com"
                  className="d-block mb-3 fw-bold"
                  style={{
                    color: "#60a5fa",
                    textDecoration: "none",
                  }}
                >
                  suporte@gamevault.com
                </a>
                <div className="d-flex justify-content-center gap-3">
                  <Link
                    to="#"
                    className="text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid #4b5563",
                    }}
                  >
                    <FaFacebook size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid #4b5563",
                    }}
                  >
                    <FaTwitter size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid #4b5563",
                    }}
                  >
                    <FaInstagram size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid #4b5563",
                    }}
                  >
                    <FaLinkedin size={20} />
                  </Link>
                </div>

                <div className="mt-4">
                  <Link
                    to="/"
                    className="btn btn-sm text-white"
                    style={{
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid #4b5563",
                    }}
                  >
                    ← Voltar para Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de animação */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.05);
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Contact;
