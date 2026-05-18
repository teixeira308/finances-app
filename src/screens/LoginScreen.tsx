import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Chip } from '@nextui-org/react';
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
        <CardBody className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Bem-vindo de volta
          </h1>
          
          <Input 
            label="Email" 
            variant="flat" 
            value={email} 
            onValueChange={setEmail} 
          />
          <Input 
            label="Senha" 
            type="password" 
            variant="flat" 
            value={password} 
            onValueChange={setPassword} 
          />

          {error && <Chip color="danger" variant="flat" className="w-full">{error}</Chip>}

          <Button fullWidth color="primary" onPress={handleSubmit} size="lg">
            Entrar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginScreen;
