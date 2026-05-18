import React from 'react';
import { Card, ListBox } from '@heroui/react';
import { Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { logout } from '@/features/auth/services/authService';

const SettingsScreen = () => {
  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-bold pt-4">Ajustes</h1>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none mt-6">
        <Card.Content className="p-0">
          <ListBox 
            aria-label="Opções de Ajustes"
            className="p-0"
          >
            <ListBox.Item
              id="privacy"
              textValue="Privacidade"
              className="px-4 py-4 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5 flex items-center justify-between w-full cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-ios-red/20 flex items-center justify-center text-ios-red">
                  <Shield size={18} />
                </div>
                <span className="text-base font-semibold text-foreground">Privacidade</span>
              </div>
              <ChevronRight size={18} className="text-ios-gray/40" />
            </ListBox.Item>
            
            <ListBox.Item
              id="help"
              textValue="Ajuda e Suporte"
              className="px-4 py-4 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5 flex items-center justify-between w-full cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-ios-green/20 flex items-center justify-center text-ios-green">
                  <HelpCircle size={18} />
                </div>
                <span className="text-base font-semibold text-foreground">Ajuda e Suporte</span>
              </div>
              <ChevronRight size={18} className="text-ios-gray/40" />
            </ListBox.Item>
          </ListBox>
        </Card.Content>
      </Card>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <Card.Content className="p-0">
          <ListBox 
            aria-label="Ação de Sair"
            className="p-0"
          >
            <ListBox.Item
              id="logout"
              textValue="Sair da Conta"
              className="px-4 py-4 text-ios-red flex items-center gap-3 cursor-pointer outline-none data-[hover=true]:bg-white/5"
              onAction={() => logout()}
            >
              <div className="w-8 h-8 rounded-lg bg-ios-red/10 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="text-base font-semibold">Sair da Conta</span>
            </ListBox.Item>
          </ListBox>
        </Card.Content>
      </Card>

      <div className="text-center space-y-1 pt-4">
        <p className="text-xs text-ios-gray">Versão 3.0.0 (HeroUI Edition)</p>
        <p className="text-[10px] text-ios-gray/40 uppercase tracking-tighter">Powered by HeroUI & Firebase</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
