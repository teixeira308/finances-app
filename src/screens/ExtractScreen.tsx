import React, { useMemo, useState } from 'react';
import { 
  Card, Button, ListBox, 
  Modal
} from '@heroui/react';
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
      await dispatch(deleteTransaction(deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center pt-4">
        <h1 className="text-3xl font-bold">Extrato</h1>
        <Button isIconOnly variant="primary" onPress={handleRefresh} className="rounded-xl">
          <RefreshCw size={20} />
        </Button>
      </div>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <Card.Content className="p-0">
          <ListBox 
            aria-label="Extrato"
            className="p-0"
          >
            {paginatedTransactions.map((tx) => {
              const category = categories.find(c => c.id === tx.categoryId);
              return (
                <ListBox.Item
                  key={tx.id}
                  id={tx.id}
                  textValue={category?.name}
                  className="px-4 py-3 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5 flex items-center justify-between outline-none cursor-default"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === 'income' ? 
                      <ArrowUpCircle className="text-ios-green" size={24} /> : 
                      <ArrowDownCircle className="text-ios-red" size={24} />
                    }
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">{category?.name || 'Sem Categoria'}</span>
                      <span className="text-xs text-ios-gray">{new Date(tx.occurredAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${tx.type === 'expense' ? 'text-ios-red' : 'text-ios-green'}`}>
                      {tx.type === 'expense' ? '-' : '+'} R$ {tx.amount.toFixed(2)}
                    </span>
                    <Button 
                      isIconOnly 
                      variant="ghost" 
                      className="border-none hover:bg-ios-red/10"
                      onPress={() => {
                        setDeleteId(tx.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} className="text-ios-red opacity-60" />
                    </Button>
                  </div>
                </ListBox.Item>
              );
            })}
          </ListBox>
          {paginatedTransactions.length === 0 && (
            <div className="py-12 text-center text-ios-gray">
              Nenhuma transação encontrada
            </div>
          )}
        </Card.Content>
      </Card>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Button 
            isIconOnly 
            variant="ghost" 
            isDisabled={page === 1} 
            onPress={() => setPage(p => p - 1)}
            className="border-white/10"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-medium">Página {page} de {totalPages}</span>
          <Button 
            isIconOnly 
            variant="ghost" 
            isDisabled={page === totalPages} 
            onPress={() => setPage(p => p + 1)}
            className="border-white/10"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}

      <Modal.Root isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm" />
        <Modal.Container placement="center" className="p-4 w-full max-w-xs">
          <Modal.Dialog className="bg-ios-darkGray rounded-3xl p-6 outline-none shadow-2xl">
            <Modal.Header className="text-xl font-bold mb-4 text-center">Excluir?</Modal.Header>
            <Modal.Footer className="flex gap-3 mt-4">
              <Button variant="ghost" onPress={() => setIsDeleteModalOpen(false)} className="flex-1 border-white/10">Cancelar</Button>
              <Button variant="danger" onPress={confirmDelete} className="flex-1">Excluir</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Root>
    </div>
  );
};

export default ExtractScreen;
