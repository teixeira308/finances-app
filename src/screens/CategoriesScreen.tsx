import React, { useState } from 'react';
import { 
  Card, Button, ListBox, 
  Modal, TextField, Label, Input, Chip
} from '@heroui/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCategories, createCategory, deleteCategory, bootstrapCategories } from '@/features/categories/store/categoriesSlice';
import { Plus, Tag, Trash2, RefreshCw } from 'lucide-react';
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
        <Button isIconOnly variant="primary" onPress={handleRefresh} className="rounded-xl">
          <RefreshCw size={20} />
        </Button>
      </div>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <Card.Content className="p-0">
          <ListBox 
            aria-label="Lista de Categorias"
            className="p-0"
          >
            {categories.map((category) => (
              <ListBox.Item
                key={category.id}
                id={category.id}
                textValue={category.name}
                className="px-4 py-4 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5 flex items-center justify-between outline-none cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${category.colorToken}20` }}
                  >
                    <Tag size={20} style={{ color: category.colorToken }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-foreground">{category.name}</span>
                    <span className="text-xs text-ios-gray">{category.kind === 'default' ? 'Sistema' : 'Personalizada'}</span>
                  </div>
                </div>
                
                {category.kind !== 'default' && (
                  <Button 
                    isIconOnly 
                    variant="ghost" 
                    className="border-none hover:bg-ios-red/10"
                    onPress={() => {
                      setDeleteId(category.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={16} className="text-ios-red opacity-60" />
                  </Button>
                )}
              </ListBox.Item>
            ))}
          </ListBox>
        </Card.Content>
      </Card>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <Button 
          fullWidth 
          variant="primary" 
          onPress={handleOpen}
          className="h-14 font-bold shadow-lg shadow-primary/20 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          Nova Categoria
        </Button>
      </div>

      <Modal.Root isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm" />
        <Modal.Container placement="center" className="p-4 w-full max-w-sm">
          <Modal.Dialog className="bg-ios-darkGray rounded-3xl p-6 outline-none shadow-2xl">
            <Modal.Header className="text-xl font-bold mb-4">Nova Categoria</Modal.Header>
            <Modal.Body className="space-y-4">
              <TextField value={name} onChange={setName} className="w-full">
                <Label className="text-xs text-ios-gray mb-1 block">Nome</Label>
                <Input 
                  placeholder="Ex: Aluguel" 
                  className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </TextField>
              
              <div className="space-y-1">
                <Label className="text-xs text-ios-gray block">Cor</Label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-full h-12 rounded-xl bg-transparent border-none cursor-pointer p-0" 
                />
              </div>
              
              {error && <Chip variant="soft" className="w-full bg-ios-red/20 text-ios-red border-none">{error}</Chip>}
            </Modal.Body>
            <Modal.Footer className="flex gap-3 mt-6">
              <Button variant="ghost" onPress={handleClose} className="flex-1 border-white/10">Cancelar</Button>
              <Button variant="primary" onPress={handleSubmit} className="flex-1">Criar</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Root>

      <Modal.Root isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm" />
        <Modal.Container placement="center" className="p-4 w-full max-w-xs">
          <Modal.Dialog className="bg-ios-darkGray rounded-3xl p-6 outline-none shadow-2xl">
            <Modal.Header className="text-xl font-bold mb-4 text-center">Excluir?</Modal.Header>
            <Modal.Footer className="flex gap-3 mt-4">
              <Button variant="ghost" onPress={() => setIsDeleteModalOpen(false)} className="flex-1 border-white/10">Cancelar</Button>
              <Button variant="danger" onPress={handleDelete} className="flex-1">Excluir</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Root>
    </div>
  );
};

export default CategoriesScreen;
