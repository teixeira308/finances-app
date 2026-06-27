import React, { useState } from 'react';
import { Container, Card, Button, Form, Badge, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { changePassword, reauthenticateUser } from '@/features/auth/services/authService';

const SecurityScreen = () => {
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
  
  const [showReauthModal, setShowReauthModal] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'As senhas não coincidem.' });
      return;
    }
    setShowReauthModal(true);
  };

  const confirmReauth = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await reauthenticateUser(currentPassword);
      await changePassword(newPassword);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
      setShowReauthModal(false);
      setCurrentPassword('');
    } catch (err: any) {
      setMessage({ type: 'danger', text: err.message || 'Erro de re-autenticação. Verifique sua senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <div className="d-flex align-items-center gap-3 pt-4 mb-4">
<Button
        variant="none"
        onClick={() => navigate('/settings')}
        className="p-2 text-white border-0 bg-black rounded-3"
        aria-label="Voltar"
      >
        <ArrowLeft size={24} />
      </Button>
          <h1 className="h3 fw-bold m-0">Segurança</h1>
        </div>

        {message && (
          <Badge bg={message.type} className={`w-100 py-3 mb-4 border-0 rounded-3 bg-opacity-25 text-${message.type}`}>
            {message.text}
          </Badge>
        )}

        <Form onSubmit={handlePasswordChange}>
          <h6 className="small fw-bold text-ios-gray mb-3 text-uppercase px-1">Alterar Senha</h6>
          <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray mb-1">NOVA SENHA</Form.Label>
              <div className="position-relative">
                <Lock size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <Form.Control 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="py-3 ps-5 bg-ios-secondary border-0 text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold text-ios-gray mb-1">CONFIRMAR NOVA SENHA</Form.Label>
              <Form.Control 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-3 bg-ios-secondary border-0 text-white"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-4 py-3 rounded-3 fw-bold">
              Atualizar Senha
            </Button>
          </Card>
        </Form>
      </div>

      <Modal show={showReauthModal} onHide={() => setShowReauthModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Confirme sua Identidade</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-4 text-primary">
            <ShieldCheck size={48} />
          </div>
          <p className="text-ios-gray small mb-4">
            Para realizar alterações de segurança, precisamos que você confirme sua senha atual.
          </p>
          <Form.Group className="text-start">
            <Form.Label className="small fw-bold text-ios-gray mb-1">SENHA ATUAL</Form.Label>
            <Form.Control 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="py-3 bg-ios-secondary border-0 text-white"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="none" className="flex-grow-1 btn-ios-secondary py-3" onClick={() => setShowReauthModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" className="flex-grow-1 py-3 fw-bold" onClick={confirmReauth} disabled={isLoading || !currentPassword}>
            {isLoading ? <Spinner size="sm" /> : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SecurityScreen;
