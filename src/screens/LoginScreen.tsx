import React, { useState } from 'react';
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';
import { login } from '@/features/auth/services/authService';

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex min-vh-100 align-items-center justify-content-center p-4">
      <Card className="w-100 bg-ios-dark-gray border-0 shadow-lg" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-5 text-center">
          <h1 className="h2 fw-bold mb-4">Bem-vindo</h1>
          <p className="text-ios-gray small mb-5">Entre para gerenciar seus gastos</p>
          
          <Form onSubmit={handleSubmit} className="text-start">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">EMAIL</Form.Label>
              <Form.Control 
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-3 border-0 bg-white bg-opacity-5"
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
                className="py-3 border-0 bg-white bg-opacity-5"
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
