"use client";

import { useState } from "react";
import styles from "./Faq.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

export function Faq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article className={styles.item} key={item.question}>
            <button
              className={styles.question}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <img
                src={`/images/questions-card-1.png`}
                alt=""
                aria-hidden="true"
                className={styles.card}
              />
              <span className={styles.questionText}>{item.question}</span>
              <img
                src="/images/questions-arrow.svg"
                alt=""
                aria-hidden="true"
                className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
              />
            </button>
            {isOpen ? (
              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
