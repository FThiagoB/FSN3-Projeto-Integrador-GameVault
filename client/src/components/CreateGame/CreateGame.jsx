import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

import "./CreateGame.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useCookies } from 'react-cookie';

import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import ProductCard from "../ProductCard/ProductCard";
import ModalPreview from "./ModalPreview";

const notifySuccess = (Mensagem) =>
  toast.success(Mensagem, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const notifyError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,       // um pouco mais de tempo para ler o erro
    hideProgressBar: false,
    closeOnClick: true,    // permitir fechar ao clicar
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

const CreateGame = () => {
  const { user } = useAuth();
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  const [isLoadingSellers, setIsLoadingSellers] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageURLPreview, setImageURLPreview] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [isGameDataIncomplete, setIsGameDataIncomplete] = useState(false);

  // Estado inicial do formulário, agora incluindo sellerID
  const [gameData, setGameData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    genre: "",
  });

  const dataComplete = (!gameData.title || !gameData.genre || !gameData.stock || !imageURLPreview);
  if (dataComplete != isGameDataIncomplete) setIsGameDataIncomplete(dataComplete)

  // Estados para controlar inputs inválidos
  const [invalidFields, setInvalidFields] = useState({
    title: false,
    description: false,
    price: false,
    stock: false,
    genre: false,
  });

  useEffect(() => {
    // Redirecione se estiver deslogado
    if (!user) navigate('/login');

    // Redireciona se estiver logado mas não tiver autorização
    if (user && user.role !== "seller") navigate('/profile');

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4500/games/genres");

        if (!response.ok)
          throw new Error("Problemas ao realizar o fech de produtos");

        const data = await response.json();
        setCategories(data);

      } catch (err) {
        console.error("Falha ao buscar categorias:", err.message);

        // Se falhar, você pode usar uma lista estática como fallback
        const fallbackCategories = [
          "Ação",
          "RPG",
          "Aventura"
        ];

        setCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Converte o valor para número se o campo for sellerID, price ou stock
    const parsedValue = ["sellerID", "price", "stock"].includes(name) ? Number(value) : value;
    setGameData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e) => {
    const dataFile = e.target.files[0];
    if (dataFile) {
      setImageFile(dataFile);
      setImageURLPreview(URL.createObjectURL(dataFile));
    }
    console.log("Setou")
  };

  const clearFiels = () => {
    setGameData({
      title: "",
      description: "",
      price: "",
      stock: "",
      genre: "-1",
    });
    setImageFile("")
    setImageURLPreview("")

    // Limpa o campo de arquivo manualmente
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se há campos vazios
    let newInvalidFields = {}
    newInvalidFields.title = !gameData.title ? true : false;
    newInvalidFields.description = !gameData.description ? true : false;
    newInvalidFields.price = (gameData.price < 0) ? true : false;
    newInvalidFields.stock = (gameData.stock < 0) ? true : false;
    newInvalidFields.genre = (gameData.genre === "-1") ? true : false;

    const hasInvalid = Object.values(newInvalidFields).some((value) => value === true);

    if (hasInvalid) {
      setInvalidFields(newInvalidFields)
      notifyError("Campos inválidos.")
      return;
    };

    const requestData = new FormData();
    requestData.append("title", gameData.title);
    requestData.append("description", gameData.description);
    requestData.append("price", gameData.price);
    requestData.append("stock", gameData.stock);
    requestData.append("genre", gameData.genre);

    if (imageFile)
      requestData.append("file", imageFile);

    console.log(requestData)
    requestData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    })

    try {
      const response = await fetch("http://localhost:4500/games", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: requestData,
      });

      const result = await response.json();

      if (response.ok) {
        notifySuccess("Jogo criado com sucesso!");

        clearFiels()
      } else {
        notifyError(`Erro: ${result.message}`);
      }
    } catch (error) {
      notifyError(`Erro na requisição: ${error}`);
    }

  };

  return (
    <>
      <main className="profile-main-content">
        <div className="profile-form-section">
          <h3 className="create-game-title">Cadastrar Novo Jogo</h3>

          <form className="game-form-card" onSubmit={handleSubmit}>
            <div className="game-form-grid">
              <div className="form-column-left">
                <div className="profile-form-group">
                  <label htmlFor="title">Título do Jogo</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={gameData.title}
                    onChange={handleChange}
                    required
                    className={invalidFields.title ? "invalid" : ""}
                  />
                </div>
              </div>

              <div className="form-column-right">
                <div className="profile-form-group">
                  <label htmlFor="genre">Gênero</label>
                  <select
                    id="genre"
                    name="genre"
                    value={gameData.genre}
                    onChange={handleChange}
                    required
                    className={invalidFields.genre ? "invalid" : ""}
                  >
                    <option value="-1">
                      Selecione um gênero
                    </option>
                    {categories.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-column-right">
                <div className="profile-form-group">
                  <label htmlFor="price">Preço (R$)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0.01"
                    step="0.01"
                    value={gameData.price}
                    onChange={handleChange}
                    required
                    className={invalidFields.price ? "invalid" : ""}
                  />
                </div>
              </div>

              <div className="form-column-left">
                <div className="profile-form-group">
                  <label htmlFor="stock">Estoque (Unidades)</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    step="1"
                    value={gameData.stock}
                    onChange={handleChange}
                    required
                    className={invalidFields.stock ? "invalid" : ""}
                  />
                </div>
              </div>

              <div className="form-column-right">
                <div className="profile-form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={gameData.description}
                    onChange={handleChange}
                    required
                    className={invalidFields.description ? "invalid" : ""}
                  ></textarea>
                </div>
              </div>

              <div className="form-column-left">
                <div className="profile-form-group">
                  <label htmlFor="file">Imagem do Jogo</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <label htmlFor="image" className="image-upload-area" onClick={() => document.getElementById("file").click()}>
                    {/* Ícone SVG embutido */}
                    <svg
                      viewBox="0 0 512 512"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z" />
                    </svg>
                    <p>
                      {imageFile
                        ? imageFile.name
                        : "Clique para selecionar uma imagem"}
                    </p>
                  </label>
                </div>

                <div className="text-center d-flex justify-content-center m-auto" style={{ width: "100%" }}>
                </div>
              </div>
            </div>

            <div className="game-form-actions d-flex gap-4">
              <button type="button" className={`profile-btn profile-btn-primary ${isGameDataIncomplete ? 'disabled' : ''}`} onClick={() => setShowPreview(true)} disabled={isGameDataIncomplete}>
                <FaEye style={{ marginRight: '4px' }} /> Visualizar
              </button>

              <button type="submit" className="profile-btn profile-btn-primary">
                {/* Ícone SVG embutido */}
                <svg
                  viewBox="0 0 448 512"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z" />
                </svg>
                Salvar Jogo
              </button>
            </div>

            {
              console.log({ showPreview })
            }
          </form>
        </div>
        <ToastContainer />


        <Modal show={showPreview} onHide={() => setShowPreview(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Pré-visualização</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ModalPreview
              product={{
                category: gameData.genre,
                imageUrl: imageURLPreview,
                title: gameData.title,
                stock: gameData.stock,
                price: gameData.price,
                description: gameData.description,
                genre: gameData.genre
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPreview(false)} >
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default CreateGame;
