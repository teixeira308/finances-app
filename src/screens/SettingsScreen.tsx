import React from 'react';
import { Card, CardBody, Listbox, ListboxItem } from '@heroui/react';
import { Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { logout } from '@/features/auth/services/authService';

const SettingsScreen = () => {
  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-bold pt-4">Ajustes</h1>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none mt-6">
        <CardBody className="p-0">
          <Listbox 
            aria-label="Opções de Ajustes"
            className="p-0"
            itemClasses={{
              base: "px-4 py-4 border-b border-white/5 last:border-none data-[hover=true]:bg-white/5",
              title: "text-base font-semibold",
              description: "text-xs text-ios-gray"
            }}
          >
            <ListboxItem
              key="privacy"
              textValue="Privacidade"
              startContent={
                <div className="w-8 h-8 rounded-lg bg-ios-red/20 flex items-center justify-center text-ios-red">
                  <Shield size={18} />
                </div>
              }
              endContent={<ChevronRight size={18} className="text-ios-gray/40" />}
            >
              Privacidade
            </ListboxItem>
            <ListboxItem
              key="help"
              textValue="Ajuda e Suporte"
              startContent={
                <div className="w-8 h-8 rounded-lg bg-ios-green/20 flex items-center justify-center text-ios-green">
                  <HelpCircle size={18} />
                </div>
              }
              endContent={<ChevronRight size={18} className="text-ios-gray/40" />}
            >
              Ajuda e Suporte
            </ListboxItem>
          </Listbox>
        </CardBody>
      </Card>

      <Card className="bg-ios-darkGray border-none overflow-hidden shadow-none">
        <CardBody className="p-0">
          <Listbox 
            aria-label="Ação de Sair"
            className="p-0"
          >
            <ListboxItem
              key="logout"
              textValue="Sair da Conta"
              className="px-4 py-4 text-ios-red"
              onPress={() => logout()}
              startContent={
                <div className="w-8 h-8 rounded-lg bg-ios-red/10 flex items-center justify-center">
                  <LogOut size={18} />
                </div>
              }
            >
              Sair da Conta
            </ListboxItem>
          </Listbox>
        </CardBody>
      </Card>

      <div className="text-center space-y-1 pt-4">
        <p className="text-xs text-ios-gray">Versão 3.0.0 (HeroUI Edition)</p>
        <p className="text-[10px] text-ios-gray/40 uppercase tracking-tighter">Powered by HeroUI & Firebase</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
