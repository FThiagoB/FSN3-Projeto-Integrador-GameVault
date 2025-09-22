import React, { useEffect, useState } from "react";
import "./ProfileContent.css";

import { useAuth } from '../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import moment from 'moment';

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(value) {
  if (!value) return "";
  // Remove tudo que não é número
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 8) {
    // Telefone fixo sem DDD: 8 dígitos
    return digits.replace(/(\d{4})(\d{0,4})/, "$1-$2");
  } else if (digits.length === 9) {
    // Celular sem DDD: 9 dígitos
    return digits.replace(/(\d{5})(\d{0,4})/, "$1-$2");
  } else if (digits.length === 10) {
    // Fixo com DDD: (11) 3456-7890
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (digits.length === 11) {
    // Celular com DDD: (11) 93456-7890
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  // Caso exceda 11 dígitos, só limita
  return digits.substring(0, 10);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11) return false; // Verifica se tem 11 dígitos
  if (/^(\d)\1+$/.test(cpf)) return false; // Rejeita CPFs com todos os dígitos iguais

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

const ProfileContent = () => {
  const { user, syncData } = useAuth();
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || "");

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    createdAt: "",
    updatedAt: ""
  });

  // Bloqueia essa rota caso o usuário esteja deslogado
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      cpf: user?.CPF || "",
      phone: user?.phone || "",
      email: user?.email || "",
      createdAt: user?.createdAt || "",
      updatedAt: user?.updatedAt || ""
    });

    setFile(null);
    setPreviewUrl(user?.imageUrl || "");
    document.getElementById("file").value = "";
  }

  // quando user muda, atualiza estado
  useEffect(() => {
    handleReset();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // gera URL temporária
    }
  };

  const removeUserPicture = async () => {
    try {
      const response = await fetch("http://localhost:4500/user/picture/remove", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
        }
      });

      if (response.ok) {
        alert("Imagem removida com sucesso.");
      } else {
        alert("Erro: ");
      }

      await syncData();
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida o CPF. se informado
    if (formData.cpf && !validarCPF(formData.cpf)) {
      alert("CPF inválido!");
      return;
    }

    const data = new FormData();
    if (formData.name && formData.name !== user?.name) data.append("name", formData.name);
    if (formData.cpf && formData.cpf !== user?.CPF) data.append("cpf", formData.cpf);
    if (formData.phone && formData.phone !== user?.phone) data.append("phone", formData.phone);
    if (file) data.append("file", file);
    console.log(formData)
    try {
      const response = await fetch("http://localhost:4500/user", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Dados atualizados com sucesso!");
        syncData();

      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  return (
    <main className="profile-main-content">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-section profile-avatar-section">
          <img src={previewUrl} className="profile-avatar" />
          <div className="profile-avatar-actions">
            {/* Usado para abrir a janela de seleção de arquivos */}
            <input type="file" id="file" style={{ display: "none" }} accept="image/jpeg, image/png" onChange={handleFileChange} />

            <button type="button" id="btnOpenUploadWindow" className="profile-btn profile-btn-secondary" onClick={() => {
              document.getElementById("file").click();
            }}>
              Update
            </button>
            <button type="button" className="profile-btn profile-btn-link" onClick={removeUserPicture}>
              Remove
            </button>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" defaultValue="Morty Smith" value={formData.name} onChange={handleChange} />
          </div>

          <div className="profile-form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" defaultValue="" value={formatCPF(formData.cpf)} placeholder="000.000.000-00" onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, ""); // só dígitos
              setFormData((prev) => ({ ...prev, cpf: digits }));
            }} />
          </div>

          <div className="profile-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" defaultValue="" value={formatarTelefone(formData.phone)} onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, ""); // só dígitos
              setFormData((prev) => ({ ...prev, phone: digits }));
            }} />
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="" value={formData.email} disabled />
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label>Account Created</label>
              <input
                type="text"
                defaultValue=""
                value={moment(formData.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                disabled
                className="profile-disabled-field"
              />
            </div>
            <div className="profile-form-group">
              <label>Last Updated</label>
              <input
                type="text"
                defaultValue=""
                value={moment(formData.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                disabled
                className="profile-disabled-field"
              />
            </div>
          </div>
        </div>

        <div className="profile-form-actions">
          <div className="profile-action-group-left">
            <button type="submit" className="profile-btn profile-btn-primary">
              Save Changes
            </button>
            <button type="button" className="profile-btn profile-btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ProfileContent;
