import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { finishOnboarding } from '../store/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import logoNome from '@/assets/logo-nome.png';

export const OnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFinish = async () => {
    await dispatch(finishOnboarding());
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-black text-white p-4 text-center">
      <div className="mb-5">
        <img src={logoNome} alt="Nexo" style={{ height: '60px', marginBottom: '24px' }} />
        <p className="lead text-secondary fs-4">Organize suas finanças de forma simples e intuitiva.</p>
      </div>
      
      <div className="w-100" style={{ maxWidth: '450px' }}>
        <div className="d-flex flex-column gap-4 mb-5 text-start">
          <div className="d-flex align-items-center gap-3">
            <div className="p-1 rounded-circle">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <div>
              <h3 className="h4 mb-1">Controle de Gastos</h3>
              <p className="fs-5 text-secondary mb-0">Acompanhe suas despesas diárias com facilidade.</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="p-1 rounded-circle">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <div>
              <h3 className="h4 mb-1">Relatórios Detalhados</h3>
              <p className="fs-5 text-secondary mb-0">Visualize onde seu dinheiro está sendo gasto.</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="p-1 rounded-circle">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <div>
              <h3 className="h4 mb-1">Categorização Inteligente</h3>
              <p className="fs-5 text-secondary mb-0">Organize tudo por categorias personalizadas.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold fs-4"
        >
          Começar Agora
        </button>
      </div>
    </div>
  );
};
