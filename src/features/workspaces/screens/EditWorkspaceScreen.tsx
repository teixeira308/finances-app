import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Modal, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { workspaceRepository } from "@/storage/repositories/workspaceRepository";
import { ArrowLeft, Trash2 } from "lucide-react";

export const EditWorkspaceScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspaces } = useWorkspaces();
  
  const workspace = workspaces.find((w) => w.id === id);
  
  const [name, setName] = useState(workspace?.name || "");
  const [limit, setLimit] = useState(workspace?.metadata?.limit?.toString() || "");
  const [dueDay, setDueDay] = useState(workspace?.metadata?.dueDay?.toString() || "");
  const [color, setColor] = useState(workspace?.metadata?.color || "#1C1C1E");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setLimit(workspace.metadata?.limit?.toString() || "");
      setDueDay(workspace.metadata?.dueDay?.toString() || "");
      setColor(workspace.metadata?.color || "#1C1C1E");
    }
  }, [workspace]);

  const handleSave = async () => {
    if (!id || !name.trim()) return;

    if (workspace?.type === 'CREDIT_CARD') {
      const day = parseInt(dueDay);
      if (isNaN(day) || day < 1 || day > 31) {
        setError("O dia de vencimento deve estar entre 1 e 31.");
        return;
      }
    }

    setIsSaving(true);
    setError(null);
    try {
      await workspaceRepository.update(id, {
        name: name.trim(),
        metadata: {
          ...workspace?.metadata,
          limit: parseFloat(limit) || 0,
          dueDay: parseInt(dueDay) || 0,
          color: color,
        }
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || deleteConfirmation !== "EXCLUIR") return;

    setIsDeleting(true);
    try {
      await workspaceRepository.delete(id);
      navigate("/workspaces");
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!workspace) return <Container className="p-4 text-white">Espaço não encontrado.</Container>;

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex align-items-center gap-3 pt-4 mb-4">
<Button variant="link" onClick={() => navigate("/workspaces")}
            className="p-2 text-white border-0 bg-black rounded-3" aria-label="Voltar">
          <ArrowLeft size={32} />
        </Button>
        <h1 className="h3 fw-bold m-0 text-truncate">Editar Espaço</h1>
      </div>

      <Card className="bg-ios-dark-gray border-0 p-4 rounded-4 shadow-none mb-4">
        <Card.Body className="p-0">
          {error && <Alert variant="danger" className="border-0 rounded-3 mb-4">{error}</Alert>}

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-ios-gray text-uppercase">Nome do Espaço</Form.Label>
            <Form.Control 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-ios-gray text-uppercase">Cor do Espaço</Form.Label>
            <Form.Control
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="p-0 border-0 bg-transparent w-100"
              style={{ height: '80px', cursor: 'pointer' }}
            />
          </Form.Group>

          {workspace.type === 'CREDIT_CARD' && (
            <>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray text-uppercase">Limite do Cartão</Form.Label>
                <Form.Control 
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray text-uppercase">Dia de Vencimento</Form.Label>
                <Form.Control 
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                />
              </Form.Group>
            </>
          )}

          <Button 
            variant="primary" 
            className="w-100 py-3 fw-bold rounded-3 fs-5 mt-2 border-0 shadow"
            onClick={handleSave}
            disabled={isSaving || !name}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>

          <Button 
            variant="outline-danger" 
            className="w-100 py-3 fw-bold rounded-3 fs-5 mt-3 border-0"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={18} className="me-2" />
            Excluir Espaço
          </Button>
        </Card.Body>
      </Card>
      
      {/* Modal de confirmação de exclusão (não alterado) */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="bg-ios-dark-gray text-white border-0 rounded-4">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold text-ios-red">Excluir Espaço</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p>Esta ação é irreversível. Todos os dados serão apagados.</p>
          <Form.Group>
            <Form.Label className="small fw-bold text-ios-gray">Digite "EXCLUIR" para confirmar:</Form.Label>
            <Form.Control 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <Button variant="ios-secondary" onClick={() => setShowDeleteModal(false)} className="py-3 px-4">Cancelar</Button>
          <Button 
            variant="danger" 
            className="py-3 px-4 fw-bold"
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirmation !== "EXCLUIR"}
          >
            {isDeleting ? "Excluindo..." : "Excluir Definitivamente"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
