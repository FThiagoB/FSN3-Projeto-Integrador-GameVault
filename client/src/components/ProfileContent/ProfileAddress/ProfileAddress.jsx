import React, { useEffect, useState } from "react";

import { useAuth } from '../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

const ProfileAddress = () => {
  const { user, syncData } = useAuth();
  const [address, setAddress] = useState({});
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressID: undefined,
    street: "",
    number: "",
    complemento: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const fetchAddressByZip = async (zipCode) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();

      if (data.erro) {
        console.error("CEP não encontrado");
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || ""
      }));

    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Bloqueia essa rota caso o usuário esteja deslogado
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleReset = () => {
    setFormData({
      addressID: address?.id || undefined, 
      street: address?.street || "",
      number: address?.number || "",
      complemento: address?.complemento || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || ""
    });
  }

  useEffect(handleReset, [address]);

  // Obtém as informações sobre o endereço do usuário
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch("http://localhost:4500/addresses", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${cookies.authToken}`,
          }
        });

        const result = await response.json();
        if (response.ok) {
          setAddress(result[0]);
        } else {
          handleReset();
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    }

    fetchAddress();
  }, [user]);

  const createNewAddress = async (data) => {
    try {
      const response = await fetch("http://localhost:4500/addresses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) 
        alert("Dados atualizados com sucesso!")
      else 
        alert("Erro: " + result.message);
      
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  const updateAddress = async (data) => {
    try {
      const response = await fetch(`http://localhost:4500/addresses/${data["addressID"]}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) 
        alert("Dados atualizados com sucesso!")
      else 
        alert("Erro: " + result.message);
      
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      street: formData.street,
      number: formData.number,
      complemento: formData.complemento,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode
    };  

    if( !formData.addressID )
      await createNewAddress( data );
    else{
      data["addressID"] = formData.addressID;
      await updateAddress( data );
    }
  }

  return (
    <main className="profile-main-content">
      <form className="profile-address-form" onSubmit={handleSubmit}>
        <div className="profile-form-section">
          <h3>Address Information</h3>
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label htmlFor="street">Street Address</label>
              <input type="text" id="street" placeholder="Rua Oliveira Senador" value={formData.street} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <div>
                <input type="text" id="zipCode" placeholder="01234-567" value={formData.zipCode} onChange={handleChange} />
                <span>
                  <button type="button" className="profile-btn profile-btn-secondary" onClick={ () => {
                    return formData.zipCode ? fetchAddressByZip(formData.zipCode) : ""
                  }}><FaSearch/></button>
                  </span>
              </div>
            </div>
          </div>

          <div className="profile-form-row">
            <div className="profile-form-group">
              <label htmlFor="number">Number</label>
              <input type="text" id="number" placeholder="5" value={formData.number} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
              <label htmlFor="complemento">Complemento</label>
              <input type="text" id="complemento" placeholder="Próximo da estação" value={formData.complemento} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-form-row">
            <div className="profile-form-group">
              <label htmlFor="neighborhood">Neighborhood</label>
              <input type="text" id="neighborhood" placeholder="Jardim das Flores" value={formData.neighborhood} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" placeholder="São Paulo" value={formData.city} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
              <label htmlFor="state">State</label>
              <input type="text" id="state" placeholder="SP" value={formData.state} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="profile-form-actions">
          <button type="submit" className="profile-btn profile-btn-primary">
            Save Changes
          </button>
          <button type="button" className="profile-btn profile-btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProfileAddress;
