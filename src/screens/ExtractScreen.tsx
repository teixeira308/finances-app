import React, { useMemo, useState } from 'react';
import { Container, Card, Button, ListGroup, Modal, Badge, Form } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { deleteTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { selectRecurringTransactions, bootstrapRecurringTransactions } from '@/features/transactions/store/recurringTransactionsSlice';
import { 
  Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw,
  ShoppingBag, Coffee, Car, Home, Film, Briefcase, Plus, Heart,
  ChevronLeft, ChevronRight, Calendar, Search, X, Tag
} from 'lucide-react';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { PrivacyToggle } from '@/shared/components/PrivacyToggle';
import { projectRecurringTransactions } from '@/shared/utils/projection';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';

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
    
    // Sort
    return combined.sort((a, b) => 
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
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

  const confirmDelete = async () => {
    if (deleteId && activeWorkspaceId) {
      // Don't allow deleting projected transactions through this UI for now
      if (deleteId.startsWith('projected-')) {
        alert('Para remover uma transação recorrente, vá em Ajustes.');
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        return;
      }

      await dispatch(deleteTransaction(deleteId)).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      dispatch(bootstrapTransactions(activeWorkspaceId));
    }
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex justify-content-between align-items-center pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Extrato</h1>
        <div className="d-flex gap-2">
            <PrivacyToggle />
        </div>
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
                                <Badge bg="primary" className="bg-primary bg-opacity-10 text-primary small border-0">
                                  <RefreshCw size={10} className="me-1" />
                                  Recorrente
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
                            className="p-1 text-ios-red opacity-50 shadow-none" 
                            onClick={() => { setDeleteId(tx.id); setIsDeleteModalOpen(true); }}
                            disabled={isProjected}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
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
    </Container>
  );
};

export default ExtractScreen;
