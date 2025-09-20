import React, { useState } from "react";

const ProfileSecurity = () => {
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
            />
          </div>
          <div className="profile-form-actions">
            <button type="button" className="profile-btn profile-btn-primary">
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
            />
          </div>
          <div className="profile-form-actions">
            <button type="button" className="profile-btn profile-btn-primary">
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
          <button type="button" className="profile-btn profile-btn-danger">
            Delete My Account
          </button>
        </div>
      </main>
    </>
  );
};

export default ProfileSecurity;
