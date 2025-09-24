import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./contact.module.css";

const Contact = () => {
  return (
    <section
      className={`${styles["contact-retro"]} position-relative overflow-hidden`}
      style={{ minHeight: "100vh", width: "100%", padding: "5rem 1rem" }}
    >
      {/* Círculos animados no fundo */}
      <div className={styles["contact-retro__background"]}>
        <div
          className={`${styles.circle} ${styles.pulse} ${styles.delay0}`}
        ></div>
        <div
          className={`${styles.circle} ${styles.pulse} ${styles.delay1}`}
        ></div>
        <div
          className={`${styles.circle} ${styles.pulse} ${styles.delay05}`}
        ></div>
      </div>

      {/* Container principal */}
      <div
        className={`${styles["box-contact"]} position-relative`}
        style={{ zIndex: 10 }}
      >
        {/* Header */}
        <div className="text-center w-100 mb-4">
          <h1 className={styles["contact-retro__title"]}>Entre em Contato</h1>
          <p className={styles["contact-retro__subtitle"]}>
            Algum jogo não está funcionando? Tem alguma dúvida? Entre em contato
            conosco.
          </p>
        </div>

        {/* Form */}
        <div className="row justify-content-center">
          <div className="">
            {" "}
            {/* mantive estrutura para facilitar integração com bootstrap */}
            <div className={styles["contact-retro__form-container"]}>
              <form className="row g-3">
                <div
                  className={`content-input col-md-6 ${styles["content-input"]}`}
                >
                  <label
                    htmlFor="name"
                    className={`form-label ${styles["contact-retro__label"]}`}
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`${styles["contact-retro__input"]} form-control`}
                    placeholder="Seu nome"
                  />
                </div>

                <div
                  className={`content-input col-md-6 ${styles["content-input"]}`}
                >
                  <label
                    htmlFor="email"
                    className={`form-label ${styles["contact-retro__label"]}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`${styles["contact-retro__input"]} form-control`}
                    placeholder="voce@exemplo.com"
                  />
                </div>

                <div
                  className={`content-input col-12 ${styles["content-input"]}`}
                >
                  <label
                    htmlFor="message"
                    className={`form-label ${styles["contact-retro__label"]}`}
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles["contact-retro__input"]} ${styles["contact-retro__textarea"]} form-control`}
                    rows="5"
                    placeholder="Sua mensagem..."
                  />
                </div>

                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className={`btn-lg ${styles["contact-retro__btn"]}`}
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className={styles["contact-retro__contact-info"]}>
                <a
                  href="mailto:suporte@gamevault.com"
                  className={styles["contact-retro__email"]}
                >
                  suporte@gamevault.com
                </a>
                <div className={styles["contact-retro__socials"]}>
                  <Link
                    to="#"
                    className={`${styles["social-icon"]} text-white`}
                  >
                    <FaFacebook size={20} />
                  </Link>
                  <Link
                    to="#"
                    className={`${styles["social-icon"]} text-white`}
                  >
                    <FaTwitter size={20} />
                  </Link>
                  <Link
                    to="#"
                    className={`${styles["social-icon"]} text-white`}
                  >
                    <FaInstagram size={20} />
                  </Link>
                  <Link
                    to="#"
                    className={`${styles["social-icon"]} text-white`}
                  >
                    <FaLinkedin size={20} />
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
