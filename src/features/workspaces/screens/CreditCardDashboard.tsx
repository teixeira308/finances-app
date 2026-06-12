import React, { useMemo } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { CreditCard, Calendar, History } from 'lucide-react';

export const CreditCardDashboard: React.FC = () => {
  const { activeWorkspace } = useWorkspaces();
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  
  const metadata = activeWorkspace?.metadata || {};
  const limit = metadata.limit || 0;
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthRef = nextMonth.toISOString().slice(0, 7);

  const stats = useMemo(() => {
    const currentInvoice = transactions
      .filter(tx => tx.occurredAt.startsWith(currentMonth))
      .reduce((sum, tx) => sum + tx.amount, 0);

    const nextInvoice = transactions
      .filter(tx => tx.occurredAt.startsWith(nextMonthRef))
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalUtilized = transactions
      .filter(tx => !tx.deletedAt)
      .reduce((sum, tx) => sum + tx.amount, 0); // Simplified: assumes all transactions are debts

    return {
      currentInvoice,
      nextInvoice,
      totalUtilized,
      available: Math.max(limit - totalUtilized, 0),
      usagePercent: limit > 0 ? (totalUtilized / limit) * 100 : 0
    };
  }, [transactions, limit, currentMonth, nextMonthRef]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => 
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );
  }, [transactions]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof sortedTransactions> = {};
    sortedTransactions.forEach((tx) => {
      const date = new Date(tx.occurredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
    });
    return groups;
  }, [sortedTransactions]);

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">{activeWorkspace?.name}</h1>
        <p className="text-ios-gray">Gestão de Cartão de Crédito</p>
      </div>

      {/* Limit Card */}
      <Card className="bg-ios-dark-gray border-0 p-4 mb-4 rounded-4 shadow-none">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="text-uppercase small fw-bold text-ios-gray mb-1">Limite Disponível</p>
              <h2 className="display-5 fw-bold m-0 text-white">
                <MoneyValue value={stats.available} />
              </h2>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
              <CreditCard size={32} className="text-primary" />
            </div>
          </div>

          <div className="mb-2">
            <div className="d-flex justify-content-between small fw-bold mb-2">
              <span className="text-ios-gray">Utilizado: <MoneyValue value={stats.totalUtilized} /></span>
              <span className="text-ios-gray">Total: <MoneyValue value={limit} /></span>
            </div>
            <ProgressBar 
              now={stats.usagePercent} 
              variant={stats.usagePercent > 80 ? "danger" : "primary"} 
              className="bg-black bg-opacity-50 rounded-pill"
              style={{ height: "12px" }}
            />
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        <Col xs={6}>
          <Card className="bg-ios-secondary border-0 p-3 rounded-4 shadow-none h-100">
            <Card.Body className="p-0">
              <p className="text-uppercase x-small fw-bold text-ios-gray mb-1">Fatura Atual</p>
              <h3 className="h4 fw-bold m-0 text-white">
                <MoneyValue value={stats.currentInvoice} />
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="bg-ios-secondary border-0 p-3 rounded-4 shadow-none h-100">
            <Card.Body className="p-0">
              <p className="text-uppercase x-small fw-bold text-ios-gray mb-1">Próxima Fatura</p>
              <h3 className="h4 fw-bold m-0 text-ios-gray opacity-80">
                <MoneyValue value={stats.nextInvoice} />
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Info */}
      <Card className="bg-ios-dark-gray border-0 p-4 mb-4 rounded-4 shadow-none">
        <Card.Body className="p-0">
          <div className="d-flex align-items-center gap-3 mb-3">
            <Calendar size={20} className="text-ios-blue" />
            <div>
              <p className="m-0 small fw-bold text-white">Fechamento dia {metadata.closingDay || '--'}</p>
              <p className="m-0 x-small text-ios-gray">Vencimento dia {metadata.dueDay || '--'}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Compras */}
      <h3 className="h5 fw-bold mb-3 px-1 d-flex align-items-center gap-2">
        <History size={18} />
        Compras
      </h3>
      {Object.keys(groupedTransactions).length > 0 ? (
        Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date} className="mb-4">
            <div className="d-flex justify-content-between align-items-center px-1 mb-2">
              <span className="small fw-bold text-ios-gray">{date}</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {txs.map((tx) => {
                const category = categories.find(c => c.id === tx.categoryId);
                return (
                  <Card key={tx.id} className="bg-ios-dark-gray border-0 p-3 rounded-4 shadow-none border-bottom border-white border-opacity-5">
                    <Card.Body className="p-0 d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1 me-3">
                        <p className="m-0 fw-bold text-white small">
                          {category?.name || 'Sem categoria'}
                        </p>
                        <p className="m-0 x-small text-ios-gray">
                          {new Date(tx.occurredAt).toLocaleDateString('pt-BR')} 
                          {tx.installmentInfo && ` • Parcela ${tx.installmentInfo.current}/${tx.installmentInfo.total}`}
                        </p>
                        {tx.note && <p className="m-0 x-small text-ios-gray mt-1">{tx.note}</p>}
                      </div>
                      <span className="fw-bold text-white text-nowrap">
                        <MoneyValue value={tx.amount} />
                      </span>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
            {(() => {
              const dayExpense = txs.reduce((s, t) => s + t.amount, 0);
              return (
                <div className="d-flex justify-content-end px-1 mt-2">
                  <span className="small fw-bold text-ios-red">
                    Total: - <MoneyValue value={dayExpense} />
                  </span>
                </div>
              );
            })()}
          </div>
        ))
      ) : (
        <Card className="bg-ios-dark-gray border-0 shadow-none mb-5">
          <Card.Body className="text-center text-ios-gray py-4">
            <p className="small m-0">Nenhuma compra registrada</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};
