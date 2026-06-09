import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { finishOnboarding } from '../store/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { Wallet, PlusCircle, BarChart3, Sparkles, ChevronRight, ChevronLeft, Landmark, CreditCard } from 'lucide-react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { workspaceRepository } from '@/storage/repositories/workspaceRepository';
import { nanoid } from 'nanoid';
import type { WorkspaceType } from '@/shared/models/finance';
import { setActiveWorkspaceId } from '../../workspaces/store/workspaceSlice';

const steps = [
  {
    icon: Wallet,
    title: 'Crie espaços financeiros',
    description: 'Conta corrente, cartão de crédito, ou tudo junto. Cada espaço com seu próprio saldo e metas.',
  },
  {
    icon: PlusCircle,
    title: 'Registre transações',
    description: 'Gastos, receitas e parcelamentos em segundos. Tudo organizado por categoria.',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe relatórios',
    description: 'Gráficos que mostram pra onde vai seu dinheiro. Evolução mensal, distribuição e muito mais.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [wsName, setWsName] = useState('');
  const [wsType, setWsType] = useState<WorkspaceType>('ACCOUNT');
  const [wsLimit, setWsLimit] = useState('');
  const [wsClosingDay, setWsClosingDay] = useState('15');
  const [wsDueDay, setWsDueDay] = useState('22');
  const [wsColor, setWsColor] = useState('#0A84FF');
  const [isCreating, setIsCreating] = useState(false);

  const isLastStep = step === steps.length;
  const progress = ((step) / (steps.length)) * 100;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      await dispatch(finishOnboarding());
      navigate('/');
      return;
    }

    if (wsName.trim()) {
      setIsCreating(true);
      try {
        const id = nanoid();
        const metadata: Record<string, unknown> = {
          color: wsType === 'CREDIT_CARD' ? wsColor : '#30D158',
        };
        if (wsType === 'CREDIT_CARD') {
          metadata.limit = parseFloat(wsLimit) || 0;
          metadata.closingDay = parseInt(wsClosingDay, 10) || 15;
          metadata.dueDay = parseInt(wsDueDay, 10) || 22;
        }
        await workspaceRepository.save({
          id,
          userId: user.uid,
          name: wsName.trim(),
          type: wsType,
          metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        dispatch(setActiveWorkspaceId(id));
      } catch (err) {
        console.error(err);
      }
    }

    await dispatch(finishOnboarding());
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 122, 255, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Progress bar */}
      <div className="mx-4 mt-4" style={{ height: 3 }}>
        <div
          className="h-100 rounded-pill transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--ios-blue)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-4 position-relative">
        {step < steps.length ? (
          /* Steps 0-2 */
          <div className="w-100 text-center" key={step}>
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-4 mb-5"
              style={{
                width: 96,
                height: 96,
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
              }}
            >
              {React.createElement(steps[step].icon, {
                size: 48,
                strokeWidth: 1.5,
                className: 'text-primary',
              })}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontSize: '1.75rem' }}>
              {steps[step].title}
            </h1>
            <p className="text-ios-gray mb-0" style={{ fontSize: '1.05rem', maxWidth: 340, margin: '0 auto' }}>
              {steps[step].description}
            </p>
          </div>
        ) : (
          /* Step 3 — Create workspace */
          <div className="w-100" style={{ maxWidth: 380 }}>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'rgba(0, 122, 255, 0.1)',
                }}
              >
                <Sparkles size={40} strokeWidth={1.5} className="text-primary" />
              </div>
              <h1 className="fw-bold mb-2">Pronto pra começar</h1>
              <p className="text-ios-gray" style={{ fontSize: '1rem' }}>
                Crie seu primeiro espaço financeiro
              </p>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Nome do Espaço</Form.Label>
              <Form.Control
                placeholder="Ex: Nubank, Carteira..."
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Tipo</Form.Label>
              <div className="d-flex gap-2">
                <Button
                  variant={wsType === 'ACCOUNT' ? 'primary' : 'ios-secondary'}
                  className="flex-grow-1 py-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setWsType('ACCOUNT')}
                >
                  <Landmark size={18} />
                  Conta Corrente
                </Button>
                <Button
                  variant={wsType === 'CREDIT_CARD' ? 'primary' : 'ios-secondary'}
                  className="flex-grow-1 py-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setWsType('CREDIT_CARD')}
                >
                  <CreditCard size={18} />
                  Cartão
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-ios-gray text-uppercase">Cor do Espaço</Form.Label>
              <Form.Control
                type="color"
                value={wsType === 'ACCOUNT' ? '#30D158' : wsColor}
                onChange={(e) => setWsColor(e.target.value)}
                className="p-0 border-0 bg-transparent w-100"
                style={{ height: '60px', cursor: 'pointer' }}
              />
            </Form.Group>

            {wsType === 'CREDIT_CARD' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-ios-gray text-uppercase">Limite do Cartão</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="R$ 0,00"
                    value={wsLimit}
                    onChange={(e) => setWsLimit(e.target.value)}
                    className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                  />
                </Form.Group>
                <div className="d-flex gap-3 mb-3">
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="small fw-bold text-ios-gray text-uppercase">Fechamento</Form.Label>
                    <Form.Control
                      type="number" min={1} max={31}
                      placeholder="15"
                      value={wsClosingDay}
                      onChange={(e) => setWsClosingDay(e.target.value)}
                      className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                    />
                  </Form.Group>
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="small fw-bold text-ios-gray text-uppercase">Vencimento</Form.Label>
                    <Form.Control
                      type="number" min={1} max={31}
                      placeholder="22"
                      value={wsDueDay}
                      onChange={(e) => setWsDueDay(e.target.value)}
                      className="bg-ios-secondary border-0 text-white py-3 px-3 shadow-none"
                    />
                  </Form.Group>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="p-4 position-relative">
        {step < steps.length ? (
          <div className="d-flex flex-column gap-3">
            {/* Dot indicators */}
            <div className="d-flex justify-content-center gap-2 mb-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-pill transition-all"
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    backgroundColor: i === step ? 'var(--ios-blue)' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            <div className="d-flex gap-3">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="btn border-0 py-3 px-4 rounded-3 d-flex align-items-center justify-content-center gap-2 text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <ChevronLeft size={20} />
                  Voltar
                </button>
              ) : (
                <div className="flex-grow-1" />
              )}
              <button
                onClick={step === steps.length - 1 ? () => setStep(s => s + 1) : handleNext}
                className="btn border-0 py-3 px-4 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 text-white"
                style={{ backgroundColor: 'var(--ios-blue)' }}
              >
                {step === steps.length - 1 ? 'Criar Espaço' : 'Continuar'}
                {step < steps.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>

            {step < steps.length - 1 && (
              <button
                onClick={handleFinish}
                className="btn border-0 py-2 text-ios-gray small text-decoration-none shadow-none"
              >
                Pular introdução
              </button>
            )}
          </div>
        ) : (
          /* Final: Começar button */
          <div className="d-flex flex-column gap-2">
            <button
              onClick={handleFinish}
              disabled={isCreating}
              className="btn border-0 py-3 rounded-3 fw-bold fs-5 text-white shadow-none"
              style={{ backgroundColor: 'var(--ios-blue)' }}
            >
              {isCreating ? 'Criando...' : 'Começar Agora'}
            </button>
            <button
              onClick={() => {
                setWsName('');
                setStep(0);
              }}
              className="btn border-0 py-2 text-ios-gray small text-decoration-none shadow-none"
            >
              Refazer introdução
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
