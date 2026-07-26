import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { selectRecurringTransactions } from '@/features/transactions/store/recurringTransactionsSlice';
import { projectRecurringTransactions } from '@/shared/utils/projection';
import { calculateSummary } from '@/shared/models/finance';
import { toLocalMonthRef } from '@/shared/utils/date';
import { ChevronDown, Calendar, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const ReportsScreen = () => {
  const transactions = useAppSelector((state) => state.transactions.items);
  const recurringTransactions = useAppSelector(selectRecurringTransactions);
  const categories = useAppSelector(selectCategories);

  const [periodType, setPeriodType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(toLocalMonthRef(new Date()));

  const periodOptions = [
    { label: 'Mês', value: 'month' },
    { label: '3M', value: 'last3' },
    { label: '6M', value: 'last6' },
    { label: '12M', value: 'last12' },
    { label: 'Ano', value: 'year' },
    { label: 'Tudo', value: 'all' },
  ];

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    const currentMonth = toLocalMonthRef(new Date());
    months.add(currentMonth);
    
    transactions.forEach(tx => {
      if (tx.occurredAt && tx.occurredAt.length >= 7) {
        months.add(tx.occurredAt.slice(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const activeMonths = useMemo(() => {
    const now = new Date();
    if (periodType === 'month') return [selectedMonth];
    
    const months: string[] = [];
    if (periodType === 'all') {
      const allMonths = new Set<string>();
      transactions.forEach(tx => {
        if (tx.occurredAt && tx.occurredAt.length >= 7) {
          allMonths.add(tx.occurredAt.slice(0, 7));
        }
      });
      allMonths.add(toLocalMonthRef(now));
      return Array.from(allMonths);
    }

    let count = 0;
    if (periodType === 'last3') count = 3;
    else if (periodType === 'last6') count = 6;
    else if (periodType === 'last12') count = 12;

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        months.push(`${year}-${month}`);
      }
      return months;
    }

    if (periodType === 'year') {
      const year = now.getFullYear();
      for (let m = 0; m <= now.getMonth(); m++) {
        months.push(`${year}-${(m + 1).toString().padStart(2, '0')}`);
      }
      return months;
    }
    
    return [selectedMonth];
  }, [periodType, selectedMonth, transactions]);

  const allTransactions = useMemo(() => {
    try {
      const actual = transactions.filter(tx => tx.occurredAt && activeMonths.some(m => tx.occurredAt.startsWith(m)));
      const projected = activeMonths.flatMap(m => {
        try {
          return projectRecurringTransactions(recurringTransactions, m);
        } catch (e) {
          console.error('Error projecting for month', m, e);
          return [];
        }
      });
      return [...actual, ...projected];
    } catch (e) {
      console.error('Error filtering transactions', e);
      return [];
    }
  }, [transactions, recurringTransactions, activeMonths]);

  const summary = useMemo(() => {
    const label = periodType === 'month' 
      ? new Date(selectedMonth + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      : periodOptions.find(o => o.value === periodType)?.label || '';
    return calculateSummary(label, allTransactions);
  }, [periodType, selectedMonth, allTransactions]);

  const pieData = useMemo(() => {
    return summary.topCategories.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        name: category?.name || 'Outros',
        value: item.total,
        color: category?.colorToken || '#8E8E93'
      };
    }).filter(item => item.value > 0);
  }, [summary, categories]);

  const barData = [
    { name: 'Entradas', valor: summary.incomeTotal, color: '#30D158' },
    { name: 'Saídas', valor: summary.expenseTotal, color: '#FF453A' }
  ];

  const monthlyEvolution = useMemo(() => {
    return activeMonths.map(month => {
      const monthTxs = allTransactions.filter(tx => tx.occurredAt?.startsWith(month));
      const income = monthTxs.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
      const expense = monthTxs.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
      return {
        month,
        label: new Date(month + '-02').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        income,
        expense,
        balance: income - expense,
      };
    }).reverse();
  }, [activeMonths, allTransactions]);

  const savingsRate = summary.incomeTotal > 0
    ? ((summary.incomeTotal - summary.expenseTotal) / summary.incomeTotal) * 100
    : 0;

  const dailyAverage = useMemo(() => {
    let totalDays = 0;
    activeMonths.forEach(m => {
      const [year, month] = m.split('-').map(Number);
      totalDays += new Date(year, month, 0).getDate();
    });
    return totalDays > 0 ? summary.expenseTotal / totalDays : 0;
  }, [activeMonths, summary.expenseTotal]);

  const topCategoryData = useMemo(() => {
    return summary.topCategories
      .map(item => {
        const category = categories.find(c => c.id === item.categoryId);
        return {
          name: category?.name || 'Outros',
          total: item.total,
          color: category?.colorToken || '#8E8E93',
        };
      })
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [summary, categories]);

  const maxCategoryValue = topCategoryData.length > 0 ? topCategoryData[0].total : 0;

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4 d-flex justify-content-between align-items-center">
        <h1 className="h1 fw-bold m-0">Relatórios</h1>
      </div>

      {/* Pill Selector */}
      <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {periodOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={periodType === opt.value ? 'primary' : 'ios-secondary'}
            className={`rounded-pill px-3 py-1 border-0 fw-bold small text-nowrap`}
            onClick={() => setPeriodType(opt.value)}
            style={{ 
              fontSize: '0.8rem',
              backgroundColor: periodType === opt.value ? 'var(--ios-blue)' : '#2C2C2E',
              color: periodType === opt.value ? 'white' : '#8E8E93'
            }}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {periodType === 'month' && (
        <Form.Group className="mb-4">
          <div className="position-relative">
            <Form.Select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-12 fw-bold bg-ios-secondary border-0 text-white rounded-3 ps-5"
              style={{ appearance: 'none' }}
            >
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </Form.Select>
            <Calendar size={16} className="position-absolute text-ios-gray" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <ChevronDown size={16} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </Form.Group>
      )}

      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="border-0 h-100 bg-ios-secondary shadow-sm rounded-4">
            <Card.Body className="p-3 text-center">
              <p className="text-uppercase extra-small fw-bold text-ios-green mb-1 opacity-75">Entradas</p>
              <p className="h5 fw-bold text-ios-green m-0">R$ {summary.incomeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 h-100 bg-ios-secondary shadow-sm rounded-4">
            <Card.Body className="p-3 text-center">
              <p className="text-uppercase extra-small fw-bold text-ios-red mb-1 opacity-75">Saídas</p>
              <p className="h5 fw-bold text-ios-red m-0">R$ {summary.expenseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="border-0 h-100 bg-ios-dark-gray shadow-sm rounded-4">
            <Card.Body className="p-3 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 80 }}>
              <div className={`d-flex align-items-center gap-1 ${savingsRate >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                {savingsRate >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span className="h4 fw-bold m-0">{savingsRate.toFixed(1)}%</span>
              </div>
              <p className="extra-small text-ios-gray m-0 opacity-75">Taxa de Economia</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 h-100 bg-ios-dark-gray shadow-sm rounded-4">
            <Card.Body className="p-3 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 80 }}>
              <span className="h4 fw-bold m-0 text-white">
                R$ {dailyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <p className="extra-small text-ios-gray m-0 opacity-75">Gasto Médio / Dia</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mb-5">
        <h3 className="h5 fw-bold mb-3 px-1">Distribuição</h3>
        <Card className="bg-ios-dark-gray border-0 p-3 shadow-none rounded-4">
          <Card.Body className="p-0 overflow-visible">
            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={100}
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
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                      formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ 
                        paddingTop: '30px',
                        fontSize: '11px',
                        color: '#8E8E93'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-ios-gray opacity-50">
                  <BarChart3 size={48} className="mb-2" />
                  <span>Sem despesas neste período</span>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {topCategoryData.length > 0 && (
          <Card className="bg-ios-dark-gray border-0 p-3 mt-3 shadow-none rounded-4">
            <Card.Body className="p-0">
              <h4 className="h6 fw-bold mb-3 text-ios-gray text-uppercase px-1">Top Categorias</h4>
              {topCategoryData.map((item, i) => (
                <div key={item.name} className="d-flex align-items-center gap-3 mb-3">
                  <span className="extra-small fw-bold text-ios-gray opacity-50" style={{ width: 20 }}>{i + 1}</span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-medium text-white">{item.name}</span>
                      <span className="small fw-bold text-white">
                        R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-100 bg-black rounded-pill overflow-hidden" style={{ height: 6 }}>
                      <div
                        className="h-100 rounded-pill transition-all"
                        style={{
                          width: `${maxCategoryValue > 0 ? (item.total / maxCategoryValue) * 100 : 0}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        )}
      </div>

      <div className="mb-5">
        <h3 className="h5 fw-bold mb-3 px-1">Fluxo de Caixa</h3>
        <Card className="bg-ios-dark-gray border-0 p-3 shadow-none rounded-4">
          <Card.Body className="p-0">
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </div>

      {monthlyEvolution.length > 1 && (
        <div className="mb-5">
          <h3 className="h5 fw-bold mb-3 px-1">Evolução Mensal</h3>
          <Card className="bg-ios-dark-gray border-0 p-3 shadow-none rounded-4">
            <Card.Body className="p-0">
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyEvolution} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#30D158" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF453A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#30D158" fill="url(#gradientIncome)" strokeWidth={2} name="Entradas" />
                    <Area type="monotone" dataKey="expense" stroke="#FF453A" fill="url(#gradientExpense)" strokeWidth={2} name="Saídas" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default ReportsScreen;
