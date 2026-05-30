import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Nav, Badge, Row, Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { createRecurringTransaction } from '@/features/transactions/store/recurringTransactionsSlice';
import { ChevronDown, ArrowLeft, Calendar, Info } from 'lucide-react';
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
    setCategoryId(filteredCategories[0]?.id || '');
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

  const summarySentence = useMemo(() => {
    const typeLabel = txType === 'income' ? 'receita' : 'despesa';
    if (frequency === 'monthly') {
      if (businessDayConfig === 'first') return `Esta ${typeLabel} será criada automaticamente no primeiro dia útil de cada mês.`;
      if (businessDayConfig === 'fifth') return `Esta ${typeLabel} será criada automaticamente no quinto dia útil de cada mês.`;
      if (businessDayConfig === 'last') return `Esta ${typeLabel} será criada automaticamente no último dia útil de cada mês.`;
      return `Esta ${typeLabel} será criada automaticamente todo dia ${selectedDay}.`;
    }
    if (frequency === 'weekly') {
      const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      return `Esta ${typeLabel} será criada automaticamente toda ${weekDays[selectedWeekDay]}.`;
    }
    if (frequency === 'yearly') {
      return `Esta ${typeLabel} será criada automaticamente uma vez por ano.`;
    }
    return '';
  }, [txType, frequency, selectedDay, businessDayConfig, selectedWeekDay]);

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

              <Row className="g-4">
                <Col xs={12} md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Categoria</Form.Label>
                    <div className="position-relative">
                      <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="py-3 fw-bold border-0 bg-ios-secondary">
                        {filteredCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </Form.Select>
                      <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  {!isRecurring && (
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Data e Hora</Form.Label>
                      <Form.Control type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} className="py-3 border-0 bg-ios-secondary" />
                    </Form.Group>
                  )}
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Observação (Opcional)</Form.Label>
                <Form.Control placeholder="Ex: Almoço com amigos" value={note} onChange={(e) => setNote(e.target.value)} className="py-3 border-0 bg-ios-secondary" />
              </Form.Group>

              <div className="mb-4 pt-2 border-top border-white border-opacity-10">
                <Form.Check type="switch" label="Repetir automaticamente" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="text-white fw-bold custom-switch py-2" />
                
                {isRecurring && (
                  <div className="mt-4 animate-in">
                    <h6 className="small fw-bold text-ios-gray mb-3 text-uppercase">Quando isso acontece?</h6>
                    
                    <div className="d-flex gap-2 mb-4 overflow-auto pb-2 no-scrollbar">
                      {['monthly', 'weekly', 'yearly'].map((freq) => (
                        <Button
                          key={freq}
                          variant="none"
                          onClick={() => setFrequency(freq as RecurrenceType)}
                          className={`rounded-pill px-4 py-2 btn-ios-secondary ${frequency === freq ? 'active' : ''}`}
                          size="sm"
                        >
                          {freq === 'monthly' ? 'Mensal' : freq === 'weekly' ? 'Semanal' : 'Anual'}
                        </Button>
                      ))}
                    </div>

                    {frequency === 'monthly' && (
                      <div className="space-y-4">
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {[1, 5, 10, 15, 20, 25].map(day => (
                            <Button
                              key={day}
                              variant="none"
                              onClick={() => { setSelectedDay(day); setBusinessDayConfig(undefined); }}
                              className={`rounded-3 px-3 py-2 btn-ios-secondary ${selectedDay === day && !businessDayConfig ? 'active' : ''}`}
                              style={{ minWidth: '60px' }}
                            >
                              Dia {day}
                            </Button>
                          ))}
                          <Form.Select 
                            className="bg-ios-secondary border-0 text-white rounded-3 px-3" 
                            style={{ width: 'auto', minWidth: '100px' }}
                            value={selectedDay}
                            onChange={(e) => { setSelectedDay(Number(e.target.value)); setBusinessDayConfig(undefined); }}
                          >
                            {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>Dia {i+1}</option>)}
                          </Form.Select>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-4">
                          {[
                            { label: '1º dia útil', config: 'first' },
                            { label: '5º dia útil', config: 'fifth' },
                            { label: 'Último dia útil', config: 'last' }
                          ].map(item => (
                            <Button
                              key={item.config}
                              variant="none"
                              onClick={() => { setBusinessDayConfig(item.config as BusinessDayConfig); }}
                              className={`rounded-3 px-3 py-2 btn-ios-secondary ${businessDayConfig === item.config ? 'active' : ''}`}
                            >
                              {item.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {frequency === 'weekly' && (
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
                          <Button
                            key={day}
                            variant="none"
                            onClick={() => setSelectedWeekDay(idx)}
                            className={`rounded-3 px-3 py-2 btn-ios-secondary ${selectedWeekDay === idx ? 'active' : ''}`}
                            style={{ minWidth: '60px' }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 d-flex align-items-start gap-2 border border-primary border-opacity-20">
                      <Info size={18} className="text-primary mt-1 flex-shrink-0" />
                      <p className="small m-0 text-white-50 leading-tight">
                        {summarySentence}
                      </p>
                    </div>

                    <Button variant="link" onClick={() => setShowAdvanced(!showAdvanced)} className="text-ios-gray small p-0 text-decoration-none mb-3 hover-white">
                      {showAdvanced ? 'Esconder opções avançadas' : 'Mostrar opções avançadas'}
                    </Button>

                    {showAdvanced && (
                      <Row className="g-3 animate-in">
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Início</Form.Label>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="py-2 border-0 bg-ios-secondary text-white" />
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Término</Form.Label>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="py-2 border-0 bg-ios-secondary text-white" />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}
              </div>

              {txError && <Badge bg="danger" className="w-100 py-3 bg-opacity-25 text-danger border-0 rounded-3 mb-3">{txError}</Badge>}
            </Form>
          </Card.Body>
        </Card>

        <div className="mt-4">
          <Button variant="primary" onClick={handleSaveTransaction} disabled={isLoading} className="w-100 rounded-4 py-3 fw-bold shadow-lg fs-5">
            {isLoading ? 'Salvando...' : 'Salvar Transação'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NewTransactionScreen;
