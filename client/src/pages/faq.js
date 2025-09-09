import { useState } from "react";
import "../styles/Faq.css";

const faqs = [
  {
    question: "Como funciona o envio dos jogos?",
    answer:
      "Todos os jogos são enviados digitalmente por e-mail ou código de ativação, com instruções de uso.",
  },
  {
    question: "Vocês oferecem garantia?",
    answer:
      "Sim! Todos os produtos têm garantia de 7 dias para reembolso ou substituição.",
  },
  {
    question: "Os jogos são originais?",
    answer:
      "Trabalhamos com ROMs licenciadas e backups autorizados, respeitando direitos autorais.",
  },
  {
    question: "É necessário ter um console?",
    answer: "Não. Enviamos junto um emulador compatível com seu dispositivo.",
  },
  {
    question: "O site é seguro?",
    answer:
      "Sim! Usamos criptografia SSL e gateways de pagamento confiáveis como Mercado Pago e Pix.",
  },
];

export default function StaticFaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Perguntas Frequentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button className="faq-question" onClick={() => toggle(index)}>
                {faq.question}
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>
              {activeIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
