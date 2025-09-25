import React, { useEffect, useState } from "react";
import styles from "./profileContent.module.css";

import { useAuth } from "../../../contexts/AuthContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

const notifySuccess = (Mensagem) =>
  toast.success(Mensagem, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const notifyError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(value) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 8) return digits.replace(/(\d{4})(\d{0,4})/, "$1-$2");
  else if (digits.length === 9)
    return digits.replace(/(\d{5})(\d{0,4})/, "$1-$2");
  else if (digits.length === 10)
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (digits.length === 11)
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  return digits.substring(0, 10);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

const ProfileContent = () => {
  const { user, syncData } = useAuth();
  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || "");
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (!user) navigate("/login");
    syncData();
  }, [user, navigate]);

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      cpf: user?.CPF || "",
      phone: user?.phone || "",
      email: user?.email || "",
      createdAt: user?.createdAt || "",
      updatedAt: user?.updatedAt || "",
    });
    setFile(null);
    setPreviewUrl(user?.imageUrl || "");
    document.getElementById("file").value = "";
  };

  useEffect(() => {
    handleReset();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeUserPicture = async () => {
    try {
      const response = await fetch(
        "http://localhost:4500/user/picture/remove",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${cookies.authToken}` },
        }
      );
      if (response.ok) notifySuccess("Imagem removida com sucesso.");
      else notifyError("Não foi possível concluir a operação");
      await syncData();
    } catch (error) {
      notifyError(`Erro na requisição: ${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.cpf && !validarCPF(formData.cpf)) {
      notifyError("CPF inválido!");
      return;
    }

    const data = new FormData();
    if (formData.name && formData.name !== user?.name)
      data.append("name", formData.name);
    if (formData.cpf && formData.cpf !== user?.CPF)
      data.append("cpf", formData.cpf);
    if (formData.phone && formData.phone !== user?.phone)
      data.append("phone", formData.phone);
    if (file) data.append("file", file);

    try {
      const response = await fetch("http://localhost:4500/user", {
        method: "PUT",
        headers: { Authorization: `Bearer ${cookies.authToken}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        notifySuccess("Dados atualizados com sucesso!");
        syncData();
      } else notifyError(`Erro: ${result.message}`);
    } catch (error) {
      notifyError(`Erro na requisição: ${error}`);
    }
  };

  return (
    <main className={styles.profileMainContent}>
      <form className={styles.profileForm} onSubmit={handleSubmit}>
        <div
          className={`${styles.profileFormSection} ${styles.profileAvatarSection}`}
        >
          <img src={previewUrl} className={styles.profileAvatar} alt="Avatar" />
          <div className={styles.profileAvatarActions}>
            <input
              type="file"
              id="file"
              className={styles.profileFileInput}
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className={`${styles.profileBtn} ${styles.profileBtnSecondary}`}
              onClick={() => document.getElementById("file").click()}
            >
              Update
            </button>
            <button
              type="button"
              className={`${styles.profileBtn} ${styles.profileBtnLink}`}
              onClick={removeUserPicture}
            >
              Remove
            </button>
          </div>
        </div>

        <div className={styles.profileFormSection}>
          {["name", "cpf", "phone", "email"].map((field) => (
            <div key={field} className={styles.profileFormGroup}>
              <label htmlFor={field}>
                {field === "cpf"
                  ? "CPF"
                  : field === "phone"
                  ? "Phone Number"
                  : field === "email"
                  ? "Email Address"
                  : "Name"}
              </label>
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
                id={field}
                value={
                  field === "cpf"
                    ? formatCPF(formData.cpf)
                    : field === "phone"
                    ? formatarTelefone(formData.phone)
                    : formData[field]
                }
                placeholder={field === "cpf" ? "000.000.000-00" : ""}
                disabled={field === "email"}
                onChange={handleChange}
                className={field === "email" ? styles.profileDisabledField : ""}
              />
            </div>
          ))}
        </div>

        <div className={styles.profileFormSection}>
          <div className={styles.profileFormRow}>
            {["createdAt", "updatedAt"].map((field) => (
              <div key={field} className={styles.profileFormGroup}>
                <label>
                  {field === "createdAt" ? "Account Created" : "Last Updated"}
                </label>
                <input
                  type="text"
                  value={moment(formData[field]).format("DD/MM/YYYY HH:mm:ss")}
                  disabled
                  className={styles.profileDisabledField}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.profileFormActions}>
          <div className={styles.profileActionGroupLeft}>
            <button
              type="submit"
              className={`${styles.profileBtn} ${styles.profileBtnPrimary}`}
            >
              Save Changes
            </button>
            <button
              type="button"
              className={`${styles.profileBtn} ${styles.profileBtnSecondary}`}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </main>
  );
};

export default ProfileContent;
