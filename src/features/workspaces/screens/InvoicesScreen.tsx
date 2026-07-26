import React, { useMemo, useState } from 'react';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/categories/store/categoriesSlice';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { toLocalMonthRef } from '@/shared/utils/date';

export const InvoicesScreen: React.FC = () => {
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector(selectCategories);
  const { activeWorkspace } = useWorkspaces();
  
  const [selectedMonth, setSelectedMonth] = useState(toLocalMonthRef(new Date()));

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  const invoiceTransactions = useMemo(() => {
    return transactions.filter(tx => tx.occurredAt.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const total = useMemo(() => {
    return invoiceTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [invoiceTransactions]);

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Faturas</h1>
        <p className="text-ios-gray">Visão mensal de gastos</p>
      </div>

      {/* Month Navigator */}
      <Card className="bg-ios-dark-gray border-0 mb-4 shadow-none rounded-4">
        <Card.Body className="p-2 d-flex align-items-center justify-content-between">
          <Button variant="link" className="text-white p-2" onClick={handlePrevMonth} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </Button>
          <div className="d-flex align-items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="fw-bold text-capitalize small">{monthLabel}</span>
          </div>
          <Button variant="link" className="text-white p-2" onClick={handleNextMonth} aria-label="Próximo mês">
            <ChevronRight size={20} />
          </Button>
        </Card.Body>
      </Card>

      {/* Total Card */}
      <Card className="bg-ios-secondary border-0 p-4 mb-5 rounded-4 shadow-sm">
        <Card.Body className="p-0 text-center">
          <p className="text-uppercase small fw-bold text-ios-gray mb-1">Total da Fatura</p>
          <h2 className="display-5 fw-bold m-0 text-white">
            <MoneyValue value={total} />
          </h2>
          {total > 0 && (
            <div className="mt-4 d-flex justify-content-center gap-4">
              <div className="text-center">
                <p className="text-ios-gray mb-1">Fechamento</p>
                <p className="fw-bold text-white m-0 fs-5">Dia {activeWorkspace?.metadata?.closingDay || '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-ios-gray mb-1">Vencimento</p>
                <p className="fw-bold text-white m-0 fs-5">Dia {activeWorkspace?.metadata?.dueDay || '--'}</p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <h3 className="h5 fw-bold mb-3 px-1">Lançamentos</h3>
      <div className="d-flex flex-column gap-2 mb-5">
        {invoiceTransactions.map((tx) => (
          <Card key={tx.id} className="bg-ios-dark-gray border-0 p-3 rounded-4 shadow-none border-bottom border-white border-opacity-5">
            <Card.Body className="p-0 d-flex justify-content-between align-items-start">
              <div className="flex-grow-1 me-3">
                <p className="m-0 fw-bold text-white small">
                  {categories.find(c => c.id === tx.categoryId)?.name || 'Sem categoria'}
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
        ))}
        {invoiceTransactions.length === 0 && (
          <div className="text-center py-5 opacity-50">
            <p className="text-ios-gray">Nenhum lançamento nesta fatura</p>
          </div>
        )}
      </div>
    </Container>
  );
};
