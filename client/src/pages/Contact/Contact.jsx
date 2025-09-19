import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  return (
    <section
      className="contact-retro position-relative overflow-hidden"
      style={{ minHeight: "90vh", width: "100%", padding: "5rem 1rem" }}
    >
      {/* Círculos animados no fundo */}
      <div className="contact-retro__background">
        <div className="circle pulse delay0"></div>
        <div className="circle pulse delay1"></div>
        <div className="circle pulse delay05"></div>
      </div>

      {/* Container principal */}
      <div className="px-5 py-5 position-relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="text-center w-100 mb-4">
          <h1 className="contact-retro__title">Entre em Contato</h1>
          <p className="contact-retro__subtitle mx-auto">
            Algum jogo não está funcionando? Tem alguma dúvida? Entre em contato
            conosco.
          </p>
        </div>

        {/* Form */}
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="contact-retro__form-container">
              <form className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="name"
                    className="form-label contact-retro__label"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control contact-retro__input"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="email"
                    className="form-label contact-retro__label"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control contact-retro__input"
                    placeholder="voce@exemplo.com"
                  />
                </div>
                <div className="col-12">
                  <label
                    htmlFor="message"
                    className="form-label contact-retro__label"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control contact-retro__input"
                    rows="5"
                    placeholder="Sua mensagem..."
                  />
                </div>
                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg contact-retro__btn"
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className="contact-retro__contact-info">
                <a
                  href="mailto:suporte@gamevault.com"
                  className="contact-retro__email"
                >
                  suporte@gamevault.com
                </a>
                <div className="contact-retro__socials">
                  <Link to="#" className="social-icon text-white">
                    <FaFacebook size={20} />
                  </Link>
                  <Link to="#" className="social-icon text-white">
                    <FaTwitter size={20} />
                  </Link>
                  <Link to="#" className="social-icon text-white">
                    <FaInstagram size={20} />
                  </Link>
                  <Link to="#" className="social-icon text-white">
                    <FaLinkedin size={20} />
                  </Link>
                </div>

                <div className="mt-4">
                  <Link to="/" className="btn btn-sm contact-retro__btn-back">
                    ← Voltar para Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animações pulse e float via CSS */}
    </section>
  );
};

export default Contact;
