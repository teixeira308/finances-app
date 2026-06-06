import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Nav, Badge, Row, Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { createRecurringTransaction } from '@/features/transactions/store/recurringTransactionsSlice';
import { ChevronDown, ArrowLeft, Calendar, Info, Plus } from 'lucide-react';
import { TransactionType, RecurrenceType, BusinessDayConfig } from '@/shared/models/finance';

const NewTransactionScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  
  // Basic Info
  const [txType, setTxType] = useState('expense');
  const [displayAmount, setDisplayAmount] = useState('R$ 0,00');
  const [rawAmount, setRawAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));

  // Recurring Info
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceType>('monthly');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [businessDayConfig, setBusinessDayConfig] = useState<BusinessDayConfig | undefined>(undefined);
  const [selectedWeekDay, setSelectedWeekDay] = useState<number>(new Date().getDay());
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredCategories = useMemo(() => categories.filter(c => c.type === txType), [categories, txType]);
  
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [txType, filteredCategories]);

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
      if (!isRecurring) {
        await dispatch(createTransaction({
          type: txType as TransactionType,
          amount: rawAmount,
          categoryId,
          occurredAt: new Date(occurredAt).toISOString(),
          note
        })).unwrap();
      } else {
        await dispatch(createRecurringTransaction({
          name: note || 'Transação Recorrente',
          type: txType as TransactionType,
          amount: rawAmount,
          categoryId,
          frequency,
          dayOfMonth: frequency === 'monthly' ? selectedDay : undefined,
          dayOfWeek: frequency === 'weekly' ? selectedWeekDay : undefined,
          businessDayConfig,
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
          <Button variant="link" onClick={() => navigate(-1)} className="p-2 text-white border-0 bg-opacity-5 rounded-3">
            <ArrowLeft size={32} />
          </Button>
          <h1 className="h3 fw-bold m-0 text-truncate">Nova Transação</h1>
        </div>

        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
          <Card.Body className="p-0">
            <Nav variant="pills" activeKey={txType} onSelect={(k) => setTxType(k as string)} className="bg-black p-1 rounded-3 mb-4">
              <Nav.Item className="flex-grow-1">
                <Nav.Link eventKey="expense" className={`text-center py-2 border-0 rounded-2 fw-bold ${txType === 'expense' ? 'bg-ios-red text-white' : 'text-ios-gray'}`}>Despesa</Nav.Link>
              </Nav.Item>
              <Nav.Item className="flex-grow-1">
                <Nav.Link eventKey="income" className={`text-center py-2 border-0 rounded-2 fw-bold ${txType === 'income' ? 'bg-ios-green text-white' : 'text-ios-gray'}`}>Receita</Nav.Link>
              </Nav.Item>
            </Nav>

            <Form className="space-y-4">
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Valor</Form.Label>
                <Form.Control type="text" inputMode="decimal" value={displayAmount} onChange={handleAmountChange} autoFocus className="text-center py-4 border-0 bg-transparent fs-1 fw-bold text-white shadow-none" style={{ fontSize: '3rem' }} />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="small fw-bold text-ios-gray m-0 text-uppercase">Categoria</Form.Label>
                  <Button variant="link" size="sm" className="text-primary p-0 text-decoration-none" onClick={() => navigate('/categories')}>
                    <Plus size={14} className="me-1" />
                    Nova
                  </Button>
                </div>
                <div className="position-relative">
                  <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="py-3 fw-bold border-0 bg-ios-secondary text-white">
                    {filteredCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </Form.Select>
                  <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </Form.Group>

              {/* ... (rest of the form stays same) ... */}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};
export default NewTransactionScreen;
