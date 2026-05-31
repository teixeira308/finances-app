import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, UserCircle, Mail } from 'lucide-react';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { UserAvatar } from '@/shared/components/UserAvatar';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useUserProfile();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`.trim(),
        phoneNumber,
        preferences: {
          ...profile?.preferences,
          theme: 'dark',
          privacyMode: profile?.preferences?.privacyMode || false
        }
      });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Erro ao salvar alterações.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container className="mobile-container d-flex align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <div className="d-flex align-items-center gap-3 pt-4 mb-4">
          <Button 
            variant="none" 
            onClick={() => navigate('/settings')} 
            className="p-2 text-white border-0 bg-ios-secondary rounded-3"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="h3 fw-bold m-0">Meu Perfil</h1>
        </div>

        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none text-center">
          <div className="d-flex flex-column align-items-center mb-3">
            <UserAvatar 
              name={`${firstName} ${lastName}`.trim() || profile?.email || 'User'} 
              size={100} 
              className="mb-3 border border-4 border-primary border-opacity-20" 
            />
            <h4 className="fw-bold m-0 text-white">{firstName} {lastName}</h4>
            <p className="small text-ios-gray">{profile?.email}</p>
          </div>
        </Card>

        <Form onSubmit={handleSave}>
          <h6 className="small fw-bold text-ios-gray mb-3 text-uppercase px-1">Informações Básicas</h6>
          <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-ios-gray mb-1">NOME</Form.Label>
                  <div className="position-relative">
                    <User size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <Form.Control 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="py-3 ps-5 bg-ios-secondary border-0 text-white"
                      placeholder="Ex: Guilherme"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-ios-gray mb-1">SOBRENOME</Form.Label>
                  <div className="position-relative">
                    <UserCircle size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <Form.Control 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="py-3 ps-5 bg-ios-secondary border-0 text-white"
                      placeholder="Ex: Teixeira"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">E-mail</Form.Label>
                  <div className="position-relative">
                    <Mail size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <Form.Control 
                      value={profile?.email || ''}
                      readOnly
                      disabled
                      className="py-3 ps-5 bg-ios-secondary border-0 text-white opacity-50"
                    />
                  </div>
                  <Form.Text className="text-ios-gray extra-small">
                    O e-mail pode ser alterado na aba de Segurança.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Telefone</Form.Label>
                  <div className="position-relative">
                    <Phone size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <Form.Control 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="py-3 ps-5 bg-ios-secondary border-0 text-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {message && (
            <Badge bg={message.type} className={`w-100 py-3 mb-4 border-0 rounded-3 bg-opacity-25 text-${message.type}`}>
              {message.text}
            </Badge>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSaving}
            className="w-100 py-3 rounded-4 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
          >
            {isSaving ? <Spinner size="sm" /> : <Save size={20} />}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ProfileScreen;
