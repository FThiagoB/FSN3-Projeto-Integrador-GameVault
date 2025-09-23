import { React, useState } from "react";
import "./Profile.css";
import ProfileContent from "../../components/ProfileContent/ProfileGeral/ProfileContent";
import ProfileAddress from "../../components/ProfileContent/ProfileAddress/ProfileAddress";
import ProfileOrders from "../../components/ProfileContent/ProfileOrders/ProfileOrders";
import ProfileSecurity from "../../components/ProfileContent/ProfileSecurity/ProfileSecurity";
import CreateGamePage from "../../components/CreateGame/CreateGame";

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from "react";

import ProfileGamesSold from "../../components/ProfileContent/ProfileSeller/ProfileGamesSold/ProfileGamesSold";
import {default as ProfileSellerOrders} from "../../components/ProfileContent/ProfileSeller/ProfileOrders/ProfileOrders";

const ProfileSettings = ( redirectPage = undefined ) => {
  const [activePage, setActivePage] = useState("profile");
  const { section } = useParams();
  const valideSections = ["profile", "addresses", "orders", "createGame", "security", "mygames", "seller-orders"]

  // user.role : user / seller / admin
  const { user, deleteAcc } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (valideSections.includes(section)) {
      setActivePage(section);
      navigate(`/profile`)
    }
  }, [section]);

   useEffect(() => {
      if (!user) navigate('/login');
    }, [user, navigate]);

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

            { user?.role === "user" && (
            <li className={activePage === "orders" ? "profile-nav-active" : ""}>
              <button onClick={() => setActivePage("orders")}>Orders</button>
            </li>
            )}
            
            { user?.role === "seller" && ( <li
              className={
                activePage === "createGame" ? "profile-nav-active" : ""
              }
            >
              <button onClick={() => setActivePage("createGame")}>
                Create Game
              </button>
            </li>
            )}

            { user?.role === "seller" && ( <li
              className={
                activePage === "mygames" ? "profile-nav-active" : ""
              }
            >
              <button onClick={() => setActivePage("mygames")}>
                My games
              </button>
            </li>
            )}

             { user?.role === "seller" && ( <li
              className={
                activePage === "seller-orders" ? "profile-nav-active" : ""
              }
            >
              <button onClick={() => setActivePage("seller-orders")}>
                My Orders
              </button>
            </li>
            )}

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
      {activePage === "createGame" && user?.role === "seller" && <CreateGamePage />}
      {activePage === "mygames" && user?.role === "seller" && <ProfileGamesSold />}
      {activePage === "security" && <ProfileSecurity />}
      {activePage === "seller-orders" && <ProfileSellerOrders />}
      
    </div>
  );
};

export default ProfileSettings;
