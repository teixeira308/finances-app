import React, { useMemo, useState } from 'react';
import { 
  Card, Button, 
  Modal, TextField, Label, Input, Select, ListBox,
  Chip, Tabs
} from '@heroui/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { calculateMonthlySummary } from '@/shared/models/finance';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { createTransaction, bootstrapTransactions } from '@/features/transactions/store/transactionsSlice';
import { Plus, RefreshCw, ChevronDown } from 'lucide-react';

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
        <Button isIconOnly variant="primary" onPress={handleRefresh} className="rounded-xl">
          <RefreshCw size={20} />
        </Button>
      </div>
      
      <Card className={`border-2 ${summary.netBalance >= 0 ? 'border-ios-green' : 'border-ios-red'} bg-transparent shadow-none rounded-3xl`}>
        <Card.Content className="py-8 px-6">
          <p className="text-xs uppercase tracking-widest text-ios-gray mb-1">Saldo Atual</p>
          <h2 className={`text-4xl font-bold ${summary.netBalance >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
            R$ {summary.netBalance.toFixed(2)}
          </h2>
        </Card.Content>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-ios-green/10 border-none shadow-none rounded-2xl">
          <Card.Content className="p-4 text-center">
            <p className="text-xs text-ios-green uppercase tracking-wider mb-1">Entradas</p>
            <p className="text-xl font-bold text-ios-green">R$ {summary.incomeTotal.toFixed(2)}</p>
          </Card.Content>
        </Card>
        <Card className="bg-ios-red/10 border-none shadow-none rounded-2xl">
          <Card.Content className="p-4 text-center">
            <p className="text-xs text-ios-red uppercase tracking-wider mb-1">Saídas</p>
            <p className="text-xl font-bold text-ios-red">R$ {summary.expenseTotal.toFixed(2)}</p>
          </Card.Content>
        </Card>
      </div>

      <h3 className="text-xl font-bold px-1 pt-2">Distribuição</h3>
      <Card className="bg-ios-darkGray border-none p-4 shadow-none rounded-3xl">
        <Card.Content className="p-0 overflow-visible">
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
        </Card.Content>
      </Card>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <Button 
          fullWidth 
          variant="primary" 
          onPress={handleOpenDialog}
          className="h-14 font-bold shadow-lg shadow-primary/20 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          Nova Transação
        </Button>
      </div>

      <Modal.Root isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm" />
        <Modal.Container placement="center" className="p-4 w-full max-w-sm">
          <Modal.Dialog className="bg-ios-darkGray rounded-3xl p-6 outline-none shadow-2xl">
            <Modal.Header className="text-xl font-bold mb-4">Nova Transação</Modal.Header>
            <Modal.Body className="space-y-4">
              <Tabs.Root selectedKey={txType} onSelectionChange={(key) => setTxType(key as string)} className="w-full">
                <Tabs.List className="flex bg-white/5 p-1 rounded-xl mb-4">
                  <Tabs.Tab id="expense" className="flex-1 py-2 text-center rounded-lg data-[selected=true]:bg-ios-red data-[selected=true]:text-white transition-all text-sm font-semibold outline-none cursor-pointer">
                    Despesa
                  </Tabs.Tab>
                  <Tabs.Tab id="income" className="flex-1 py-2 text-center rounded-lg data-[selected=true]:bg-ios-green data-[selected=true]:text-white transition-all text-sm font-semibold outline-none cursor-pointer">
                    Receita
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.Root>

              <TextField value={amount} onChange={setAmount} className="w-full">
                <Label className="text-xs text-ios-gray mb-1 block">Valor</Label>
                <Input 
                  type="number" 
                  placeholder="0,00" 
                  className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-lg"
                />
              </TextField>

              <Select selectedKey={categoryId} onSelectionChange={(key) => setCategoryId(key as string)}>
                <Label className="text-xs text-ios-gray mb-1 block">Categoria</Label>
                <Select.Trigger className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none flex items-center justify-between">
                  <Select.Value className="text-foreground" />
                  <Select.Indicator>
                    <ChevronDown size={18} className="text-ios-gray" />
                  </Select.Indicator>
                </Select.Trigger>
                <Select.Popover className="bg-ios-darkGray border border-white/10 rounded-xl shadow-2xl min-w-[var(--trigger-width)]">
                  <ListBox className="p-1 outline-none">
                    {categories.map((c) => (
                      <ListBox.Item key={c.id} id={c.id} textValue={c.name} className="px-3 py-2 rounded-lg data-[hover=true]:bg-white/10 outline-none cursor-pointer text-sm">
                        {c.name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField value={occurredAt} onChange={setOccurredAt} className="w-full">
                <Label className="text-xs text-ios-gray mb-1 block">Data</Label>
                <Input 
                  type="datetime-local" 
                  className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </TextField>

              {txError && <Chip variant="soft" className="w-full bg-ios-red/20 text-ios-red border-none">{txError}</Chip>}
            </Modal.Body>
            <Modal.Footer className="flex gap-3 mt-6">
              <Button variant="ghost" onPress={() => setIsModalOpen(false)} className="flex-1 border-white/10">Cancelar</Button>
              <Button variant="primary" onPress={handleSaveTransaction} className="flex-1">Salvar</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Root>
    </div>
  );
};

export default DashboardScreen;
