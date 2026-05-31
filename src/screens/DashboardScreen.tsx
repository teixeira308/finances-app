import React, { useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { calculateMonthlySummary } from '@/shared/models/finance';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { selectRecurringTransactions } from '@/features/transactions/store/recurringTransactionsSlice';
import { projectRecurringTransactions } from '@/shared/utils/projection';
import logoNome from '@/assets/logo-nome.png';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { PrivacyToggle } from '@/shared/components/PrivacyToggle';

const DashboardScreen = () => {
  const transactions = useAppSelector((state) => state.transactions.items);
  const recurringTransactions = useAppSelector(selectRecurringTransactions);
  const categories = useAppSelector(selectCategories);
  const goals = useAppSelector((state) => state.goals.items);
  
  const monthRef = new Date().toISOString().slice(0, 7);
  
  const allTransactions = useMemo(() => {
    const actual = transactions.filter(tx => tx.occurredAt.startsWith(monthRef));
    const projected = projectRecurringTransactions(recurringTransactions, monthRef);
    return [...actual, ...projected];
  }, [transactions, recurringTransactions, monthRef]);

  const summary = useMemo(
    () => calculateMonthlySummary(monthRef, allTransactions, goals.find((goal) => goal.monthRef === monthRef)),
    [goals, monthRef, allTransactions]
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

  const dailyData = useMemo(() => {
    const data: Record<string, { income: number; expense: number }> = {};
    allTransactions
      .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
      .forEach(tx => {
        const date = new Date(tx.occurredAt).getDate().toString();
        if (!data[date]) data[date] = { income: 0, expense: 0 };
        if (tx.type === 'income') data[date].income += tx.amount;
        else data[date].expense += tx.amount;
      });
    return Object.entries(data).map(([date, values]) => ({ date, ...values }));
  }, [allTransactions]);

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex d-md-none justify-content-center align-items-center pt-4 mb-4 position-relative">
        <img src={logoNome} alt="Gastos Mensais" className="rounded-3" style={{ height: '50px' }} />
        <div className="position-absolute end-0">
          <PrivacyToggle />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="d-none d-md-flex justify-content-between align-items-center pt-4 mb-4">
        <h1 className="h3 fw-bold m-0">Resumo de {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h1>
        <PrivacyToggle />
      </div>
      
      <Row className="g-4">
        {/* Left Column: Summary and Balance */}
        <Col xs={12} lg={5}>
          <Card className="bg-transparent border-2 mb-4" style={{ borderColor: summary.netBalance >= 0 ? 'var(--ios-green)' : 'var(--ios-red)' }}>
            <Card.Body className="py-5 px-4">
              <p className="text-uppercase small fw-bold tracking-widest text-ios-gray mb-1">Saldo Previsto</p>
              <h2 className="display-4 fw-bold m-0" style={{ color: summary.netBalance >= 0 ? 'var(--ios-green)' : 'var(--ios-red)' }}>
                <MoneyValue value={summary.netBalance} />
              </h2>
            </Card.Body>
          </Card>
          
          <Row className="g-3 mb-4">
            <Col xs={6}>
              <Card className="border-0 h-100 bg-ios-secondary">
                <Card.Body className="p-3 text-center">
                  <p className="text-uppercase small fw-bold text-ios-green mb-1">Entradas</p>
                  <p className="h4 fw-bold text-ios-green m-0"><MoneyValue value={summary.incomeTotal} /></p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="border-0 h-100 bg-ios-secondary">
                <Card.Body className="p-3 text-center">
                  <p className="text-uppercase small fw-bold text-ios-red mb-1">Saídas</p>
                  <p className="h4 fw-bold text-ios-red m-0"><MoneyValue value={summary.expenseTotal} /></p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3 className="h5 fw-bold mb-3 px-1 d-md-none">Distribuição</h3>
          <Card className="bg-ios-dark-gray border-0 p-3 mb-4 d-md-none">
            <Card.Body className="p-0">
               {/* Pie Chart content handled below for desktop but visible here for mobile only if we want to change order */}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Charts */}
        <Col xs={12} lg={7}>
          <h3 className="h5 fw-bold mb-3 px-1">Evolução Diária</h3>
          <Card className="bg-ios-dark-gray border-0 p-3 mb-4">
            <Card.Body className="p-0">
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#8E8E93', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '10px' }}
                    />
                    <Area type="monotone" dataKey="income" name="Entradas" stroke="#30D158" fill="#30D158" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="expense" name="Saídas" stroke="#FF453A" fill="#FF453A" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>

          <h3 className="h5 fw-bold mb-3 px-1">Distribuição de Gastos</h3>
          <Card className="bg-ios-dark-gray border-0 p-3 mb-5">
            <Card.Body className="p-0">
              <div style={{ width: '100%', height: '300px' }}>
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
                  <div className="d-flex align-items-center justify-content-center h-100 text-ios-gray">
                    Sem despesas neste mês
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
