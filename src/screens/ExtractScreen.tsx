import React, { useMemo, useState } from 'react';
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { deleteTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const ExtractScreen = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return transactions.slice(start, start + ITEMS_PER_PAGE);
  }, [transactions, page]);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

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
        <Button 
          variant="primary" 
          onClick={handleRefresh} 
          className="rounded-3 d-flex align-items-center justify-content-center p-2"
        >
          <RefreshCw size={20} />
        </Button>
      </div>

      <Card className="bg-ios-dark-gray border-0 overflow-hidden mb-4 shadow-none">
        <ListGroup variant="flush" className="bg-transparent">
          {paginatedTransactions.map((tx) => {
            const category = categories.find(c => c.id === tx.categoryId);
            return (
              <ListGroup.Item
                key={tx.id}
                className="bg-transparent border-light border-opacity-10 px-3 py-3 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3">
                  {tx.type === 'income' ? 
                    <ArrowUpCircle className="text-ios-green" size={24} /> : 
                    <ArrowDownCircle className="text-ios-red" size={24} />
                  }
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-white">{category?.name || 'Sem Categoria'}</span>
                    <span className="small text-ios-gray">{new Date(tx.occurredAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                  <span className={`fw-bold ${tx.type === 'expense' ? 'text-ios-red' : 'text-ios-green'}`}>
                    {tx.type === 'expense' ? '-' : '+'} R$ {tx.amount.toFixed(2)}
                  </span>
                  <Button 
                    variant="link" 
                    className="p-1 text-ios-red opacity-50 shadow-none"
                    onClick={() => {
                      setDeleteId(tx.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
          {paginatedTransactions.length === 0 && (
            <div className="py-5 text-center text-ios-gray">
              Nenhuma transação encontrada
            </div>
          )}
        </ListGroup>
      </Card>
      
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 pt-2 mb-5">
          <Button 
            variant="outline-light" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="rounded-3 border-opacity-10 p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="small fw-bold">Página {page} de {totalPages}</span>
          <Button 
            variant="outline-light" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="rounded-3 border-opacity-10 p-2"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}

      <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold">Excluir?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center text-ios-gray small py-3">
          Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 d-flex gap-2">
          <Button variant="outline-light" className="flex-grow-1 border-opacity-10" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-grow-1 rounded-3 fw-bold" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExtractScreen;
