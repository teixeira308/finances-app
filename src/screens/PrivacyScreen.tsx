import React, { useState } from 'react';
import { Container, Card, Button, Badge, Modal, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, ShieldAlert, AlertTriangle, FileText } from 'lucide-react';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
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
      await deleteUserAccount();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir conta. Re-autentique-se na aba Segurança primeiro.');
      setShowConfirmModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteFlow = () => {
    setDeleteConfirmation("");
    setShowDeleteModal(true);
  };

  const handleFirstStepConfirm = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(true);
  };

  const closeAll = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(false);
    setDeleteConfirmation("");
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

        <h6 className="small fw-bold text-ios-gray mb-3 text-uppercase px-1">Termos e Políticas</h6>
        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
          <p className="text-white small mb-4">
            Leia os Termos de Uso e a Política de Privacidade do Nexo, em conformidade com
            a LGPD (Lei nº 13.709/2018), o Marco Civil da Internet (Lei nº 12.965/2014) e
            o Código de Defesa do Consumidor (Lei nº 8.078/1990).
          </p>
          <Button
            variant="none"
            onClick={() => navigate('/termos')}
            className="w-100 py-3 btn-ios-secondary rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <FileText size={20} />
            Termos de Uso e Privacidade
          </Button>
        </Card>

        <h6 className="small fw-bold text-ios-red mb-3 text-uppercase px-1">Zona de Perigo</h6>
        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none border border-danger border-opacity-10">
          <p className="text-white small mb-4">
            A exclusão da conta é permanente e removerá todos os seus registros de transações, categorias e metas sem possibilidade de recuperação.
          </p>
          <Button 
            variant="danger" 
            onClick={openDeleteFlow} 
            className="w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <Trash2 size={20} />
            Excluir minha conta
          </Button>
        </Card>
      </div>

      {/* Step 1 — Confirmação com digitação */}
      <Modal show={showDeleteModal} onHide={closeAll} centered contentClassName="bg-ios-dark-gray text-white border-0 rounded-4">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold text-ios-red">Excluir Conta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: 72, height: 72, backgroundColor: 'rgba(255, 69, 58, 0.15)' }}>
              <ShieldAlert size={36} className="text-ios-red" />
            </div>
            <h5 className="fw-bold text-white mb-2">Você tem certeza?</h5>
            <p className="text-ios-gray small mb-0">
              Você está prestes a excluir permanentemente sua conta <strong className="text-white">Nexo</strong>.
              Todos os seus <strong>espaços financeiros</strong>, transações, categorias, metas e
              configurações serão perdidos <strong className="text-white">para sempre</strong>.
            </p>
          </div>
          <Form.Group>
            <Form.Label className="small fw-bold text-ios-gray">
              Digite <span className="text-white">EXCLUIR</span> para continuar:
            </Form.Label>
            <Form.Control 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="EXCLUIR"
              className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none text-center fw-bold"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="none" className="flex-grow-1 btn-ios-secondary py-3" onClick={closeAll}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            className="flex-grow-1 py-3 fw-bold"
            onClick={handleFirstStepConfirm}
            disabled={deleteConfirmation !== "EXCLUIR"}
          >
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Step 2 — Último aviso */}
      <Modal show={showConfirmModal} onHide={closeAll} centered contentClassName="bg-ios-dark-gray text-white border-0 rounded-4">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold text-ios-red">Último Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 69, 58, 0.15)' }}>
              <AlertTriangle size={44} className="text-ios-red" />
            </div>
            <h5 className="fw-bold text-white mb-3">Isso é irreversível</h5>
            <p className="text-ios-gray mb-2">
              Esta é sua <strong className="text-white">última chance</strong>. Ao confirmar abaixo:
            </p>
            <ul className="text-ios-gray text-start mb-0" style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">• Sua <strong className="text-white">conta Nexo</strong> será deletada dos nossos servidores</li>
              <li className="mb-2">• Todos os <strong className="text-white">espaços financeiros</strong> serão perdidos</li>
              <li className="mb-2">• Todo seu <strong className="text-white">histórico de transações</strong> será apagado</li>
              <li className="mb-2">• Categorias e metas personalizadas serão removidas</li>
              <li className="mb-2">• Se você usa o app no <strong className="text-white">Android</strong>, todo o histórico será perdido</li>
              <li className="mb-0">• <strong className="text-white">Não há como recuperar</strong> seus dados depois disso</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="none" className="flex-grow-1 btn-ios-secondary py-3" onClick={closeAll}>
            Voltar
          </Button>
          <Button 
            variant="danger" 
            className="flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : <Trash2 size={18} />}
            {isDeleting ? "Excluindo..." : "Sim, Excluir Minha Conta"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrivacyScreen;
