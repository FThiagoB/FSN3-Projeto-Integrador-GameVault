import { React, useState, useEffect } from "react";
import styles from "./profile.module.css";
import ProfileContent from "../../components/ProfileContent/ProfileGeral/ProfileContent";
import ProfileAddress from "../../components/ProfileContent/ProfileAddress/ProfileAddress";
import ProfileOrders from "../../components/ProfileContent/ProfileOrders/ProfileOrders";
import ProfileSecurity from "../../components/ProfileContent/ProfileSecurity/ProfileSecurity";
import CreateGamePage from "../../components/CreateGame/CreateGame";

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import ProfileGamesSold from "../../components/ProfileContent/ProfileSeller/ProfileGamesSold/ProfileGamesSold";
import { default as ProfileSellerOrders } from "../../components/ProfileContent/ProfileSeller/ProfileOrders/ProfileOrders";

const ProfileSettings = (redirectPage = undefined) => {
  const [activePage, setActivePage] = useState("profile");
  const { section } = useParams();
  const valideSections = [
    "profile",
    "addresses",
    "orders",
    "createGame",
    "security",
    "mygames",
    "seller-orders",
  ];

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (valideSections.includes(section)) {
      setActivePage(section);
      navigate(`/profile`);
    }
  }, [section, navigate]);

  useEffect(() => {
    if (!user) navigate("/login");

    setTimeout(() => {
         window.scrollTo(0, 0);
      }, 100);
  }, [user, navigate]);

  return (
    <div className={styles.profileContainer} id="profile-container">
      <aside className={styles.profileSidebar}>
        <nav className={styles.profileSidebarNav}>
          <ul>
            <li
              className={
                activePage === "profile" ? styles.profileNavActive : ""
              }
            >
              <button onClick={() => setActivePage("profile")}>Profile</button>
            </li>
            <li
              className={
                activePage === "addresses" ? styles.profileNavActive : ""
              }
            >
              <button onClick={() => setActivePage("addresses")}>
                Addresses
              </button>
            </li>

            {user?.role === "user" && (
              <li
                className={
                  activePage === "orders" ? styles.profileNavActive : ""
                }
              >
                <button onClick={() => setActivePage("orders")}>Orders</button>
              </li>
            )}

            {user?.role === "seller" && (
              <li
                className={
                  activePage === "createGame" ? styles.profileNavActive : ""
                }
              >
                <button onClick={() => setActivePage("createGame")}>
                  Create Game
                </button>
              </li>
            )}

            {user?.role === "seller" && (
              <li
                className={
                  activePage === "mygames" ? styles.profileNavActive : ""
                }
              >
                <button onClick={() => setActivePage("mygames")}>
                  Products
                </button>
              </li>
            )}

            {user?.role === "seller" && (
              <li
                className={
                  activePage === "seller-orders" ? styles.profileNavActive : ""
                }
              >
                <button onClick={() => setActivePage("seller-orders")}>
                  Sales
                </button>
              </li>
            )}

            <li
              className={
                activePage === "security" ? styles.profileNavActive : ""
              }
            >
              <button onClick={() => setActivePage("security")}>
                Security
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {activePage === "profile" && <ProfileContent />}
      {activePage === "addresses" && <ProfileAddress />}
      {activePage === "orders" && <ProfileOrders />}
      {activePage === "createGame" && user?.role === "seller" && (
        <CreateGamePage />
      )}
      {activePage === "mygames" && user?.role === "seller" && (
        <ProfileGamesSold />
      )}
      {activePage === "security" && <ProfileSecurity />}
      {activePage === "seller-orders" && <ProfileSellerOrders />}
    </div>
  );
};

export default ProfileSettings;
