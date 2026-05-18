import React, { useMemo, useState } from 'react';
import { 
  Card, Button, Select, ListBox, Label
} from '@heroui/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { calculateMonthlySummary } from '@/shared/models/finance';
import { ChevronDown } from 'lucide-react';

const ReportsScreen = () => {
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    months.add(new Date().toISOString().slice(0, 7));
    transactions.forEach(tx => {
      months.add(tx.occurredAt.slice(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const summary = useMemo(() => {
    return calculateMonthlySummary(selectedMonth, transactions);
  }, [selectedMonth, transactions]);

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

  const barData = [
    { name: 'Entradas', valor: summary.incomeTotal, color: '#30D158' },
    { name: 'Saídas', valor: summary.expenseTotal, color: '#FF453A' }
  ];

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-bold pt-4">Relatórios</h1>

      <div className="w-full">
        <Select selectedKey={selectedMonth} onSelectionChange={(key) => setSelectedMonth(key as string)}>
          <Label className="text-xs text-ios-gray mb-1 block">Mês de Referência</Label>
          <Select.Trigger className="w-full bg-ios-darkGray border-none shadow-sm h-14 rounded-xl px-4 flex items-center justify-between outline-none">
            <Select.Value className="text-foreground font-semibold">
              {(value) => value ? new Date(String(value) + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Selecione o mês'}
            </Select.Value>
            <Select.Indicator>
              <ChevronDown size={18} className="text-ios-gray" />
            </Select.Indicator>
          </Select.Trigger>
          <Select.Popover className="bg-ios-darkGray border border-white/10 rounded-xl shadow-2xl min-w-[var(--trigger-width)]">
            <ListBox className="p-1 outline-none">
              {availableMonths.map((month) => (
                <ListBox.Item key={month} id={month} textValue={month} className="px-3 py-3 rounded-lg data-[hover=true]:bg-white/10 outline-none cursor-pointer text-sm">
                  {new Date(month + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

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

      <div className="space-y-4 pt-2">
        <h3 className="text-xl font-bold px-1">Distribuição</h3>
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
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-xl font-bold px-1">Comparativo</h3>
        <Card className="bg-ios-darkGray border-none p-4 shadow-none rounded-3xl">
          <Card.Content className="p-0 overflow-visible">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} 
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default ReportsScreen;
