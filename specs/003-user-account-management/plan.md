# Implementation Plan: Gestão de Conta do Usuário

Esta fase foca na criação da infraestrutura de dados para o usuário e nas interfaces de gerenciamento de perfil e segurança.

## Proposed Changes

### 1. Infraestrutura e Repositórios
- Criar `userRepository.ts` para gerenciar a coleção `/users` no Firestore.
- Criar `storageService.ts` para lidar com upload/delete de imagens no Firebase Storage.
- Atualizar `authService.ts` para incluir métodos de re-autenticação, troca de e-mail/senha e exclusão.

### 2. UI/UX (Novas Telas)
- `ProfileScreen.tsx`: Edição de dados básicos e upload de foto.
- `SecurityScreen.tsx`: Fluxos de alteração de senha e e-mail.
- `PrivacyScreen.tsx`: Exportação de dados e exclusão de conta.

### 3. Integração
- Criar um Hook `useUserProfile` para carregar e sincronizar os dados do Firestore com o estado local.
- Atualizar a `Sidebar` para exibir o nome e foto reais do Firestore em vez de placeholders.

## User Review Required

> [!IMPORTANT]
> A exclusão de conta é irreversível e remove todos os dados do Firestore. Recomendo o uso de uma Cloud Function para garantir que a limpeza ocorra mesmo se o usuário fechar o browser durante o processo. Se concordar, precisaremos configurar o Firebase Functions.

- **Dúvida**: Devemos forçar a verificação de e-mail logo após o cadastro para permitir o acesso ao app?

## Risk Assessment & Mitigation

- **Risco**: Upload de arquivos maliciosos.
  - **Mitigação**: Validar MIME-type e tamanho no frontend e via Security Rules no Storage.
- **Risco**: Inconsistência entre Auth e Firestore.
  - **Mitigação**: Implementar salvamento atômico ou retentativas automáticas no `userRepository`.

## Strategic Decisions

- **Estratégia**: Migração progressiva. Novos usuários ganham o perfil no signup. Usuários antigos ganham o perfil ao logar pela primeira vez no novo módulo.
- **Formato de Exportação**: JSON, por ser o mais compatível com a estrutura de documentos do Firestore.
