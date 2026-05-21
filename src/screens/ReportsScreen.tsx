import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
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
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Relatórios</h1>
      </div>

      <Form.Group className="mb-4">
        <Form.Label className="small fw-bold text-ios-gray mb-1">MÊS DE REFERÊNCIA</Form.Label>
        <div className="position-relative">
          <Form.Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-14 fw-bold"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(month + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </Form.Select>
          <ChevronDown size={18} className="position-absolute text-ios-gray" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </Form.Group>

      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="border-0 h-100" style={{ backgroundColor: 'rgba(48, 209, 88, 0.1)' }}>
            <Card.Body className="p-3 text-center">
              <p className="text-uppercase small fw-bold text-ios-green mb-1">Entradas</p>
              <p className="h4 fw-bold text-ios-green m-0">R$ {summary.incomeTotal.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 h-100" style={{ backgroundColor: 'rgba(255, 69, 58, 0.1)' }}>
            <Card.Body className="p-3 text-center">
              <p className="text-uppercase small fw-bold text-ios-red mb-1">Saídas</p>
              <p className="h4 fw-bold text-ios-red m-0">R$ {summary.expenseTotal.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mb-5">
        <h3 className="h5 fw-bold mb-3 px-1">Distribuição</h3>
        <Card className="bg-ios-dark-gray border-0 p-3">
          <Card.Body className="p-0 overflow-visible">
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
      </div>

      <div className="mb-5">
        <h3 className="h5 fw-bold mb-3 px-1">Fluxo de Caixa</h3>
        <Card className="bg-ios-dark-gray border-0 p-3">
          <Card.Body className="p-0">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
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
    </Container>
  );
};

export default ReportsScreen;
