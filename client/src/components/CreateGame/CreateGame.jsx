import React, { useState, useEffect } from "react";
import { FaUpload, FaSave } from "react-icons/fa";
import "./CreateGame.css";
const CreateGame = () => {
  // Estado inicial do formulário, agora incluindo sellerID
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    genre: "",
    sellerID: "", // Inicia como vazio
  });

  // Novos estados para gerenciar a lista de vendedores
  const [sellers, setSellers] = useState([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // useEffect para buscar os vendedores quando o componente é montado
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        // IMPORTANTE: Em uma aplicação real, você precisa enviar o token de autenticação
        // no cabeçalho (header) desta requisição.
        // const token = localStorage.getItem('authToken');
        const response = await fetch("http://localhost:4500/sellers", {
          // headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          // Mock de dados para demonstração se a API falhar
          console.warn("API falhou. Usando dados mocados para vendedores.");
          setSellers([
            { id: 1, name: "Vendedor Exemplo 1" },
            { id: 2, name: "Vendedor Exemplo 2" },
          ]);
        } else {
          const data = await response.json();
          setSellers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar vendedores:", error);
      } finally {
        setIsLoadingSellers(false);
      }
    };

    fetchSellers();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Converte o valor para número se o campo for sellerID, price ou stock
    const parsedValue = ["sellerID", "price", "stock"].includes(name)
      ? Number(value)
      : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    console.log("Dados a serem enviados para a API:");
    for (let [key, value] of submissionData.entries()) {
      console.log(`${key}:`, value);
    }
    alert(
      "Jogo cadastrado com sucesso! (Verifique o console para ver os dados)"
    );
  };

  return (
    <>
      <main className="create-game-page">
        <h2 className="create-game-title">Cadastrar Novo Jogo</h2>

        <form className="game-form-card" onSubmit={handleSubmit}>
          <div className="game-form-grid">
            <div className="form-column-left">
              <div className="profile-form-group">
                <label htmlFor="title">Título do Jogo</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* --- NOVO CAMPO DE SELEÇÃO DE VENDEDOR --- */}
              <div className="profile-form-group">
                <label htmlFor="sellerID">Atribuir ao Vendedor</label>
                <select
                  id="sellerID"
                  name="sellerID"
                  value={formData.sellerID}
                  onChange={handleChange}
                  required
                  disabled={isLoadingSellers}
                >
                  <option value="" disabled>
                    {isLoadingSellers
                      ? "Carregando vendedores..."
                      : "Selecione um vendedor"}
                  </option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name} (ID: {seller.id})
                    </option>
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
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="stock">Estoque (Unidades)</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="genre">Gênero</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecione um gênero
                  </option>
                  <option value="RPG">RPG</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Ação">Ação</option>
                  <option value="Plataforma">Plataforma</option>
                </select>
              </div>

              <div className="profile-form-group">
                <label htmlFor="image">Imagem do Jogo</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="image" className="image-upload-area">
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
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Pré-visualização do Jogo"
                    className="image-preview"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="game-form-actions">
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
        </form>
      </main>
    </>
  );
};

export default CreateGame;
