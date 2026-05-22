import React, { useMemo, useState } from 'react';
import { Container, Card, Button, ListGroup, Modal, Badge } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { deleteTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { 
  Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw,
  ShoppingBag, Coffee, Car, Home, Film, Briefcase, Plus, Heart
} from 'lucide-react';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { PrivacyToggle } from '@/shared/components/PrivacyToggle';

// Mapeamento de ícones
const categoryIcons: Record<string, React.ReactNode> = {
  shopping: <ShoppingBag size={20} />,
  food: <Coffee size={20} />,
  transport: <Car size={20} />,
  housing: <Home size={20} />,
  entertainment: <Film size={20} />,
  work: <Briefcase size={20} />,
  health: <Heart size={20} />,
  default: <Plus size={20} />
};

const ExtractScreen = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    [...transactions]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .forEach((tx) => {
        const date = new Date(tx.occurredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        if (!groups[date]) groups[date] = [];
        groups[date].push(tx);
      });
    return groups;
  }, [transactions]);

  const handleRefresh = () => {
    dispatch(bootstrapTransactions());
    dispatch(bootstrapCategories());
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteTransaction(deleteId)).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      dispatch(bootstrapTransactions());
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

      {Object.keys(groupedTransactions).length > 0 ? (
        Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date} className="mb-4">
            <h5 className="small fw-bold text-ios-gray px-2 mb-2">{date}</h5>
            <Card className="bg-ios-dark-gray border-0 overflow-hidden shadow-none">
              <ListGroup variant="flush" className="bg-transparent">
                {txs.map((tx) => {
                  const category = categories.find(c => c.id === tx.categoryId);
                  return (
                    <ListGroup.Item
                      key={tx.id}
                      className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          {tx.type === 'income' ? 
                            <ArrowUpCircle className="text-ios-green" size={24} /> : 
                            categoryIcons[category?.iconToken || 'default']
                          }
                        </div>
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-white">{category?.name || 'Sem Categoria'}</span>
                            <Badge bg="secondary" className="bg-white bg-opacity-10 text-ios-gray small text-uppercase">
                              {tx.type === 'income' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </div>
                          {tx.note && <span className="small text-ios-gray">{tx.note}</span>}
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center gap-3">
                        <span className={`fw-bold ${tx.type === 'expense' ? 'text-ios-red' : 'text-ios-green'}`}>
                          {tx.type === 'expense' ? '-' : '+'} <MoneyValue value={tx.amount} />
                        </span>
                        <Button variant="link" className="p-1 text-ios-red opacity-50 shadow-none" onClick={() => { setDeleteId(tx.id); setIsDeleteModalOpen(true); }}>
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
          Nenhuma transação encontrada
        </div>
      )}
      
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
