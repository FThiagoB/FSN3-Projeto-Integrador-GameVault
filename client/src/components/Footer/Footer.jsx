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
import styles from "./footer.module.css";

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
    { name: "Contato", link: "/contato" },
    { name: "FAQ", link: "/faq" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandLogo}>
              <div className={styles.footerLogoCircle}>R</div>
              <div>
                <h3 className={styles.footerTitle}>RetroPixel</h3>
                <p className={styles.footerSubtitle}>Games Store</p>
              </div>
            </div>
            <p className={styles.footerDescription}>
              A maior loja de jogos retrô do Brasil. Reviva os clássicos que
              marcaram gerações com qualidade e nostalgia garantidas.
            </p>
            <div className={styles.footerSocial}>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <button key={index} className={styles.footerSocialBtn}>
                  <Icon className={styles.footerSocialIcon} />
                </button>
              ))}
            </div>
          </div>

          {/* Jogos */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Jogos</h4>
            <ul className={styles.footerList}>
              {games.map((game) => (
                <li key={game.name}>
                  <Link to={game.link} className={styles.footerLink}>
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Atendimento</h4>
            <ul className={styles.footerList}>
              {atendimento.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className={styles.footerLink}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Contato</h4>
            <div className={styles.footerContact}>
              <div className={styles.footerContactItem}>
                <Mail className={styles.footerIcon} />
                <span>contato@retropixel.com</span>
              </div>
              <div className={styles.footerContactItem}>
                <Phone className={styles.footerIcon} />
                <span>(85) 99999-9999</span>
              </div>
              <div className={styles.footerContactItem}>
                <MapPin className={styles.footerIcon} />
                <span>Fortaleza, CE</span>
              </div>
            </div>

            <div className={styles.footerHighlight}>
              <div className={styles.highlightTitle}>🔥 Atendimento 24/7</div>
              <div className={styles.highlightSub}>
                Suporte especializado em games retrô
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
            © 2025 RetroPixel Games Store. Todos os direitos reservados.
          </div>
          <div className={styles.footerBottomLinks}>
            <Link to="/" className={styles.footerLink}>
              Termos de Uso
            </Link>
            <Link to="/" className={styles.footerLink}>
              Privacidade
            </Link>
            <Link to="/" className={styles.footerLink}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
