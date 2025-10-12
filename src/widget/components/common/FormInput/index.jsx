import React from "react";
import classnames from "classnames";

import styles from "./FormInput.module.scss";

const FormInput = ({
  handleChange,
  value,
  label,
  type,
  className,
  ...otherProps
}) => (
  <div className={styles.group}>
    {label && <label className={styles["form-input-label"]}>{label}</label>}
    {type && type === "textarea" ? (
      <textarea
        className={classnames(styles["form-input"], className)}
        onChange={handleChange}
        {...otherProps}
        rows="4"
        value={value}
      ></textarea>
    ) : (
      <input
        className={classnames(styles["form-input"], className)}
        onChange={handleChange}
        type="text"
        value={value}
        {...otherProps}
      />
    )}
  </div>
);

export default FormInput;
