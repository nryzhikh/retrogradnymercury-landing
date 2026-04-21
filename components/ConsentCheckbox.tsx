"use client";

import type {
  ChangeEventHandler,
  FormEventHandler,
  ReactNode,
} from "react";
import styles from "./ConsentCheckbox.module.css";

export type ConsentCheckboxProps = {
  id: string;
  name: string;
  children: ReactNode;
  title?: string;
  required?: boolean;
  defaultChecked?: boolean;
  onInvalid?: FormEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function ConsentCheckbox({
  id,
  name,
  children,
  title,
  required,
  defaultChecked,
  onInvalid,
  onChange,
}: ConsentCheckboxProps) {
  return (
    <div className={styles.row}>
      <input
        id={id}
        name={name}
        type="checkbox"
        className={styles.checkbox}
        title={title}
        required={required}
        defaultChecked={defaultChecked}
        onInvalid={onInvalid}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.label}>
        <div>{children}</div>
      </label>
    </div>
  );
}
