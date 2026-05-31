import React, { useState } from 'react';
import { Container, Card, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, ShieldAlert } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { deleteUserAccount } from '@/features/auth/services/authService';

const PrivacyScreen = () => {
  const navigate = useNavigate();
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  const goals = useAppSelector((state) => state.goals.items);
  
  const [isExporting, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = () => {
    setIsSaving(true);
    const data = {
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      goals
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meus-dados-financeiros-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Nota: Em um sistema real, aqui chamaríamos uma Cloud Function 
      // para deletar todos os documentos do Firestore vinculados ao UID.
      await deleteUserAccount();
      window.location.reload(); // Força logout total
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir conta. Re-autentique-se na aba Segurança primeiro.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

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
          <h1 className="h3 fw-bold m-0">Privacidade</h1>
        </div>

        <h6 className="small fw-bold text-ios-gray mb-3 text-uppercase px-1">Seus Dados</h6>
        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
          <p className="text-white small mb-4">
            Você tem o direito de baixar uma cópia de todos os seus dados financeiros armazenados no Nexo.
          </p>
          <Button 
            variant="none" 
            onClick={handleExportData} 
            disabled={isExporting}
            className="w-100 py-3 btn-ios-secondary rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            {isExporting ? <Spinner size="sm" /> : <Download size={20} />}
            Baixar meus dados (JSON)
          </Button>
        </Card>

        <h6 className="small fw-bold text-ios-red mb-3 text-uppercase px-1">Zona de Perigo</h6>
        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none border border-danger border-opacity-10">
          <p className="text-white small mb-4">
            A exclusão da conta é permanente e removerá todos os seus registros de transações, categorias e metas sem possibilidade de recuperação.
          </p>
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteModal(true)} 
            className="w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <Trash2 size={20} />
            Excluir minha conta
          </Button>
        </Card>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold text-danger">Atenção!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-4 text-danger">
            <ShieldAlert size={64} />
          </div>
          <h5 className="fw-bold text-white mb-3">Tem certeza absoluta?</h5>
          <p className="text-ios-gray small mb-0">
            Esta ação não pode ser desfeita. Todos os seus dados financeiros serão apagados permanentemente dos nossos servidores.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="none" className="flex-grow-1 btn-ios-secondary py-3" onClick={() => setShowDeleteModal(false)}>
            Manter conta
          </Button>
          <Button variant="danger" className="flex-grow-1 py-3 fw-bold" onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" /> : 'Sim, excluir tudo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrivacyScreen;
