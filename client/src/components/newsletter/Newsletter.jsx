import { Mail, Zap } from "lucide-react";
import styles from "./newsletter.module.css";

const Newsletter = () => {
  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContainer}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterHeader}>
            <div className={styles.iconWrapper}>
              <Zap className={styles.icon} />
            </div>
            <h2 className={styles.title}>
              <span className={styles.glow}>Não perca</span> nenhuma novidade!
            </h2>
            <p className={styles.subtitle}>
              Receba em primeira mão ofertas exclusivas, lançamentos retrô e
              conteúdo especial sobre os clássicos dos games
            </p>
          </div>

          {/* Form */}
          <div className={styles.newsletterForm}>
            <div className={styles.formRow}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className={styles.input}
                />
              </div>
              <button className={styles.btnSubmit}>Inscrever-se</button>
            </div>

            <div className={styles.newsletterBenefits}>
              <div className={styles.benefit}>
                <div className={`${styles.dot} ${styles.green}`}></div>
                <span>Ofertas exclusivas</span>
              </div>
              <div className={styles.benefit}>
                <div className={`${styles.dot} ${styles.blue}`}></div>
                <span>Sem spam</span>
              </div>
              <div className={styles.benefit}>
                <div className={`${styles.dot} ${styles.purple}`}></div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.newsletterStats}>
            <div className={styles.stat}>
              <div className={`${styles.value} ${styles.blue}`}>10K+</div>
              <div className={styles.label}>Inscritos</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.value} ${styles.purple}`}>500+</div>
              <div className={styles.label}>Jogos enviados</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.value} ${styles.pink}`}>98%</div>
              <div className={styles.label}>Satisfação</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.value} ${styles.green}`}>24h</div>
              <div className={styles.label}>Entrega</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
