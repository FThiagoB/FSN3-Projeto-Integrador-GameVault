import React from "react";

function AddCartButton({ onClick }) {
  return (
    <button onClick={onClick} style={styles.button}>
      Add Card
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default AddCartButton;
