import React, { useState } from 'react';
import { 
  Card, CardBody, Button, Listbox, ListboxItem, 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  Input, Chip
} from '@nextui-org/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, createCategory, deleteCategory, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { Plus, Tag, ChevronRight, Trash2, RefreshCw } from 'lucide-react';
import { bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';

const CategoriesScreen = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#0A84FF');
  const [error, setError] = useState<string | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setName('');
    setColor('#0A84FF');
    setError(null);
  };

  const handleRefresh = () => {
    dispatch(bootstrapCategories());
    dispatch(bootstrapTransactions());
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    try {
      await dispatch(createCategory({
        name: name.trim(),
        colorToken: color,
        iconToken: 'tag'
      })).unwrap();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteCategory(deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center pt-4">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button isIconOnly variant="flat" onPress={handleRefresh}>
          <RefreshCw size={20} />
        </Button>
      </div>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <CardBody className="p-0">
          <Listbox 
            aria-label="Lista de Categorias"
            className="p-0"
            itemClasses={{
              base: "px-4 py-4 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5",
              title: "text-base font-semibold",
              description: "text-xs text-ios-gray"
            }}
          >
            {categories.map((category) => (
              <ListboxItem
                key={category.id}
                textValue={category.name}
                description={category.kind === 'default' ? 'Sistema' : 'Personalizada'}
                startContent={
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${category.colorToken}20` }}
                  >
                    <Tag size={20} style={{ color: category.colorToken }} />
                  </div>
                }
                endContent={
                  category.kind !== 'default' && (
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      onPress={() => {
                        setDeleteId(category.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} className="text-ios-red opacity-60" />
                    </Button>
                  )
                }
              >
                {category.name}
              </ListboxItem>
            ))}
          </Listbox>
        </CardBody>
      </Card>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <Button 
          fullWidth 
          color="primary" 
          size="lg"
          startContent={<Plus size={20} />}
          onPress={handleOpen}
          className="font-bold shadow-lg shadow-primary/20 rounded-2xl"
        >
          Nova Categoria
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} placement="center" backdrop="blur" className="dark text-foreground">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Nova Categoria</ModalHeader>
              <ModalBody>
                <Input label="Nome" placeholder="Ex: Aluguel" value={name} onValueChange={setName} />
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10" />
                {error && <Chip color="danger" variant="flat" className="w-full">{error}</Chip>}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleSubmit}>Criar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="xs" backdrop="blur" className="dark text-foreground">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Excluir?</ModalHeader>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="danger" onPress={handleDelete}>Excluir</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesScreen;
