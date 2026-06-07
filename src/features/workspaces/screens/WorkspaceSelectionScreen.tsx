import React, { useState } from "react";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Landmark, X } from "lucide-react";
import logoNome from "@/assets/logo-nome.png";
import { workspaceRepository } from "@/storage/repositories/workspaceRepository";
import { nanoid } from "nanoid";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { WorkspaceType } from "@/shared/models/finance";

export const WorkspaceSelectionScreen: React.FC = () => {
  const { workspaces, changeWorkspace } = useWorkspaces();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsType, setNewWsType] = useState<WorkspaceType>("ACCOUNT");
  const [newWsLimit, setNewWsLimit] = useState("");
  const [isSaving, setIsLoading] = useState(false);

  const handleSelect = (id: string) => {
    changeWorkspace(id);
    navigate("/");
  };

  const handleCreate = async () => {
    if (!user || !newWsName.trim()) return;

    setIsLoading(true);
    try {
      const id = nanoid();
      await workspaceRepository.save({
        id,
        userId: user.uid,
        name: newWsName.trim(),
        type: newWsType,
        metadata: newWsType === "CREDIT_CARD" ? {
          limit: parseFloat(newWsLimit) || 0,
          closingDay: 15,
          dueDay: 22,
          color: "#0A84FF"
        } : {
          color: "#30D158"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      window.location.reload(); // Refresh list
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-black text-white d-flex flex-column align-items-center justify-content-center p-4 no-scrollbar">
      <div className="mb-5 mt-4">
        <img src={logoNome} alt="Nexo" style={{ height: "60px" }} />
      </div>

      <h1 className="h2 fw-bold mb-5">Quem está usando?</h1>

      <Container style={{ maxWidth: "800px" }}>
        <Row className="justify-content-center g-4">
          {workspaces.map((ws) => (
            <Col xs={6} md={3} key={ws.id}>
              <div 
                className="d-flex flex-column align-items-center gap-3 cursor-pointer profile-item"
                onClick={() => handleSelect(ws.id)}
              >
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center transition-all shadow-lg"
                  style={{ 
                    width: "140px", 
                    height: "140px", 
                    backgroundColor: ws.metadata?.color || "#1C1C1E",
                    border: "3px solid transparent"
                  }}
                >
                  {ws.type === "ACCOUNT" ? (
                    <Landmark size={56} className="text-white opacity-90" />
                  ) : (
                    <CreditCard size={56} className="text-white opacity-90" />
                  )}
                </div>
                <span className="text-ios-gray fs-5 fw-medium text-center text-truncate w-100 px-2">
                  {ws.name}
                </span>
              </div>
            </Col>
          ))}

          <Col xs={6} md={3}>
            <div 
              className="d-flex flex-column align-items-center gap-3 cursor-pointer profile-item"
              onClick={() => setShowModal(true)}
            >
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center transition-all bg-ios-dark-gray shadow-lg"
                style={{ width: "140px", height: "140px", border: "3px solid transparent" }}
              >
                <Plus size={56} className="text-ios-gray opacity-40" />
              </div>
              <span className="text-ios-gray fs-5 fw-medium text-center">
                Novo Espaço
              </span>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-ios-dark-gray text-white border-0 rounded-4">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold">Novo Espaço Financeiro</Modal.Title>
          <Button variant="link" onClick={() => setShowModal(false)} className="text-white p-0">
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-ios-gray text-uppercase">Nome do Espaço</Form.Label>
            <Form.Control 
              placeholder="Ex: Nubank, Banco do Brasil..." 
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-ios-gray text-uppercase">Tipo de Controle</Form.Label>
            <div className="d-flex gap-2">
              <Button 
                variant={newWsType === 'ACCOUNT' ? 'primary' : 'ios-secondary'}
                className="flex-grow-1 py-3 fw-bold border-0"
                onClick={() => setNewWsType('ACCOUNT')}
              >
                Conta Corrente
              </Button>
              <Button 
                variant={newWsType === 'CREDIT_CARD' ? 'primary' : 'ios-secondary'}
                className="flex-grow-1 py-3 fw-bold border-0"
                onClick={() => setNewWsType('CREDIT_CARD')}
              >
                Cartão de Crédito
              </Button>
            </div>
          </Form.Group>

          {newWsType === 'CREDIT_CARD' && (
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Limite do Cartão</Form.Label>
              <Form.Control 
                type="number"
                placeholder="R$ 0,00" 
                value={newWsLimit}
                onChange={(e) => setNewWsLimit(e.target.value)}
                className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
              />
            </Form.Group>
          )}

          <Button 
            variant="primary" 
            className="w-100 py-3 fw-bold rounded-3 fs-5 mt-2 border-0 shadow"
            onClick={handleCreate}
            disabled={isSaving || !newWsName}
          >
            {isSaving ? "Criando..." : "Criar Espaço"}
          </Button>
        </Modal.Body>
      </Modal>

      <style>{`
        .profile-item:hover div {
          border-color: rgba(255,255,255,0.5) !important;
          transform: scale(1.05);
        }
        .profile-item:hover span {
          color: white !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
