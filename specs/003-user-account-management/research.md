# Pesquisa e Descoberta - Gestão de Conta do Usuário

## 1. Arquitetura Atual de Identidade

Atualmente, o sistema utiliza o **Firebase Authentication** (E-mail/Senha) como provedor de identidade primário.

### Componentes Identificados:
- `AuthProvider.tsx`: Gerencia o estado de autenticação global via `onAuthStateChanged`.
- `authService.ts`: Fornece métodos para login, signup e logout.
- `Sidebar.tsx` e `Navigation/index.tsx`: Controlam a navegação baseada no estado de autenticação.
- `LoginScreen.tsx`: Interface de entrada.

### Armazenamento de Dados do Usuário:
Hoje, os dados de perfil do usuário (além do e-mail e UID básicos do Firebase Auth) estão sendo migrados para o Firestore na coleção `/users`.
- O avatar é gerado automaticamente a partir das iniciais do nome, eliminando a necessidade de armazenamento de imagens no Firebase Storage.

## 2. Fluxos de Autenticação e Autorização

- **Autenticação:** Baseada em sessão persistente do Firebase.
- **Autorização:** Implementada via Firestore Security Rules usando o `userId` em cada documento.

## 3. Segurança e Privacidade (Estado Atual)

- **Security Rules:** Atualizadas para proteger a nova coleção `/users`.
- **Privacidade:** Implementando política de exclusão permanente ("Esquecimento") e exportação de dados em conformidade com a LGPD.

## 4. Oportunidades de Melhoria

1. **Coleção de Perfil:** Finalizar integração da coleção `users/{uid}`.
2. **Sincronização de Perfil:** Vincular metadados do Firebase Auth com o documento do Firestore.
3. **Fluxos de Segurança:** Adicionar telas para alteração de senha e exclusão de conta dentro do app.
4. **GDPR/LGPD:** Implementar ferramentas de "Download de Dados".

## 5. Serviços Necessários
- **Firebase Auth:** Manutenção do login e segurança de credenciais.
- **Cloud Firestore:** Armazenamento de perfis e configurações.

## 6. Riscos Identificados
- **Inconsistência:** O Firebase Auth pode ter um nome e o Firestore outro.
- **Orfandade de Dados:** Deletar o usuário no Auth mas deixar seus rastros no Firestore gerando custos e violações de privacidade.
