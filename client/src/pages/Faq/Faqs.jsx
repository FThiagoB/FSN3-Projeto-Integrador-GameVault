import React, { useState } from "react";
import styles from "./faq.module.css";

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
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <h2 className={styles.faqTitle}>Perguntas Frequentes</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${
                activeIndex === index ? styles.active : ""
              }`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggle(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                type="button"
              >
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={styles.faqAnswer}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
