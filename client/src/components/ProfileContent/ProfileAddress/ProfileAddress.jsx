import React from "react";

const ProfileAddress = () => {
  return (
    <main className="profile-main-content">
      <div className="profile-form-section">
        <h3>Address Information</h3>
        <div className="profile-form-group">
          <label htmlFor="street">Street Address</label>
          <input type="text" id="street" defaultValue="123 Main St" />
        </div>

        <div className="profile-form-row">
          <div className="profile-form-group">
            <label htmlFor="city">City</label>
            <input type="text" id="city" defaultValue="São Paulo" />
          </div>
          <div className="profile-form-group">
            <label htmlFor="state">State</label>
            <input type="text" id="state" defaultValue="SP" />
          </div>
        </div>

        <div className="profile-form-row">
          <div className="profile-form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input type="text" id="zipCode" defaultValue="01234-567" />
          </div>
          <div className="profile-form-group">
            <label htmlFor="country">Country</label>
            <select id="country" defaultValue="Brazil">
              <option>Brazil</option>
              <option>United States</option>
              <option>Canada</option>
            </select>
          </div>
        </div>
      </div>
      <div className="profile-form-actions">
        <button type="submit" className="profile-btn profile-btn-primary">
          Save Changes
        </button>
        <button type="button" className="profile-btn profile-btn-secondary">
          Cancel
        </button>
      </div>
    </main>
  );
};

export default ProfileAddress;
