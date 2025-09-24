import React, { useEffect, useState } from "react";
import styles from "./profileGamesSold.module.css";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

import moment from "moment";
import EditGameModal from "./EditGameModal";

import { ToastContainer } from "react-toastify";
import useNotification from "../../../../utils/useNotification";
import StatusBadge from "./../../../../utils/StatusBadge";

const ProfileGamesSold = () => {
  const { user, deleteAcc } = useAuth();
  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const { notifySuccess, notifyError } = useNotification;

  const [myGames, setMyGames] = useState([]);

  const fetchGamesSold = async () => {
    try {
      const response = await fetch(`http://localhost:4500/seller/games`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Problemas na requisição: ${response}`);
        return;
      }

      const data = await response.json();
      setMyGames(data);
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login"); // Bloqueia se deslogado
    if (!(user?.role !== "seller")) navigate("/profile"); // Bloqueia se não for seller

    fetchGamesSold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedGame(null);
  };

  return (
    <>
      <main className={styles.profileMainContent}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className={styles.profileOrdersTitle}>My Games</h2>
        </div>

        <div className={styles.gamesList}>
          {myGames && myGames.length > 0 ? (
            myGames.map((game) => (
              <div key={game.id} className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.label}>Game ID: </span>
                    <span>{game.id}</span>
                  </div>
                  <div className={styles.orderInfo}>
                    <span className={styles.label}>Price: </span>
                    <span>R$ {game.price}</span>
                  </div>

                  <span>
                    <StatusBadge
                      status={
                        game.deleted
                          ? "deleted"
                          : game.stock > 0
                          ? "in_stock"
                          : "out_of_stock"
                      }
                    />
                  </span>
                </div>

                <div className={styles.orderCardBody}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className={styles.orderItemImage}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h5 className="mb-1">{game.title}</h5>
                      <p className="text-muted mb-1">{game.genre}</p>
                      <small className="text-muted">
                        Stock: {game.stock} units
                      </small>
                    </div>
                  </div>
                </div>

                <div className={styles.orderCardFooter}>
                  <div className={styles.orderInfo}>
                    <span className={styles.label}>Last Updated: </span>
                    <span>
                      {moment(game.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className={`${styles.profileBtn} ${styles.profileBtnSecondary} border border-dark`}
                      onClick={() => handleEditGame(game)}
                    >
                      {game.deleted ? "View" : "Edit"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p>No games registered yet.</p>
            </div>
          )}
        </div>

        <EditGameModal
          show={showEditModal}
          onHide={handleCloseEditModal}
          game={selectedGame}
          refreshFetch={fetchGamesSold}
        />

        <ToastContainer />
      </main>
    </>
  );
};

export default ProfileGamesSold;
