import React, { useEffect, useState } from "react";

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { ToastContainer, toast } from "react-toastify";

import moment from 'moment';
import "./ProfileGamesSold.css";
import EditGameModal from "./EditGameModal";

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

const ProfileGamesSold = () => {
    const { user, deleteAcc } = useAuth();
    const [cookies] = useCookies(['authToken']);
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    // Estados para gerenciar os formulários de forma independente
    const [myGames, setMyGames] = useState([])

    const fetchGamesSold = async () => {
        try {
            const response = await fetch(`http://localhost:4500/seller/games`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookies.authToken}`,
                }
            });

            if (!response.ok) {
                console.error(`Problemas na requisição: ${response}`);
                return;
            }

            const data = await response.json();
            setMyGames(data);

            console.log(data)
        } catch (error) {
            console.error(`Problemas na requisição: ${error}`);
        }
    };

    useEffect(() => {
        if (!user) navigate('/login');                          // Bloqueia essa rota caso o usuário esteja deslogado
        if (!(user?.role !== "seller")) navigate('/profile');   // Bloqueia se não for vendedor

        fetchGamesSold()
    }, [user, navigate]);

    // Função para abrir o modal
    const handleEditGame = (game) => {
        setSelectedGame(game);
        setShowEditModal(true);
    };

    // Função para fechar o modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedGame(null);
    };

    console.log("Jogos: ", myGames)

    return (
        <>
            <main className="profile-main-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="profile-orders-title">My Games</h2>
                </div>

                <div className="games-list">
                    {myGames && myGames.length > 0 ? myGames.map((game) => (
                        <div key={game.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-info">
                                    <span className="label">Game ID: </span>
                                    <span>{game.id}</span>
                                </div>
                                <div className="order-info">
                                    <span className="label">Price: </span>
                                    <span>R$ {game.price}</span>
                                </div>
                                <span className={`badge ${(!game.deleted && game.stock > 0 ) ? 'bg-success' : 'bg-danger'}`}>
                                    {game.deleted ? 'Deleted' :  game.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="order-card-body">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="order-item-image"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h5 className="mb-1">{game.title}</h5>
                                        <p className="text-muted mb-1">{game.genre}</p>
                                        <small className="text-muted">Stock: {game.stock} units</small>
                                    </div>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <div className="order-info">
                                    <span className="label">Last Updated: </span>
                                    <span>{moment(game.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</span>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="profile-btn profile-btn-secondary border border-dark"
                                        onClick={() => handleEditGame(game)}
                                    >
                                        {game.deleted?"View":"Edit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <p>No games registered yet.</p>
                        </div>
                    )}
                </div>

                <EditGameModal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    game={selectedGame}
                    refreshFetch={fetchGamesSold} // sua função que busca os jogos
                />

                <ToastContainer />
            </main>
        </>
    );
};

export default ProfileGamesSold;