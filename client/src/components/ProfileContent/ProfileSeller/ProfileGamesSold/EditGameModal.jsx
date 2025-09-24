import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

import moment from "moment";

import styles from "./editGameModal.module.css";

const EditGameModal = ({ show, onHide, game, refreshFetch = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    genre: "",
  });

  const [categories, setCategories] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const alertRef = useRef(null);
  const modalBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cookies] = useCookies(["authToken"]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4500/games/genres");

      if (!response.ok)
        throw new Error("Problemas ao realizar o fetch de produtos");

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Falha ao buscar categorias:", err.message);

      // fallback
      const fallbackCategories = ["Ação", "RPG", "Aventura"];
      setCategories(fallbackCategories);
    }
  };

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || "",
        description: game.description || "",
        price: game.price || "0",
        stock: game.stock || "0",
        genre: game.genre || "",
      });
      setPreviewImage(game.imageUrl || "");
    }

    fetchCategories();
  }, [game]);

  useEffect(() => {
    if (showDeleteConfirm && alertRef.current && modalBodyRef.current) {
      setTimeout(() => {
        alertRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showDeleteConfirm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(game.imageUrl); // volta para original
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("stock", parseInt(formData.stock));
      formDataToSend.append("genre", formData.genre);

      if (imageFile) formDataToSend.append("image", imageFile);

      const response = await fetch(`http://localhost:4500/games/${game.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Erro ao atualizar jogo");

      toast.success("Jogo atualizado com sucesso!");
      refreshFetch();
      onHide();
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      toast.error("Erro ao atualizar jogo");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGame = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:4500/games/${game.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Erro ao deletar");

      toast.success("Jogo deletado com sucesso!");
      refreshFetch();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error(`${error?.message || error}`);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => setShowDeleteConfirm(true);
  const cancelDelete = () => setShowDeleteConfirm(false);

  if (!game) return null;

  return ReactDOM.createPortal(
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName={styles.editGameModal}
      contentClassName={styles.modalContent}
      style={{ zIndex: 1060 }}
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className={styles.modalHeader}
      >
        <Modal.Title className={styles.modalTitle}>
          🎮 Editar Jogo - {game.title}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body ref={modalBodyRef} className={styles.modalBody}>
          {showDeleteConfirm && (
            <div ref={alertRef}>
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>
                  Tem certeza que deseja excluir este jogo?
                </Alert.Heading>
                <p>
                  Esta ação não pode ser desfeita. Todas as informações do jogo
                  serão permanentemente removidas.
                </p>
                <hr />
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={cancelDelete}
                    disabled={deleting}
                  >
                    Manter Jogo
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteGame}
                    disabled={deleting}
                  >
                    {deleting ? "Excluindo..." : "Sim, Excluir Jogo"}
                  </Button>
                </div>
              </Alert>
            </div>
          )}

          <div className="mb-4">
            <div className="d-flex align-items-center gap-3">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className={`img-thumbnail ${styles.previewImage}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div className="flex-grow-1">
                <Form.Control
                  type="file"
                  accept="image/*"
                  className={`bg-white text-dark ${styles.gameInput}`}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={game?.deleted}
                />
                <Form.Text className={styles.formText}>
                  Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB
                </Form.Text>
              </div>
              {previewImage && !game?.deleted && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-white text-dark"
              disabled={game?.deleted}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-white text-dark"
              disabled={game?.deleted}
            />
          </Form.Group>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Preço (R$)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="bg-white text-dark"
                disabled={game?.deleted}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Estoque</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="bg-white text-dark"
                disabled={game?.deleted}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Gênero</Form.Label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className={styles.selectGenre}
              required
              disabled={game?.deleted}
            >
              <option value="-1">Selecione um gênero</option>
              {categories.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </Form.Group>

          <Alert variant="info" className="mt-4">
            <strong>Informações do Sistema:</strong>
            <div className="mt-2">
              {!game?.deleted ? (
                <>
                  <small>ID: {game.id}</small>
                  <br />
                </>
              ) : (
                ""
              )}
              <small>
                Criado em:{" "}
                {moment(game.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </small>
              <br />
              <small>
                {!game?.deleted ? "Última atualização" : "Deletado em"}:{" "}
                {moment(game.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
              </small>
            </div>
          </Alert>
        </Modal.Body>

        <Modal.Footer
          className={`${styles.modalFooter} d-flex justify-content-between`}
        >
          {!game?.deleted ? (
            <>
              <Button
                variant="outline-danger"
                onClick={confirmDelete}
                disabled={saving || deleting}
                className={styles.modalButton}
              >
                Excluir Jogo
              </Button>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={onHide}
                  disabled={saving || deleting}
                  className={styles.modalButton}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={saving || deleting}
                  className={styles.modalButton}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
        </Modal.Footer>
      </Form>
    </Modal>,
    document.body
  );
};

export default EditGameModal;
