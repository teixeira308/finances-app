import React, { useState } from 'react';
import { Card, TextField, Label, Input, Button, Chip } from '@heroui/react';
import { login } from '@/features/auth/services/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm bg-ios-darkGray border-none shadow-xl">
        <Card.Content className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Bem-vindo de volta
          </h1>
          
          <div className="space-y-4">
            <TextField onChange={setEmail} value={email} className="w-full">
              <Label className="text-xs text-ios-gray mb-1 block">Email</Label>
              <Input 
                className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="seu@email.com"
              />
            </TextField>
            
            <TextField onChange={setPassword} value={password} className="w-full">
              <Label className="text-xs text-ios-gray mb-1 block">Senha</Label>
              <Input 
                type="password"
                className="w-full bg-white/5 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </TextField>
          </div>

          {error && <Chip variant="soft" className="w-full bg-ios-red/20 text-ios-red border-none">{error}</Chip>}

          <Button fullWidth variant="primary" onPress={handleSubmit} className="h-12 font-bold rounded-2xl">
            Entrar
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LoginScreen;
