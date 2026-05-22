import React, { useState } from 'react';
import { Container, Card, Button, ListGroup, Modal, Form, Badge, Nav } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, createCategory, deleteCategory, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { TransactionType } from '@/shared/models/finance';

const CategoriesScreen = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#0A84FF');
  const [categoryType, setCategoryType] = useState<TransactionType>('expense');
  const [error, setError] = useState<string | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setName('');
    setColor('#0A84FF');
    setCategoryType('expense');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    try {
      await dispatch(createCategory({
        name: name.trim(),
        type: categoryType,
        colorToken: color,
        iconToken: 'tag'
      })).unwrap();
      handleClose();
      dispatch(bootstrapCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteCategory(deleteId)).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      dispatch(bootstrapCategories());
    }
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex justify-content-between align-items-center pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Categorias</h1>
        <Button 
          variant="primary" 
          onClick={handleOpen} 
          className="rounded-3 d-flex align-items-center justify-content-center p-2"
        >
          <Plus size={20} />
        </Button>
      </div>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none">
        {categories.length > 0 ? (
          <ListGroup variant="flush" className="bg-transparent">
            {categories.map((category) => (
              <ListGroup.Item
                key={category.id}
                className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '44px', 
                      height: '44px', 
                      backgroundColor: `${category.colorToken}20` 
                    }}
                  >
                    <Tag size={20} style={{ color: category.colorToken }} />
                  </div>
                  <div className="d-flex flex-column">
                  <span className="fw-bold text-white">{category.name}</span>
                  <span className="small text-ios-gray">
                    {category.type === 'expense' ? 'Despesa' : 'Receita'}
                  </span>
                  </div>

                </div>
                
                <Button 
                  variant="link" 
                  className="p-1 text-ios-red opacity-50 shadow-none"
                  onClick={() => {
                    setDeleteId(category.id);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="py-5 text-center text-ios-gray">
            Nenhuma categoria encontrada
          </div>
        )}
      </Card>

      <Modal show={isModalOpen} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Nav 
            variant="pills" 
            activeKey={categoryType} 
            onSelect={(k) => setCategoryType(k as TransactionType)}
            className="bg-black bg-opacity-5 p-1 rounded-3 mb-4"
          >
            <Nav.Item className="flex-grow-1">
              <Nav.Link 
                eventKey="expense" 
                className={`text-center py-2 border-0 rounded-2 fw-bold ${categoryType === 'expense' ? 'bg-ios-red text-white' : 'text-ios-gray'}`}
              >
                Despesa
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-grow-1">
              <Nav.Link 
                eventKey="income" 
                className={`text-center py-2 border-0 rounded-2 fw-bold ${categoryType === 'income' ? 'bg-ios-green text-white' : 'text-ios-gray'}`}
              >
                Receita
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">NOME</Form.Label>
              <Form.Control 
                placeholder="Ex: Aluguel" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-3"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">COR</Form.Label>
              <div className="w-100">
                <Form.Control 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="p-0 border-0 bg-transparent w-100"
                  style={{ height: '80px', cursor: 'pointer' }}
                />
              </div>
            </Form.Group>
            
            {error && <Badge bg="danger" className="w-100 py-2 mb-3 bg-opacity-25 text-danger border-0">{error}</Badge>}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10 py-3" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="flex-grow-1 py-3" onClick={handleSubmit}>
            Criar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Excluir?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center text-ios-gray small py-3">
          Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10 py-3" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-grow-1 py-3 rounded-3 fw-bold" onClick={handleDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoriesScreen;
