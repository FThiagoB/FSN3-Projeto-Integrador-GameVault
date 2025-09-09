import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  const games = [
    { name: "Zelda: Skyward Sword", link: "/produto/101" },
    { name: "Doom (1983)", link: "/produto/8" },
    { name: "GTA: San Andreas", link: "/produto/10" },
    { name: "A Bug's Life", link: "/produto/11" },
    { name: "Resident Evil 4", link: "/produto/6" },
    { name: "Mortal Kombat (1992)", link: "/produto/29" },
  ];

  const atendimento = [
    { name: "FAQ", link: "/faq" },
    //{ name: "Política de Troca", link: "/politica-de-troca" },
    //{ name: "Garantia", link: "/garantia" },
    //{ name: "Frete Grátis", link: "/frete-gratis" },
    //{ name: "Suporte Técnico", link: "/suporte-tecnico" },
    //{ name: "Parcerias", link: "/parcerias" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="footer-logo-circle">R</div>
              <div>
                <h3 className="footer-title">RetroPixel</h3>
                <p className="footer-subtitle">Games Store</p>
              </div>
            </div>
            <p className="footer-description">
              A maior loja de jogos retrô do Brasil. Reviva os clássicos que
              marcaram gerações com qualidade e nostalgia garantidas.
            </p>
            <div className="footer-social">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <button key={index} className="footer-social-btn">
                  <Icon className="footer-social-icon" />
                </button>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Jogos</h4>
            <ul className="footer-list">
              {games.map((games) => (
                <li key={games.name}>
                  <Link to={games.link} className="footer-link">
                    {games.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Atendimento</h4>
            <ul className="footer-list">
              {atendimento.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="footer-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="footer-column">
            <h4 className="footer-heading">Contato</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Mail className="footer-icon" />
                <span>contato@retropixel.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-icon" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-icon" />
                <span>São Paulo, SP</span>
              </div>
            </div>

            <div className="footer-highlight">
              <div className="highlight-title">🔥 Atendimento 24/7</div>
              <div className="highlight-sub">
                Suporte especializado em games retrô
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            © 2024 RetroPixel Games Store. Todos os direitos reservados.
          </div>
          <div className="footer-bottom-links">
            <Link to="/" className="footer-link">
              Termos de Uso
            </Link>
            <Link to="/" className="footer-link">
              Privacidade
            </Link>
            <Link to="/" className="footer-link">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
