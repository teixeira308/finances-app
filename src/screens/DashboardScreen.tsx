import React, { useMemo, useState } from 'react';
import { 
  Card, CardBody, Button, Progress, 
  Modal, ModalContent, ModalHeader, ModalBody, 
  ModalFooter, Input, Select, SelectItem, Textarea,
  Chip, Tabs, Tab
} from '@nextui-org/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { calculateMonthlySummary } from '@/shared/models/finance';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { Plus, RefreshCw } from 'lucide-react';

const DashboardScreen = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  const goals = useAppSelector((state) => state.goals.items);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const monthRef = new Date().toISOString().slice(0, 7);
  const summary = useMemo(
    () => calculateMonthlySummary(monthRef, transactions, goals.find((goal) => goal.monthRef === monthRef)),
    [goals, monthRef, transactions]
  );

  const pieData = useMemo(() => {
    return summary.topCategories.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        name: category?.name || 'Outros',
        value: item.total,
        color: category?.colorToken || '#8E8E93'
      };
    });
  }, [summary, categories]);

  const handleOpenDialog = () => {
    setTxError(null);
    setAmount('');
    setNote('');
    setCategoryId(categories[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async () => {
    try {
      await dispatch(createTransaction({
        type: txType as 'income' | 'expense',
        amount: Number(amount),
        categoryId,
        occurredAt: new Date(occurredAt).toISOString(),
        note
      })).unwrap();
      setIsModalOpen(false);
      dispatch(bootstrapTransactions());
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const handleRefresh = () => {
    dispatch(bootstrapTransactions());
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center pt-4">
        <h1 className="text-3xl font-bold">Início</h1>
        <Button isIconOnly variant="flat" onPress={handleRefresh}>
          <RefreshCw size={20} />
        </Button>
      </div>
      
      <Card className={`border-2 ${summary.netBalance >= 0 ? 'border-ios-green' : 'border-ios-red'} bg-transparent shadow-none`}>
        <CardBody className="py-8 px-6">
          <p className="text-xs uppercase tracking-widest text-ios-gray mb-1">Saldo Atual</p>
          <h2 className={`text-4xl font-bold ${summary.netBalance >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
            R$ {summary.netBalance.toFixed(2)}
          </h2>
        </CardBody>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-ios-green/10 border-none shadow-none">
          <CardBody className="p-4 text-center">
            <p className="text-xs text-ios-green uppercase tracking-wider mb-1">Entradas</p>
            <p className="text-xl font-bold text-ios-green">R$ {summary.incomeTotal.toFixed(2)}</p>
          </CardBody>
        </Card>
        <Card className="bg-ios-red/10 border-none shadow-none">
          <CardBody className="p-4 text-center">
            <p className="text-xs text-ios-red uppercase tracking-wider mb-1">Saídas</p>
            <p className="text-xl font-bold text-ios-red">R$ {summary.expenseTotal.toFixed(2)}</p>
          </CardBody>
        </Card>
      </div>

      <h3 className="text-xl font-bold px-1 pt-2">Distribuição</h3>
      <Card className="bg-ios-darkGray border-none p-4 shadow-none">
        <CardBody className="p-0 overflow-visible">
          <div className="w-full h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} 
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-ios-gray">
                Sem despesas neste mês
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <Button 
          fullWidth 
          color="primary" 
          size="lg"
          startContent={<Plus size={20} />}
          onPress={handleOpenDialog}
          className="font-bold shadow-lg shadow-primary/20 rounded-2xl"
        >
          Nova Transação
        </Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        placement="center"
        backdrop="blur"
        className="dark text-foreground"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Nova Transação</ModalHeader>
              <ModalBody>
                <Tabs 
                  fullWidth 
                  selectedKey={txType} 
                  onSelectionChange={(key) => setTxType(key as string)}
                  color="primary"
                >
                  <Tab key="expense" title="Despesa" />
                  <Tab key="income" title="Receita" />
                </Tabs>
                <Input label="Valor" type="number" placeholder="0,00" value={amount} onValueChange={setAmount} />
                <Select label="Categoria" selectedKeys={categoryId ? [categoryId] : []} onSelectionChange={(keys) => setCategoryId(Array.from(keys)[0] as string)}>
                  {categories.map((c) => <SelectItem key={c.id}>{c.name}</SelectItem>)}
                </Select>
                <Input label="Data" type="datetime-local" value={occurredAt} onValueChange={setOccurredAt} />
                {txError && <Chip color="danger" variant="flat" className="w-full">{txError}</Chip>}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleSaveTransaction}>Salvar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DashboardScreen;
