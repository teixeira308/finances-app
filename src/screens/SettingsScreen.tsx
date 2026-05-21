import React from 'react';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';
import { Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { logout } from '@/features/auth/services/authService';

const SettingsScreen = () => {
  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Ajustes</h1>
      </div>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none mt-4">
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item
            action
            className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between text-white"
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255, 69, 58, 0.2)', color: 'var(--ios-red)' }}
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
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(48, 209, 88, 0.2)', color: 'var(--ios-green)' }}
              >
                <HelpCircle size={18} />
              </div>
              <span className="fw-bold">Ajuda e Suporte</span>
            </div>
            <ChevronRight size={18} className="text-ios-gray opacity-40" />
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none">
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
        <p className="small m-0 text-ios-gray">Versão 3.1.0 (Bootstrap Edition)</p>
        <p className="text-uppercase tracking-tighter m-0" style={{ fontSize: '8px' }}>Powered by Bootstrap & Firebase</p>
      </div>
    </Container>
  );
};

export default SettingsScreen;
