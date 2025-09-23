import { React, useState } from "react";
import "./Profile.css";
import ProfileContent from "../../components/ProfileContent/ProfileGeral/ProfileContent";
import ProfileAddress from "../../components/ProfileContent/ProfileAddress/ProfileAddress";
import ProfileOrders from "../../components/ProfileContent/ProfileOrders/ProfileOrders";
import ProfileSecurity from "../../components/ProfileContent/ProfileSecurity/ProfileSecurity";
import CreateGamePage from "../../components/CreateGame/CreateGame";

const ProfileSettings = () => {
  const [activePage, setActivePage] = useState("profile");
  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <nav className="profile-sidebar-nav">
          <ul>
            {/* A classe 'profile-nav-active' agora é aplicada dinamicamente */}
            <li
              className={activePage === "profile" ? "profile-nav-active" : ""}
            >
              <button onClick={() => setActivePage("profile")}>Profile</button>
            </li>
            <li
              className={activePage === "addresses" ? "profile-nav-active" : ""}
            >
              <button onClick={() => setActivePage("addresses")}>
                Addresses
              </button>
            </li>
            <li className={activePage === "orders" ? "profile-nav-active" : ""}>
              <button onClick={() => setActivePage("orders")}>Orders</button>
            </li>
            <li
              className={
                activePage === "createGame" ? "profile-nav-active" : ""
              }
            >
              <button onClick={() => setActivePage("createGame")}>
                Create Game
              </button>
            </li>
            <li
              className={activePage === "security" ? "profile-nav-active" : ""}
            >
              <button onClick={() => setActivePage("security")}>
                Security
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Renderização condicional do conteúdo */}
      {activePage === "profile" && <ProfileContent />}
      {activePage === "addresses" && <ProfileAddress />}
      {activePage === "orders" && <ProfileOrders />}
      {activePage === "createGame" && <CreateGamePage />}
      {activePage === "security" && <ProfileSecurity />}
    </div>
  );
};

export default ProfileSettings;
