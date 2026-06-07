import React, { useMemo } from 'react';
import { Container, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useAppSelector } from '@/store/hooks';
import { MoneyValue } from '@/shared/components/MoneyValue';
import { Repeat, ChevronRight } from 'lucide-react';

export const InstallmentsScreen: React.FC = () => {
  const transactions = useAppSelector((state) => state.transactions.items);

  const purchases = useMemo(() => {
    const map = new Map<string, any>();
    
    transactions.forEach(tx => {
      if (tx.installmentInfo) {
        const pid = tx.installmentInfo.purchaseId;
        if (!map.has(pid)) {
          map.set(pid, {
            id: pid,
            note: tx.note,
            totalAmount: tx.amount * tx.installmentInfo.total,
            parcelAmount: tx.amount,
            totalParcels: tx.installmentInfo.total,
            parcels: []
          });
        }
        map.get(pid).parcels.push(tx);
      }
    });

    return Array.from(map.values()).map(p => {
      const paidParcels = p.parcels.filter((tx: any) => new Date(tx.occurredAt) <= new Date()).length;
      return {
        ...p,
        paidParcels,
        progress: (paidParcels / p.totalParcels) * 100
      };
    });
  }, [transactions]);

  return (
    <Container className="mobile-container p-4 pb-5">
      <div className="pt-4 mb-4">
        <h1 className="h1 fw-bold m-0">Parcelamentos</h1>
        <p className="text-ios-gray">Acompanhamento de compras longas</p>
      </div>

      <div className="d-flex flex-column gap-3 mb-5">
        {purchases.map((p) => (
          <Card key={p.id} className="bg-ios-dark-gray border-0 p-4 rounded-4 shadow-none">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                    <Repeat size={24} />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold m-0 text-white">{p.note}</h3>
                    <p className="m-0 x-small text-ios-gray">
                      {p.totalParcels} parcelas de <MoneyValue value={p.parcelAmount} />
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-white"><MoneyValue value={p.totalAmount} /></span>
                  <p className="m-0 x-small text-ios-gray">Total</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="d-flex justify-content-between small fw-bold mb-2">
                  <span className="text-ios-gray">Progresso: {p.paidParcels}/{p.totalParcels}</span>
                  <span className="text-primary">{p.progress.toFixed(0)}%</span>
                </div>
                <ProgressBar 
                  now={p.progress} 
                  variant="primary" 
                  className="bg-black bg-opacity-50 rounded-pill"
                  style={{ height: "8px" }}
                />
              </div>

              <div className="d-flex gap-1 mt-4 flex-wrap">
                {Array.from({ length: p.totalParcels }).map((_, i) => (
                  <div 
                    key={i}
                    className={`rounded-circle ${i < p.paidParcels ? 'bg-success' : 'bg-secondary opacity-30'}`}
                    style={{ width: '8px', height: '8px' }}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
        {purchases.length === 0 && (
          <div className="text-center py-5 opacity-50">
            <p className="text-ios-gray">Nenhum parcelamento ativo</p>
          </div>
        )}
      </div>
    </Container>
  );
};
