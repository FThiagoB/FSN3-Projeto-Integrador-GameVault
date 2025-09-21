import React, { useEffect, useState } from "react";
import "./ProfileContent.css";

import { useAuth } from '../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

const ProfileContent = () => {
  const { user, syncData } = useAuth();
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  // Bloqueia essa rota caso o usuário esteja deslogado
  if( !user )
    navigate("/login");

  console.log( {user} )

  const [formData, setFormData] = useState({
    name: user?.name || "",
    cpf: user?.CPF || "",
    phone: user?.phone || "",
    email: user?.email || "",
    createdAt: user?.createdAt || "",
    updatedAt: user?.updatedAt || ""
  });

  console.log( {formData} )

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || "");

  useEffect(() => {handleReset()}, [user]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Função para resetar os campos
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
    setPreviewUrl( user?.imageUrl || "" );
    document.getElementById("file").value = "";
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

    const data = new FormData();
    if (formData.name && formData.name !== user?.name) data.append("name", formData.name);
    if (formData.cpf && formData.cpf !== user?.CPF) data.append("cpf", formData.cpf);
    if (formData.phone && formData.phone !== user?.phone) data.append("phone", formData.phone);
    if (formData.email && formData.email !== user?.email) data.append("email", formData.email);
    if (file) data.append("file", file);

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
        await syncData();
        
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
          <img src={previewUrl} className="profile-avatar"/>
          <div className="profile-avatar-actions">
            {/* Usado para abrir a janela de seleção de arquivos */}
            <input type="file" id="file" style={{display: "none"}} accept="image/jpeg, image/png" onChange={handleFileChange}/>

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
            <input type="text" id="name" defaultValue="Morty Smith" value={formData.name} onChange={handleChange}/>
          </div>

          <div className="profile-form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" defaultValue="" value={formData.cpf} onChange={handleChange}/>
          </div>

          <div className="profile-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" defaultValue="" value={formData.phone} onChange={handleChange}/>
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="" value={formData.email} onChange={handleChange} required/>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label>Account Created</label>
              <input
                type="text"
                defaultValue=""
                value={formData.createdAt}
                disabled
                className="profile-disabled-field"
              />
            </div>
            <div className="profile-form-group">
              <label>Last Updated</label>
              <input
                type="text"
                defaultValue=""
                value={formData.updatedAt}
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
