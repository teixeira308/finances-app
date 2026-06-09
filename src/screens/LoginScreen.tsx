import React, { useState } from 'react';
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';
import { login } from '@/features/auth/services/authService';
import logoNome from '@/assets/logo-nome.png';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      window.history.replaceState(null, '', '/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center p-4" style={{ minHeight: '100dvh', height: '100%' }}>
      <Card className="w-100 bg-ios-dark-gray border-0 shadow-lg" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-5 text-center">
          <img src={logoNome} alt="Gastos Mensais" className="mb-4 rounded-3" style={{ width: '100%', maxWidth: '200px' }} />
         
          
          <Form onSubmit={handleSubmit} className="text-start">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">E-MAIL</Form.Label>
              <Form.Control 
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-3 border-0 bg-ios-secondary text-white"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">SENHA</Form.Label>
              <Form.Control 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-3 border-0 bg-ios-secondary text-white"
              />
            </Form.Group>

            {error && <Badge bg="danger" className="w-100 py-2 mb-4 bg-opacity-25 text-danger border-0">{error}</Badge>}

            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              className="w-100 py-3 rounded-3 fw-bold shadow-lg mt-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginScreen;
