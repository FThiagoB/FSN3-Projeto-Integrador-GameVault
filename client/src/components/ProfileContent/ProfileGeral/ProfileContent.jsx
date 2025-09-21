import React from "react";
import "./ProfileContent.css";

const ProfileContent = () => {
  return (
    <main className="profile-main-content">
      <form className="profile-form">
        <div className="profile-form-section profile-avatar-section">
          <div className="profile-avatar">D</div>
          <div className="profile-avatar-actions">
            <button type="button" className="profile-btn profile-btn-secondary">
              Update
            </button>
            <button type="button" className="profile-btn profile-btn-link">
              Remove
            </button>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" defaultValue="Morty Smith" />
          </div>

          <div className="profile-form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" defaultValue="123.456.789-00" />
          </div>

          <div className="profile-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" defaultValue="+55 (11) 99999-9999" />
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="morty@example.com" />
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label>Account Created</label>
              <input
                type="text"
                defaultValue="2023-01-15"
                disabled
                className="profile-disabled-field"
              />
            </div>
            <div className="profile-form-group">
              <label>Last Updated</label>
              <input
                type="text"
                defaultValue="2023-11-20"
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
            <button type="button" className="profile-btn profile-btn-secondary">
              Cancel
            </button>
          </div>
          <div className="profile-action-group-right">
            <button type="button" className="profile-btn profile-btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ProfileContent;
