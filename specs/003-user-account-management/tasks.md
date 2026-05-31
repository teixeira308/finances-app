# Tasks: Gestão de Conta do Usuário

## Phase 1: Foundation & Data Model (Core)

- [x] **Task 1: Firestore Security Rules**
    - [x] Adicionar regras para a coleção `/users`.
- [x] **Task 2: Repository Layer**
    - [x] Criar `src/storage/repositories/userRepository.ts`.
    - [x] Implementar `getProfile`, `updateProfile` e `createInitialProfile`.
- [x] **Task 3: Auth Service Extensions**
    - [x] Implementar `changePassword` e `changeEmail`.
    - [x] Implementar `reauthenticateUser`.
    - [x] Implementar `deleteUserAccount`.

## Phase 2: Feature Integration (Business Logic)

- [x] **Task 4: Avatar Component**
    - [x] Criar `src/shared/components/UserAvatar.tsx`.
    - [x] Implementar lógica de iniciais automática.
- [x] **Task 5: User Profile Hook**
    - [x] Criar `src/features/auth/hooks/useUserProfile.ts`.
    - [x] Integrar com Redux (opcional) ou manter estado local sincronizado.

## Phase 3: User Interface (UI/UX)

- [x] **Task 6: Profile Screen**
    - [x] Criar `src/screens/ProfileScreen.tsx`.
    - [x] Implementar formulário de dados básicos (Nome, Sobrenome, Telefone).
    - [x] Exibir o avatar automático.
- [x] **Task 7: Security & Privacy Screens**
    - [x] Criar `src/screens/SecurityScreen.tsx`.
    - [x] Criar `src/screens/PrivacyScreen.tsx`.
    - [x] Implementar fluxo de exportação JSON.
- [x] **Task 8: Sidebar Update**
    - [x] Consumir dados reais do perfil e exibir o `UserAvatar`.

## Phase 4: Polish & Validation (Verification)

- [x] **Task 9: Schema Migrations**
    - [x] Garantir que usuários existentes criem o perfil ao logar.
- [x] **Task 10: Final Tests**
    - [x] Validar fluxos de erro (re-auth falhando).
    - [x] Testar exclusão total de dados.
