import React from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Shield, HelpCircle, ChevronRight, LogOut, User, Lock } from 'lucide-react';
import { logout } from '@/features/auth/services/authService';
import logoNome from '@/assets/logo-nome.png';

const SettingsScreen = () => {
  const navigate = useNavigate();

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <img src={logoNome} alt="Gastos Mensais" className="rounded-3" style={{ height: '30px' }} />
      </div>

      <div className="text-center p-3 mb-4 rounded-3 bg-ios-secondary">
        <p className="text-white fw-bold mb-2">Controle suas finanças de forma rápida e intuitiva.</p>
        <p className="small text-white-50 m-0">
          O Nexo ajuda você a visualizar gastos, acompanhar metas e manter sua vida financeira organizada.
        </p>
      </div>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none mt-4 rounded-3">
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item
            action
            onClick={() => navigate('/profile')}
            className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between text-white"
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(10, 132, 255, 0.1)', color: 'var(--ios-blue)' }}
              >
                <User size={18} />
              </div>
              <span className="fw-bold">Meu Perfil</span>
            </div>
            <ChevronRight size={18} className="text-ios-gray opacity-40" />
          </ListGroup.Item>

          <ListGroup.Item
            action
            onClick={() => navigate('/security')}
            className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between text-white"
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255, 159, 10, 0.1)', color: '#FF9F0A' }}
              >
                <Lock size={18} />
              </div>
              <span className="fw-bold">Segurança</span>
            </div>
            <ChevronRight size={18} className="text-ios-gray opacity-40" />
          </ListGroup.Item>
          
          <ListGroup.Item
            action
            onClick={() => navigate('/privacy')}
            className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between text-white"
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255, 69, 58, 0.1)', color: 'var(--ios-red)' }}
              >
                <Shield size={18} />
              </div>
              <span className="fw-bold">Privacidade</span>
            </div>
            <ChevronRight size={18} className="text-ios-gray opacity-40" />
          </ListGroup.Item>
          
          <ListGroup.Item
            action
            className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between text-white"
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(48, 209, 88, 0.1)', color: 'var(--ios-green)' }}
              >
                <HelpCircle size={18} />
              </div>
              <span className="fw-bold">Ajuda e Suporte</span>
            </div>
            <ChevronRight size={18} className="text-ios-gray opacity-40" />
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none rounded-3">
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item
            action
            onClick={() => logout()}
            className="bg-transparent border-0 px-3 py-3 d-flex align-items-center gap-3 text-ios-red"
          >
            <div 
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255, 69, 58, 0.1)' }}
            >
              <LogOut size={18} />
            </div>
            <span className="fw-bold">Sair da Conta</span>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <div className="text-center mt-5 mb-5 opacity-40">
        <p className="small m-0 text-ios-gray">Versão 3.1.0</p>
      </div>
    </Container>
  );
};

export default SettingsScreen;
