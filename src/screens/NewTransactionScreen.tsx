import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Nav, Badge, Row, Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { createRecurringTransaction } from '@/features/transactions/store/recurringTransactionsSlice';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { TransactionType, RecurrenceType } from '@/shared/models/finance';

const NewTransactionScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  
  const [txType, setTxType] = useState('expense');
  const filteredCategories = useMemo(() => categories.filter(c => c.type === txType), [categories, txType]);
  
  const [displayAmount, setDisplayAmount] = useState('R$ 0,00');
  const [rawAmount, setRawAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceType>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  
  // Atualiza o categoryId quando o tipo muda
  useEffect(() => {
    setCategoryId(filteredCategories[0]?.id || '');
  }, [txType, filteredCategories]);

  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value, 10) / 100;
    
    if (isNaN(numericValue)) {
      setRawAmount(0);
      setDisplayAmount('R$ 0,00');
    } else {
      setRawAmount(numericValue);
      setDisplayAmount(new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(numericValue));
    }
  };

  const handleSaveTransaction = async () => {
    if (rawAmount <= 0) {
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
        type: txType as TransactionType,
        amount: rawAmount,
        categoryId,
        occurredAt: new Date(occurredAt).toISOString(),
        note
      })).unwrap();

      if (isRecurring) {
        const date = new Date(startDate);
        await dispatch(createRecurringTransaction({
          name: note || 'Transação Recorrente',
          type: txType as TransactionType,
          amount: rawAmount,
          categoryId,
          frequency,
          dayOfMonth: date.getDate(),
          startDate,
          endDate: endDate || undefined,
          isActive: true
        })).unwrap();
      }

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
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <div className="d-flex align-items-center gap-3 pt-4 mb-4">
          <Button 
            variant="link" 
            onClick={() => navigate(-1)} 
            className="p-2 text-white border-0 bg-white bg-opacity-5 rounded-3"
          >
            <ArrowLeft size={32} />
          </Button>
          <h1 className="h3 fw-bold m-0 text-truncate">Nova Transação</h1>
        </div>

        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
          <Card.Body className="p-0">
            <Nav 
              variant="pills" 
              activeKey={txType} 
              onSelect={(k) => setTxType(k as string)}
              className="bg-black bg-opacity-5 p-1 rounded-3 mb-4"
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
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Valor</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    type="text"
                    inputMode="decimal"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    autoFocus
                    className="text-center py-4 border-0 bg-transparent fs-1 fw-bold text-white shadow-none"
                    style={{ fontSize: '3.5rem' }}
                  />
                </div>
              </Form.Group>

              <Row className="g-4">
                <Col xs={12} md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Categoria</Form.Label>
                    <div className="position-relative">
                      <Form.Select 
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="py-3 fw-bold border-0 bg-white bg-opacity-5"
                      >
                        {filteredCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Form.Select>
                      <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Data e Hora</Form.Label>
                    <Form.Control 
                      type="datetime-local"
                      value={occurredAt}
                      onChange={(e) => setOccurredAt(e.target.value)}
                      className="py-3 border-0 bg-white bg-opacity-5"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Observação (Opcional)</Form.Label>
                <Form.Control 
                  placeholder="Ex: Almoço com amigos" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="py-3 border-0 bg-white bg-opacity-5"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check 
                  type="switch"
                  label="É transação recorrente?"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="text-white fw-bold custom-switch"
                />
                {isRecurring && (
                  <div className="mt-4 p-3 rounded-3 bg-white bg-opacity-5">
                    <Row className="g-3">
                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Frequência</Form.Label>
                          <Form.Select 
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as RecurrenceType)}
                            className="py-2 border-0 bg-black bg-opacity-20 text-white"
                          >
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="yearly">Anual</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Início</Form.Label>
                          <Form.Control 
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="py-2 border-0 bg-black bg-opacity-20 text-white"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Término</Form.Label>
                          <Form.Control 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="py-2 border-0 bg-black bg-opacity-20 text-white"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form.Group>

              {txError && <Badge bg="danger" className="w-100 py-3 bg-opacity-25 text-danger border-0 rounded-3 mb-3">{txError}</Badge>}
            </Form>
          </Card.Body>
        </Card>

        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={handleSaveTransaction}
            disabled={isLoading}
            className="w-100 rounded-4 py-3 fw-bold shadow-lg fs-5"
          >
            {isLoading ? 'Salvando...' : 'Salvar Transação'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NewTransactionScreen;
