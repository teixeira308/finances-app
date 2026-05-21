import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Nav, Badge } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const NewTransactionScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  
  const [txType, setTxType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      setTxError('Informe um valor válido');
      return;
    }
    if (!categoryId) {
      setTxError('Selecione uma categoria');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(createTransaction({
        type: txType as 'income' | 'expense',
        amount: Number(amount),
        categoryId,
        occurredAt: new Date(occurredAt).toISOString(),
        note
      })).unwrap();
      dispatch(bootstrapTransactions());
      navigate('/');
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex align-items-center gap-3 pt-4 mb-4">
        <Button 
          variant="link" 
          onClick={() => navigate(-1)} 
          className="p-2 text-white border-0 bg-white bg-opacity-5 rounded-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="h1 fw-bold m-0 text-truncate">Nova Transação</h1>
      </div>

      <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
        <Card.Body className="p-0">
          <Nav 
            variant="pills" 
            activeKey={txType} 
            onSelect={(k) => setTxType(k as string)}
            className="bg-white bg-opacity-5 p-1 rounded-3 mb-4"
          >
            <Nav.Item className="flex-grow-1">
              <Nav.Link 
                eventKey="expense" 
                className={`text-center py-2 border-0 rounded-2 fw-bold ${txType === 'expense' ? 'bg-ios-red text-white' : 'text-ios-gray'}`}
              >
                Despesa
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-grow-1">
              <Nav.Link 
                eventKey="income" 
                className={`text-center py-2 border-0 rounded-2 fw-bold ${txType === 'income' ? 'bg-ios-green text-white' : 'text-ios-gray'}`}
              >
                Receita
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">VALOR</Form.Label>
              <Form.Control 
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="text-center py-3 fs-3 fw-bold border-0 bg-white bg-opacity-5"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">CATEGORIA</Form.Label>
              <div className="position-relative">
                <Form.Select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="py-3 fw-bold border-0 bg-white bg-opacity-5"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
                <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">DATA E HORA</Form.Label>
              <Form.Control 
                type="datetime-local"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                className="py-3 border-0 bg-white bg-opacity-5"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray mb-1">OBSERVAÇÃO (OPCIONAL)</Form.Label>
              <Form.Control 
                placeholder="Ex: Almoço com amigos" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="py-3 border-0 bg-white bg-opacity-5"
              />
            </Form.Group>

            {txError && <Badge bg="danger" className="w-100 py-2 bg-opacity-25 text-danger border-0">{txError}</Badge>}
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-auto pt-2">
        <Button 
          variant="primary" 
          onClick={handleSaveTransaction}
          disabled={isLoading}
          className="w-100 rounded-4 py-3 fw-bold shadow-lg text-lg"
        >
          {isLoading ? 'Salvando...' : 'Salvar Transação'}
        </Button>
      </div>
    </Container>
  );
};

export default NewTransactionScreen;
