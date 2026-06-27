import React, { useMemo, useState } from 'react';
import { Container, Card, Button, ListGroup, Modal, Badge, Form } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { deleteTransaction, updateTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { selectRecurringTransactions, bootstrapRecurringTransactions, deleteRecurringTransaction, createRecurringTransaction, updateRecurringTransaction } from '@/features/transactions/store/recurringTransactionsSlice';
import { 
  Trash2, Pencil, ArrowUpCircle, RefreshCw,
  ShoppingBag, Coffee, Car, Home, Film, Briefcase, Plus, Heart,
  ChevronLeft, ChevronRight, Calendar, Search, X, Tag
} from 'lucide-react';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { PrivacyToggle } from '@/shared/components/PrivacyToggle';
import { projectRecurringTransactions } from '@/shared/utils/projection';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher';
import type { Transaction, RecurringTransaction, TransactionType, RecurrenceType } from '@/shared/models/finance';

// Mapeamento de componentes de ícone
const categoryIcons: Record<string, React.ElementType> = {
  shopping: ShoppingBag,
  food: Coffee,
  transport: Car,
  housing: Home,
  entertainment: Film,
  work: Briefcase,
  health: Heart,
  tag: Tag,
  default: Plus
};

const ExtractScreen = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);
  const recurringTransactions = useAppSelector(selectRecurringTransactions);
  const categories = useAppSelector(selectCategories);
  const { activeWorkspaceId } = useWorkspaces();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editRawAmount, setEditRawAmount] = useState(0);
  const [editOccurredAt, setEditOccurredAt] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editConvertToRecurring, setEditConvertToRecurring] = useState(false);
  const [editRecurrenceFrequency, setEditRecurrenceFrequency] = useState<RecurrenceType>('monthly');
  const [editRecurrenceDayOfMonth, setEditRecurrenceDayOfMonth] = useState(1);

  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [editRecurringAmount, setEditRecurringAmount] = useState('');
  const [editRecurringRawAmount, setEditRecurringRawAmount] = useState(0);
  const [editRecurringName, setEditRecurringName] = useState('');
  const [editRecurringCategoryId, setEditRecurringCategoryId] = useState('');
  const [editRecurringStartDate, setEditRecurringStartDate] = useState('');

  const monthRef = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, [currentDate]);

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const filteredTransactions = useMemo(() => {
    // Filter actual transactions for this month
    const actual = transactions.filter(tx => tx.occurredAt.startsWith(monthRef));
    
    // Project recurring transactions for this month
    const projected = projectRecurringTransactions(recurringTransactions, monthRef);
    
    // Combine
    let combined = [...actual, ...projected];

    // Apply text search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      combined = combined.filter(tx => {
        const category = categories.find(c => c.id === tx.categoryId);
        const categoryName = category?.name.toLowerCase() || '';
        const note = tx.note?.toLowerCase() || '';
        return categoryName.includes(term) || note.includes(term);
      });
    }
    
    // Sort ascending by date
    return combined.sort((a, b) => 
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );
  }, [transactions, recurringTransactions, monthRef, searchTerm, categories]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof filteredTransactions> = {};
    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.occurredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleRefresh = () => {
    if (activeWorkspaceId) {
      dispatch(bootstrapTransactions(activeWorkspaceId));
      dispatch(bootstrapCategories(activeWorkspaceId));
      dispatch(bootstrapRecurringTransactions(activeWorkspaceId));
    }
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setEditRawAmount(tx.amount);
    setEditAmount(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount));
    setEditOccurredAt(tx.occurredAt.slice(0, 16));
    setEditCategoryId(tx.categoryId);
    setEditNote(tx.note || '');
    setEditConvertToRecurring(false);
    setEditRecurrenceFrequency('monthly');
    setEditRecurrenceDayOfMonth(new Date(tx.occurredAt).getDate());
  };

  const handleEditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value, 10) / 100;
    if (isNaN(numericValue)) {
      setEditRawAmount(0);
      setEditAmount('R$ 0,00');
    } else {
      setEditRawAmount(numericValue);
      setEditAmount(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction || !activeWorkspaceId || editRawAmount <= 0) return;
    if (editConvertToRecurring) {
      await dispatch(createRecurringTransaction({
        userId: '',
        workspaceId: activeWorkspaceId,
        name: editNote || 'Transação Recorrente',
        type: editingTransaction.type as TransactionType,
        amount: editRawAmount,
        categoryId: editCategoryId,
        frequency: editRecurrenceFrequency,
        dayOfMonth: editRecurrenceFrequency === 'monthly' ? editRecurrenceDayOfMonth : undefined,
        dayOfWeek: editRecurrenceFrequency === 'weekly' ? new Date(editOccurredAt).getDay() : undefined,
        startDate: new Date(editOccurredAt).toISOString().slice(0, 10),
        endDate: undefined,
        isActive: true,
      })).unwrap();
      await dispatch(deleteTransaction(editingTransaction.id)).unwrap();
    } else {
      await dispatch(updateTransaction({
        id: editingTransaction.id,
        updates: {
          amount: editRawAmount,
          occurredAt: new Date(editOccurredAt).toISOString(),
          categoryId: editCategoryId,
          note: editNote || undefined,
        }
      })).unwrap();
    }
    setEditingTransaction(null);
  };

  const openEditRecurringModal = (tx: Transaction) => {
    const recurring = recurringTransactions.find((rt: RecurringTransaction) => tx.id.startsWith(`projected-${rt.id}`));
    if (!recurring) return;
    setEditingRecurring(recurring);
    setEditRecurringRawAmount(recurring.amount);
    setEditRecurringAmount(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurring.amount));
    setEditRecurringName(recurring.name);
    setEditRecurringCategoryId(recurring.categoryId);
    setEditRecurringStartDate(recurring.startDate.slice(0, 10));
  };

  const handleEditRecurringAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value, 10) / 100;
    if (isNaN(numericValue)) {
      setEditRecurringRawAmount(0);
      setEditRecurringAmount('R$ 0,00');
    } else {
      setEditRecurringRawAmount(numericValue);
      setEditRecurringAmount(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue));
    }
  };

  const handleSaveEditRecurring = async () => {
    if (!editingRecurring || editRecurringRawAmount <= 0) return;
    await dispatch(updateRecurringTransaction({
      id: editingRecurring.id,
      updates: {
        amount: editRecurringRawAmount,
        name: editRecurringName,
        categoryId: editRecurringCategoryId,
        startDate: new Date(editRecurringStartDate).toISOString(),
      }
    })).unwrap();
    setEditingRecurring(null);
  };

  const confirmDelete = async () => {
    if (deleteId && activeWorkspaceId) {
      if (deleteId.startsWith('projected-')) {
        const recurring = recurringTransactions.find((rt: { id: string }) => deleteId.startsWith(`projected-${rt.id}`));
        if (recurring) {
          await dispatch(deleteRecurringTransaction(recurring.id)).unwrap();
        }
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        return;
      }

      await dispatch(deleteTransaction(deleteId)).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
            <h1 className="h1 fw-bold m-0">Extrato</h1>
        </div>
        <PrivacyToggle />
      </div>

      {/* Busca */}
      <div className="position-relative mb-4">
        <div className="position-absolute start-0 top-50 translate-middle-y ps-3 text-ios-gray">
          <Search size={18} />
        </div>
        <Form.Control
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 ps-5 pe-5 bg-ios-secondary border-0 text-white rounded-3"
          style={{ height: '48px' }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="position-absolute end-0 top-50 translate-middle-y pe-3 border-0 bg-transparent text-ios-gray hover-white transition-all"
            aria-label="Limpar busca"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navegação Mensal */}
      <Card className="bg-ios-secondary border-0 mb-4 shadow-none">
        <Card.Body className="p-3 d-flex align-items-center justify-content-between">
          <Button 
            variant="link" 
            className="text-white p-0 shadow-none" 
            onClick={handlePrevMonth}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={24} />
          </Button>
          
          <div className="d-flex align-items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span className="fw-bold text-capitalize">{monthLabel}</span>
          </div>

          <Button 
            variant="link" 
            className="text-white p-0 shadow-none" 
            onClick={handleNextMonth}
            aria-label="Próximo mês"
          >
            <ChevronRight size={24} />
          </Button>
        </Card.Body>
      </Card>

      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date} className="mb-4">
              <h5 className="small fw-bold text-ios-gray px-2 mb-2">{date}</h5>
              <Card className="bg-ios-dark-gray border-0 overflow-hidden shadow-none">
                <ListGroup variant="flush" className="bg-transparent">
                  {txs.map((tx) => {
                    const category = categories.find(c => c.id === tx.categoryId);
                    const isProjected = tx.id.startsWith('projected-');
                    const IconComponent = categoryIcons[category?.iconToken || 'default'] || categoryIcons.default;
                    
                    return (
                      <ListGroup.Item
                        key={tx.id}
                        className={`bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between ${isProjected ? 'opacity-75' : ''}`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-3 d-flex align-items-center justify-content-center" 
                            style={{ 
                              width: '44px', 
                              height: '44px', 
                              backgroundColor: tx.type === 'income' ? 'rgba(48, 209, 88, 0.1)' : `${category?.colorToken || '#8E8E93'}20`
                            }}
                          >
                            {tx.type === 'income' ? 
                              <ArrowUpCircle className="text-ios-green" size={24} /> : 
                              <IconComponent size={20} style={{ color: category?.colorToken || 'var(--ios-gray)' }} />
                            }
                          </div>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold text-white">{category?.name || 'Sem Categoria'}</span>
                              {isProjected && (
                                <Badge bg="primary" className="bg-primary bg-opacity-10 text-primary small border-0 d-flex align-items-center p-1">
                                  <RefreshCw size={10} />
                                </Badge>
                              )}
                            </div>
                            {tx.note && <span className="small text-ios-gray">{tx.note}</span>}
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3">
                          <span className={`fw-bold ${tx.type === 'expense' ? 'text-ios-red' : 'text-ios-green'}`}>
                            {tx.type === 'expense' ? '-' : '+'} <MoneyValue value={tx.amount} />
                          </span>
                          <Button 
                            variant="link" 
                            className="p-1 text-ios-gray opacity-50 shadow-none" 
                            onClick={() => isProjected ? openEditRecurringModal(tx) : openEditModal(tx)}
                            aria-label="Editar lançamento"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-1 text-ios-red opacity-50 shadow-none" 
                            onClick={() => { setDeleteId(tx.id); setIsDeleteModalOpen(true); }}
                            aria-label="Excluir lançamento"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
                {(() => {
                  const dayIncome = txs.filter(tx => tx.type === 'income').reduce((s, t) => s + t.amount, 0);
                  const dayExpense = txs.filter(tx => tx.type === 'expense').reduce((s, t) => s + t.amount, 0);
                  const net = dayIncome - dayExpense;
                  return (
                    <div className="px-3 py-2 d-flex justify-content-end border-top border-light border-opacity-10">
                      <span className={`small fw-bold ${net >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                        Saldo do dia: {net >= 0 ? '+' : '-'} <MoneyValue value={Math.abs(net)} />
                      </span>
                    </div>
                  );
                })()}
              </Card>
            </div>
          ))
        ) : (
          <div className="py-5 text-center text-ios-gray">
            <Calendar size={48} className="mb-3 opacity-25" />
            <p>Nenhuma transação encontrada para este mês</p>
            <Button variant="link" className="text-primary fw-bold text-decoration-none" onClick={handleRefresh}>
              <RefreshCw size={18} className="me-2" />
              Recarregar
            </Button>
          </div>
        )}
      </div>
      
      <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Excluir?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center text-ios-gray small py-3">Esta ação não pode ser desfeita.</Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10 py-3" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
          <Button variant="danger" className="flex-grow-1 py-3 rounded-3 fw-bold" onClick={confirmDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!editingTransaction} onHide={() => setEditingTransaction(null)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Editar Lançamento</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Valor</Form.Label>
              <Form.Control
                type="text"
                inputMode="decimal"
                value={editAmount}
                onChange={handleEditAmountChange}
                className="text-center py-3 border-0 bg-ios-secondary fs-3 fw-bold text-white shadow-none"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Data</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editOccurredAt}
                onChange={(e) => setEditOccurredAt(e.target.value)}
                className="py-3 fw-bold border-0 bg-ios-secondary text-white"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Categoria</Form.Label>
              <Form.Select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="py-3 fw-bold border-0 bg-ios-secondary text-white"
              >
                <option value="">Sem categoria</option>
                {categories
                  .filter(c => c.type === editingTransaction?.type)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Observação</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="py-3 border-0 bg-ios-secondary text-white shadow-none"
              />
            </Form.Group>

            <div className="mb-3">
              <Button
                variant="link"
                className="p-0 text-ios-gray text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setEditConvertToRecurring(!editConvertToRecurring)}
              >
                <div className={`p-1 rounded-circle border ${editConvertToRecurring ? 'bg-primary border-primary' : 'border-ios-gray'}`}>
                  {editConvertToRecurring && <Plus size={12} className="text-white" />}
                </div>
                <span>Transformar em recorrente</span>
              </Button>
            </div>

            {editConvertToRecurring && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-ios-gray text-uppercase">Frequência</Form.Label>
                  <Form.Select
                    value={editRecurrenceFrequency}
                    onChange={(e) => setEditRecurrenceFrequency(e.target.value as RecurrenceType)}
                    className="py-3 fw-bold border-0 bg-ios-secondary text-white"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="weekly">Semanal</option>
                    <option value="yearly">Anual</option>
                  </Form.Select>
                </Form.Group>

                {editRecurrenceFrequency === 'monthly' && (
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-ios-gray text-uppercase">Dia do Mês</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={31}
                      value={editRecurrenceDayOfMonth}
                      onChange={(e) => setEditRecurrenceDayOfMonth(parseInt(e.target.value) || 1)}
                      className="py-3 fw-bold border-0 bg-ios-secondary text-white"
                    />
                  </Form.Group>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10 py-3" onClick={() => setEditingTransaction(null)}>Cancelar</Button>
          <Button variant="primary" className="flex-grow-1 py-3 rounded-3 fw-bold" onClick={handleSaveEdit}>Salvar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!editingRecurring} onHide={() => setEditingRecurring(null)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Editar Recorrente</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Valor</Form.Label>
              <Form.Control
                type="text"
                inputMode="decimal"
                value={editRecurringAmount}
                onChange={handleEditRecurringAmountChange}
                className="text-center py-3 border-0 bg-ios-secondary fs-3 fw-bold text-white shadow-none"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Nome</Form.Label>
              <Form.Control
                type="text"
                value={editRecurringName}
                onChange={(e) => setEditRecurringName(e.target.value)}
                className="py-3 fw-bold border-0 bg-ios-secondary text-white"
                placeholder="Ex: Aluguel"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Categoria</Form.Label>
              <Form.Select
                value={editRecurringCategoryId}
                onChange={(e) => setEditRecurringCategoryId(e.target.value)}
                className="py-3 fw-bold border-0 bg-ios-secondary text-white"
              >
                <option value="">Sem categoria</option>
                {categories
                  .filter(c => c.type === editingRecurring?.type)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Data de Início</Form.Label>
              <Form.Control
                type="date"
                value={editRecurringStartDate}
                onChange={(e) => setEditRecurringStartDate(e.target.value)}
                className="py-3 fw-bold border-0 bg-ios-secondary text-white"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10 py-3" onClick={() => setEditingRecurring(null)}>Cancelar</Button>
          <Button variant="primary" className="flex-grow-1 py-3 rounded-3 fw-bold" onClick={handleSaveEditRecurring}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExtractScreen;
