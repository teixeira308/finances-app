import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Nav, Badge, Row, Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, createPurchase } from '@/features/transactions/store/transactionsSlice';
import { createRecurringTransaction } from '@/features/transactions/store/recurringTransactionsSlice';
import { ChevronDown, ArrowLeft, Calendar, Info, Plus, ArrowRight, ChevronLeft, DollarSign, Tag, Sparkles, ArrowUpDown, ChevronRight } from 'lucide-react';
import { TransactionType, RecurrenceType, BusinessDayConfig } from '@/shared/models/finance';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { projectInstallments } from '@/shared/utils/installments';
import { selectHasSeenTransactionGuide, finishTransactionGuide } from '@/features/onboarding/store/onboardingSlice';

const guideSteps = [
  {
    icon: ArrowUpDown,
    title: 'Tipo de Transação',
    description: 'Escolha entre Despesa (saída de dinheiro) ou Receita (entrada). Para cartão de crédito, apenas despesas são permitidas.',
  },
  {
    icon: DollarSign,
    title: 'Valor e Parcelas',
    description: 'Digite o valor total da transação. Se for cartão de crédito, defina em quantas parcelas deseja pagar.',
  },
  {
    icon: Tag,
    title: 'Categoria e Data',
    description: 'Organize por categoria para acompanhar seus gastos depois nos relatórios. Escolha a data correta da transação.',
  },
  {
    icon: Sparkles,
    title: 'Pronto!',
    description: 'Agora você já sabe como funciona. Vamos criar sua primeira transação?',
  },
];

const TransactionGuide: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const isLastStep = step === guideSteps.length - 1;
  const progress = ((step + 1) / guideSteps.length) * 100;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-black text-white overflow-hidden" style={{ zIndex: 1050 }}>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 122, 255, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div className="mx-4 mt-4" style={{ height: 3 }}>
        <div
          className="h-100 rounded-pill transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--ios-blue)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-4 position-relative">
        <div className="w-100 text-center" key={step}>
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-4 mb-5"
            style={{
              width: 96,
              height: 96,
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
            }}
          >
            {React.createElement(guideSteps[step].icon, {
              size: 48,
              strokeWidth: 1.5,
              className: 'text-primary',
            })}
          </div>
          <h1 className="fw-bold mb-3" style={{ fontSize: '1.75rem' }}>
            {guideSteps[step].title}
          </h1>
          <p className="text-ios-gray mb-0" style={{ fontSize: '1.05rem', maxWidth: 340, margin: '0 auto' }}>
            {guideSteps[step].description}
          </p>
        </div>
      </div>

      <div className="p-4 position-relative">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-center gap-2 mb-2">
            {guideSteps.map((_, i) => (
              <div
                key={i}
                className="rounded-pill transition-all"
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  backgroundColor: i === step ? 'var(--ios-blue)' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <div className="d-flex gap-3">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn border-0 py-3 px-4 rounded-3 d-flex align-items-center justify-content-center gap-2 text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <ChevronLeft size={20} />
                Voltar
              </button>
            ) : (
              <div className="flex-grow-1" />
            )}
            <button
              onClick={() => (isLastStep ? onFinish() : setStep(s => s + 1))}
              className="btn border-0 py-3 px-4 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 text-white"
              style={{ backgroundColor: 'var(--ios-blue)' }}
            >
              {isLastStep ? 'Criar Transação' : 'Continuar'}
              {!isLastStep && <ChevronRight size={20} />}
            </button>
          </div>

          {!isLastStep && (
            <button
              onClick={onFinish}
              className="btn border-0 py-2 text-ios-gray small text-decoration-none shadow-none"
            >
              Pular tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NewTransactionScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const { activeWorkspace, activeWorkspaceId } = useWorkspaces();
  const hasSeenGuide = useAppSelector(selectHasSeenTransactionGuide);

  // Basic Info
  const [txType, setTxType] = useState('expense');
  const [displayAmount, setDisplayAmount] = useState('R$ 0,00');
  const [rawAmount, setRawAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [installments, setInstallments] = useState(1);

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

  if (!hasSeenGuide) {
    return (
      <TransactionGuide
        onFinish={async () => {
          await dispatch(finishTransactionGuide());
        }}
      />
    );
  }

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
    if (!categoryId && activeWorkspace?.type !== 'CREDIT_CARD') {
      setTxError('Selecione uma categoria');
      return;
    }
    if (!activeWorkspaceId) {
      setTxError('Espaço financeiro não identificado');
      return;
    }

    setIsLoading(true);
    try {
      if (activeWorkspace?.type === 'CREDIT_CARD' && installments > 1) {
        const purchaseTransactions = projectInstallments({
          userId: '', // set by repository
          workspaceId: activeWorkspaceId,
          type: 'expense',
          amount: rawAmount / installments,
          categoryId,
          occurredAt: new Date(occurredAt).toISOString(),
          note: note || 'Compra Parcelada'
        }, installments);
        await dispatch(createPurchase(purchaseTransactions)).unwrap();
      } else if (!isRecurring) {
        await dispatch(createTransaction({
          userId: '',
          workspaceId: activeWorkspaceId,
          type: txType as TransactionType,
          amount: rawAmount,
          categoryId,
          occurredAt: new Date(occurredAt).toISOString(),
          note
        })).unwrap();
      } else {
        await dispatch(createRecurringTransaction({
          userId: '',
          workspaceId: activeWorkspaceId,
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
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Valor Total</Form.Label>
                <Form.Control type="text" inputMode="decimal" value={displayAmount} onChange={handleAmountChange} autoFocus className="text-center py-4 border-0 bg-transparent fs-1 fw-bold text-white shadow-none" style={{ fontSize: '3rem' }} />
              </Form.Group>

              {activeWorkspace?.type === 'CREDIT_CARD' && (
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Parcelas</Form.Label>
                  <Form.Select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                    className="py-3 fw-bold border-0 bg-ios-secondary text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <option key={n} value={n}>{n}x {n > 1 ? `de R$ ${(rawAmount / n).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

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
                    {activeWorkspace?.type === 'CREDIT_CARD' && (
                      <option value="">Sem categoria</option>
                    )}
                    {filteredCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </Form.Select>
                  <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Data</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={occurredAt}
                  onChange={(e) => setOccurredAt(e.target.value)}
                  className="py-3 fw-bold border-0 bg-ios-secondary text-white"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-ios-gray mb-1 text-uppercase">Observação</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Almoço com a família"
                  className="py-3 border-0 bg-ios-secondary text-white shadow-none"
                />
              </Form.Group>

              {activeWorkspace?.type === 'ACCOUNT' && (
                <div className="mb-4">
                  <Button
                    variant="link"
                    className="p-0 text-ios-gray text-decoration-none d-flex align-items-center gap-2"
                    onClick={() => setIsRecurring(!isRecurring)}
                  >
                    <div className={`p-1 rounded-circle border ${isRecurring ? 'bg-primary border-primary' : 'border-ios-gray'}`}>
                      {isRecurring && <Plus size={12} className="text-white" />}
                    </div>
                    <span>Esta é uma transação recorrente</span>
                  </Button>
                </div>
              )}

              {txError && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small py-2 mb-4">
                  {txError}
                </div>
              )}

              <Button
                onClick={handleSaveTransaction}
                disabled={isLoading}
                className="btn btn-primary w-100 py-3 rounded-3 fw-bold fs-5 shadow-lg border-0 mt-4"
              >
                {isLoading ? 'Salvando...' : 'Salvar Transação'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};
export default NewTransactionScreen;
