import React, { useMemo, useState } from 'react';
import { 
  Card, CardBody, Button, Listbox, ListboxItem, 
  Pagination, Modal, ModalContent, ModalHeader, ModalBody, 
  ModalFooter
} from '@heroui/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { deleteTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';

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
        <Button isIconOnly variant="flat" onPress={handleRefresh}>
          <RefreshCw size={20} />
        </Button>
      </div>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <CardBody className="p-0">
          <Listbox 
            aria-label="Extrato"
            className="p-0"
            itemClasses={{
              base: "px-4 py-3 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5",
              title: "text-base font-semibold",
              description: "text-xs text-ios-gray"
            }}
          >
            {paginatedTransactions.map((tx) => {
              const category = categories.find(c => c.id === tx.categoryId);
              return (
                <ListboxItem
                  key={tx.id}
                  textValue={category?.name}
                  description={new Date(tx.occurredAt).toLocaleDateString()}
                  startContent={
                    tx.type === 'income' ? 
                    <ArrowUpCircle className="text-ios-green" size={24} /> : 
                    <ArrowDownCircle className="text-ios-red" size={24} />
                  }
                  endContent={
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${tx.type === 'expense' ? 'text-ios-red' : 'text-ios-green'}`}>
                        {tx.type === 'expense' ? '-' : '+'} R$ {tx.amount.toFixed(2)}
                      </span>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => {
                          setDeleteId(tx.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} className="text-ios-red opacity-60" />
                      </Button>
                    </div>
                  }
                >
                  {category?.name || 'Sem Categoria'}
                </ListboxItem>
              );
            })}
          </Listbox>
          {paginatedTransactions.length === 0 && (
            <div className="py-12 text-center text-ios-gray">
              Nenhuma transação encontrada
            </div>
          )}
        </CardBody>
      </Card>
      
      <div className="flex justify-center pt-4">
        <Pagination 
          total={Math.ceil(transactions.length / ITEMS_PER_PAGE)} 
          page={page} 
          onChange={setPage}
          color="primary"
          variant="flat"
        />
      </div>

      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="xs" backdrop="blur" className="dark text-foreground">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Excluir?</ModalHeader>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="danger" onPress={confirmDelete}>Excluir</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExtractScreen;
