import { Mail, Zap } from "lucide-react";
import "../../styles/newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      {/* Background Effects */}
      <div className="newsletter-bg">
        <div className="circle blue"></div>
        <div className="circle purple"></div>
      </div>

      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-header">
            <div className="icon-wrapper">
              <Zap className="icon" />
            </div>
            <h2 className="title">
              <span className="glow">Não perca</span> nenhuma novidade!
            </h2>
            <p className="subtitle">
              Receba em primeira mão ofertas exclusivas, lançamentos retrô e
              conteúdo especial sobre os clássicos dos games
            </p>
          </div>

          {/* Form */}
          <div className="newsletter-form">
            <div className="form-row">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="input"
                />
              </div>
              <button className="btn-submit">Inscrever-se</button>
            </div>

            <div className="newsletter-benefits">
              <div className="benefit">
                <div className="dot green"></div>
                <span>Ofertas exclusivas</span>
              </div>
              <div className="benefit">
                <div className="dot blue"></div>
                <span>Sem spam</span>
              </div>
              <div className="benefit">
                <div className="dot purple"></div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="newsletter-stats">
            <div className="stat">
              <div className="value blue">10K+</div>
              <div className="label">Inscritos</div>
            </div>
            <div className="stat">
              <div className="value purple">500+</div>
              <div className="label">Jogos enviados</div>
            </div>
            <div className="stat">
              <div className="value pink">98%</div>
              <div className="label">Satisfação</div>
            </div>
            <div className="stat">
              <div className="value green">24h</div>
              <div className="label">Entrega</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
