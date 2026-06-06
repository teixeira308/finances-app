import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FullReportsScreen = () => {
  const navigate = useNavigate();

  return (
    <Container className="p-4">
        <div className="d-flex align-items-center gap-3 pt-4 mb-4">
          <Button variant="link" onClick={() => navigate(-1)} className="p-2 text-white border-0 bg-opacity-5 rounded-3">
            <ArrowLeft size={32} />
          </Button>
          <h1 className="h3 fw-bold m-0 text-truncate">Relatórios</h1>
        </div>
        {/* Adicione aqui o conteúdo dos relatórios */}
        <p className="text-white">Conteúdo detalhado de relatórios aqui...</p>
    </Container>
  );
};

export default FullReportsScreen;
