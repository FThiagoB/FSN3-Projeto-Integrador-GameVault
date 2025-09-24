import React, { useEffect, useState } from "react";
import styles from "./profileAddress.module.css"; // CSS Module

import { useAuth } from "../../../contexts/AuthContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

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

const notifyError = (message) =>
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

const ProfileAddress = () => {
  const { user, syncData } = useAuth();
  const [address, setAddress] = useState({});
  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressID: undefined,
    street: "",
    number: "",
    complemento: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const fetchAddressByZip = async (zipCode) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();

      if (data.erro) return;

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (!user) navigate("/login");
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
      zipCode: address?.zipCode || "",
    });
  };

  useEffect(handleReset, [address]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch("http://localhost:4500/addresses", {
          method: "GET",
          headers: { Authorization: `Bearer ${cookies.authToken}` },
        });

        const result = await response.json();
        if (response.ok) setAddress(result[0]);
        else handleReset();
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };
    fetchAddress();
  }, [user]);

  const createNewAddress = async (data) => {
    try {
      const response = await fetch("http://localhost:4500/addresses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) notifySuccess("Dados atualizados com sucesso!");
      else notifyError("Problemas ao completar a operação");
    } catch (error) {
      notifyError(`${error}`);
    }
  };

  const updateAddress = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:4500/addresses/${data["addressID"]}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${cookies.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (response.ok) notifySuccess("Dados atualizados com sucesso!");
      else notifyError(`Erro: ${result.message}`);
    } catch (error) {
      notifyError(`${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (!formData.addressID) await createNewAddress(data);
    else await updateAddress(data);
  };

  return (
    <main className={styles.profileMainContent}>
      <form className={styles.profileAddressForm} onSubmit={handleSubmit}>
        <div className={styles.profileFormSection}>
          <h3>Address Information</h3>

          <div className={styles.profileFormRow}>
            <div className={styles.profileFormGroup}>
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                placeholder="Rua Oliveira Senador"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className={styles.profileFormGroup}>
              <label htmlFor="zipCode">ZIP Code</label>
              <div className={styles.profileZipInputWrapper}>
                <input
                  type="text"
                  id="zipCode"
                  placeholder="01234-567"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={`${styles.profileBtn} ${styles.profileBtnSecondary}`}
                  onClick={() =>
                    formData.zipCode && fetchAddressByZip(formData.zipCode)
                  }
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.profileFormRow}>
            <div className={styles.profileFormGroup}>
              <label htmlFor="number">Number</label>
              <input
                type="text"
                id="number"
                placeholder="5"
                value={formData.number}
                onChange={handleChange}
              />
            </div>

            <div className={styles.profileFormGroup}>
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                placeholder="Próximo da estação"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.profileFormRow}>
            <div className={styles.profileFormGroup}>
              <label htmlFor="neighborhood">Neighborhood</label>
              <input
                type="text"
                id="neighborhood"
                placeholder="Jardim das Flores"
                value={formData.neighborhood}
                onChange={handleChange}
              />
            </div>

            <div className={styles.profileFormGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="São Paulo"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className={styles.profileFormGroup}>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                placeholder="SP"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.profileFormActions}>
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
      </form>
      <ToastContainer />
    </main>
  );
};

export default ProfileAddress;
