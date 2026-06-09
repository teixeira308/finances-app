import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, ArrowRight, RefreshCw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { calculateMonthlySummary } from '@/shared/models/finance';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { selectRecurringTransactions } from '@/features/transactions/store/recurringTransactionsSlice';
import { setSelectedMonth } from '@/features/dashboard/store/dashboardSlice';
import { projectRecurringTransactions } from '@/shared/utils/projection';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { PrivacyToggle } from '@/shared/components/PrivacyToggle';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { CreditCardDashboard } from '@/features/workspaces/screens/CreditCardDashboard';
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeWorkspace } = useWorkspaces();
  const monthRef = useAppSelector((state) => state.dashboard.selectedMonth);
  const transactions = useAppSelector((state) => state.transactions.items);
  const recurringTransactions = useAppSelector(selectRecurringTransactions);
  const categories = useAppSelector(selectCategories);
  const goals = useAppSelector((state) => state.goals.items);
  
  const monthLabel = useMemo(() => {
    const [year, month] = monthRef.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [monthRef]);

  const handlePrevMonth = () => {
    const [year, month] = monthRef.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    const newMonthRef = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dispatch(setSelectedMonth(newMonthRef));
  };

  const handleNextMonth = () => {
    const [year, month] = monthRef.split('-').map(Number);
    const date = new Date(year, month, 1);
    const newMonthRef = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dispatch(setSelectedMonth(newMonthRef));
  };
  
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
        color: category?.colorToken || '#8E8E93',
        percentage: (item.total / summary.expenseTotal) * 100
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

  if (activeWorkspace?.type === 'CREDIT_CARD') {
    return <CreditCardDashboard />;
  }

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="d-flex justify-content-between align-items-center pt-4 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
             <h1 className="h1 fw-bold m-0 text-truncate" style={{ maxWidth: '260px' }}>{activeWorkspace?.name || 'Dashboard'}</h1>
          </div>
          <p className="text-ios-gray mb-0">Resumo financeiro</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="btn border-0 p-2 text-ios-gray shadow-none"
            title="Atualizar dados"
          >
            <RefreshCw size={20} />
          </button>
          <PrivacyToggle />
        </div>
      </div>

      {/* Navegação Mensal */}
      <Card className="bg-ios-secondary border-0 mb-4 shadow-none">
        <Card.Body className="p-2 d-flex align-items-center justify-content-between">
          <Button 
            variant="link" 
            className="text-white p-2 shadow-none" 
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div className="d-flex align-items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="fw-bold text-capitalize small">{monthLabel}</span>
          </div>

          <Button 
            variant="link" 
            className="text-white p-2 shadow-none" 
            onClick={handleNextMonth}
          >
            <ChevronRight size={20} />
          </Button>
        </Card.Body>
      </Card>
      
      <Row className="g-3">
        {/* Column: Summary and Balance */}
        <Col xs={12} lg={5}>
          <Card className="bg-transparent border-2 mb-3" style={{ borderColor: summary.netBalance >= 0 ? 'var(--ios-green)' : 'var(--ios-red)' }}>
            <Card.Body className="py-4 px-4">
              <p className="text-uppercase small fw-bold tracking-widest text-ios-gray mb-1">Saldo Previsto</p>
              <h2 className="display-4 fw-bold m-0" style={{ color: summary.netBalance >= 0 ? 'var(--ios-green)' : 'var(--ios-red)' }}>
                <MoneyValue value={summary.netBalance} />
              </h2>
            </Card.Body>
          </Card>
          
          <Row className="g-3 mb-4">
            <Col xs={6}>
              <Card className="border-0 h-100 bg-ios-secondary">
                <Card.Body className="p-3">
                  <p className="text-uppercase x-small fw-bold text-ios-green mb-1">Entradas</p>
                  <p className="h5 fw-bold text-ios-green m-0"><MoneyValue value={summary.incomeTotal} /></p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="border-0 h-100 bg-ios-secondary">
                <Card.Body className="p-3">
                  <p className="text-uppercase x-small fw-bold text-ios-red mb-1">Saídas</p>
                  <p className="h5 fw-bold text-ios-red m-0"><MoneyValue value={summary.expenseTotal} /></p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Column: Charts */}
        <Col xs={12} lg={7}>
          <h3 className="h5 fw-bold mb-3 px-1">Evolução Diária</h3>
          <Card className="bg-ios-dark-gray border-0 p-3 mb-4">
            <Card.Body className="p-0">
              <div style={{ width: '100%', height: '220px' }}>
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
          <Card className="bg-ios-dark-gray border-0 p-3 mb-4">
            <Card.Body className="p-0">
              <Row className="align-items-center">
                <Col xs={12} md={6}>
                  <div style={{ width: '100%', height: '250px' }}>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-ios-gray small">
                        Sem despesas
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="mt-3 mt-md-0">
                    {pieData.slice(0, 5).map((item, index) => (
                      <div key={index} className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: item.color, flexShrink: 0 }}></div>
                          <span className="small text-white text-truncate">{item.name}</span>
                        </div>
                        <span className="small fw-bold text-ios-gray ms-2">{item.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                    {pieData.length > 5 && (
                      <div className="text-center mt-2">
                        <span className="x-small text-ios-gray">+{pieData.length - 5} outras categorias</span>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Button 
            variant="ios-primary" 
            className="w-100 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 mb-5"
            onClick={() => navigate('/reports')}
          >
            <BarChart3 size={20} />
            Ver Relatório Completo
            <ArrowRight size={18} />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
