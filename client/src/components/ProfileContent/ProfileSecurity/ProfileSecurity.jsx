import React, { useEffect, useState } from "react";

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ToastContainer, toast } from "react-toastify";

const notifySuccess = (Mensagem) => {
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
}

const notifyError = (message) => {
	toast.error(message, {
		position: "bottom-right",
		autoClose: 1500,       // um pouco mais de tempo para ler o erro
		hideProgressBar: false,
		closeOnClick: true,    // permitir fechar ao clicar
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	});
}

const ProfileSecurity = () => {
  const { user, deleteAcc } = useAuth();
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  // Bloqueia essa rota caso o usuário esteja deslogado
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Estados para gerenciar os formulários de forma independente
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    confirmPassword: "",
  });

  // Funções para lidar com as mudanças nos inputs de cada formulário
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const callUpdateEmail = async () => {
    const data = {
      current_password: emailData.confirmPassword,
      new_email: emailData.newEmail
    };  

    try{
      // Realiza a requisição pro backend passando email e senha
      const response = await fetch(`http://localhost:4500/user/update/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify( data ),
      });

      // Verifica se houve algum problema
      if (!response.ok) {
        const {message} = await response.json();
        throw new Error( message );
      }

      notifySuccess("Email alterado com sucesso.");
      setEmailData({newEmail: "", confirmPassword: ""})
    }
    catch( error ){
      console.error('Erro:', error);
      notifyError(`${error}`);
    }
  }

  const callUpdatePassword = async () => {
    const data = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    };  

    try{
      // Realiza a requisição pro backend passando email e senha
      const response = await fetch(`http://localhost:4500/user/update/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify( data ),
      });

      // Verifica se houve algum problema
      if (!response.ok) {
        const {message} = await response.json();
        throw new Error( message );
      }

      notifySuccess("Senha alterada com sucesso.");
      setPasswordData({currentPassword: "",newPassword: "",confirmPassword: ""})
    }
    catch( error ){
      console.error('Erro:', error);
      notifyError(`${error}`);
    }
  }

  const onClickChangePassword = async () => {
    
    if(!passwordData.newPassword || !passwordData.confirmPassword || !passwordData.currentPassword ){
      notifyError("Preencha todos os campos")
      return;}

    if(passwordData.newPassword !== passwordData.confirmPassword){
      notifyError("The passwords are different");
      return;
    }

    if( (passwordData.currentPassword === passwordData.newPassword) ){
      notifyError("As senhas não podem ser as mesmas");
      return;
    }

    await callUpdatePassword();
  };

  const onClickChangeEmail = async () => {
    const validaEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    // Existem campos faltantes
    if(!emailData.confirmPassword || !emailData.newEmail)
      return;

    // Email inválido
    if( !validaEmail(emailData.newEmail) ){
      return;
    }

    await callUpdateEmail();
  };

  return (
    <>
      <main className="profile-main-content">
        <h2 className="profile-security-title">Security Settings</h2>

        {/* Seção para Alterar Senha */}
        <div className="profile-form-section">
          <h3>Change Password</h3>
          <div className="profile-form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              autoComplete="off"
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              minLength={4}
              autoComplete="off"
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              minLength={4}
              autoComplete="off"
            />
          </div>
          <div className="profile-form-actions">
            <button type="button" className="profile-btn profile-btn-primary" onClick={onClickChangePassword}>
              Update Password
            </button>
          </div>
        </div>

        {/* Seção para Alterar Email */}
        <div className="profile-form-section">
          <h3>Change Email Address</h3>
          <div className="profile-form-group">
            <label htmlFor="newEmail">New Email Address</label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={emailData.newEmail}
              onChange={handleEmailChange}
              autoComplete="off"
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="confirmPasswordForEmail">
              Confirm with your password
            </label>
            <input
              type="password"
              id="confirmPasswordForEmail"
              name="confirmPassword"
              value={emailData.confirmPassword}
              onChange={handleEmailChange}
              autoComplete="off"
            />
          </div>
          <div className="profile-form-actions">
            <button type="button" className="profile-btn profile-btn-primary" onClick={onClickChangeEmail}>
              Update Email
            </button>
          </div>
        </div>

        {/* Zona de Perigo para Deletar a Conta */}
        <div className="profile-form-section profile-danger-zone">
          <h3>Delete Account</h3>
          <p>
            Once you delete your account, there is no going back. Please be
            certain. All your data, orders, and personal information will be
            permanently removed.
          </p>
          <button type="button" className="profile-btn profile-btn-danger" onClick={async () => {await deleteAcc(); notifyError("Usuário deletado com sucesso.");}}>
            Delete My Account
          </button>
        </div>

        <ToastContainer/>
      </main>
    </>
  );
};

export default ProfileSecurity;
