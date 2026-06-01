# Feature Specification: Gestão de Conta do Usuário

**Feature Branch**: `feature/user-manage`

**Created**: 2026-05-30

**Status**: Draft

**Input**: Projeta e implementar um módulo completo de Gestão de Conta do Usuário, considerando segurança, privacidade, escalabilidade e UX.

## User Scenarios & Testing

### User Story 1 - Meu Perfil (Priority: P1)

Como usuário autenticado, quero visualizar e editar meus dados básicos (nome, sobrenome, telefone) para manter meu perfil atualizado.

**Why this priority**: É a base da identidade do usuário no sistema e permite personalização.

**Independent Test**: Usuário logado acessa "Ajustes > Meu Perfil", altera o nome, salva e ao atualizar a página o novo nome permanece.

**Acceptance Scenarios**:
1. **Given** usuário logado, **When** acessa tela de perfil, **Then** vê campos pré-preenchidos com dados atuais.
2. **Given** campos alterados corretamente, **When** clica em "Salvar", **Then** recebe feedback de sucesso e dados são persistidos no Firestore.

---

### User Story 2 - Avatar Automático (Priority: P2)

Como usuário, quero ter um avatar gerado automaticamente a partir das minhas iniciais para facilitar minha identificação visual sem precisar gerenciar arquivos de imagem.

**Why this priority**: Melhora a UX de forma simples, mantendo a privacidade e reduzindo a complexidade do sistema (zero armazenamento de imagens).

**Independent Test**: Usuário altera seu nome no perfil, e o avatar na Sidebar reflete as novas iniciais instantaneamente.

**Acceptance Scenarios**:
1. **Given** usuário com nome "Guilherme Teixeira", **When** exibido no app, **Then** o avatar mostra "GT".
2. **Given** usuário altera nome para "Gui", **When** salvo, **Then** o avatar mostra "GU".

---

### User Story 3 - Segurança da Conta (Priority: P1)

Como usuário, quero alterar minha senha e e-mail de forma segura para proteger minha conta.

**Why this priority**: Segurança básica e crítica para um app financeiro.

**Independent Test**: Usuário solicita alteração de e-mail, recebe confirmação no novo e-mail e só então a troca é efetivada.

**Acceptance Scenarios**:
1. **Given** senha atual confirmada, **When** digita nova senha válida, **Then** sistema atualiza credenciais no Firebase Auth.
2. **Given** solicitação de troca de e-mail, **When** fluxo de re-autenticação concluído, **Then** sistema envia verificação para o novo endereço.

---

### User Story 4 - Privacidade e Esquecimento (Priority: P2)

Como usuário, quero exportar meus dados financeiros ou excluir minha conta permanentemente de acordo com as leis de privacidade (LGPD).

**Why this priority**: Conformidade legal e respeito à autonomia do usuário.

**Independent Test**: Ao clicar em "Baixar meus dados", um arquivo JSON com todas as transações, categorias e metas é gerado.

**Acceptance Scenarios**:
1. **Given** solicitação de exclusão, **When** confirmada com senha, **Then** sistema remove dados do Firestore e deleta o usuário do Auth.
2. **Given** solicitação de exportação, **When** clicado, **Then** inicia download imediato dos dados em formato estruturado.

---

## User Experience Consistency

- **Existing Patterns Reused**: Segue o design system iOS-style (cinza escuro `#1C1C1E`, azul `#0A84FF`, fontes reduzidas).
- **States Covered**: 
    - Loading (Skeleton nos campos de perfil).
    - Success (Toasts discretos).
    - Error (Badges vermelhos abaixo dos inputs).
- **Responsive/Device Considerations**: Mobile-first com suporte a Sidebar no Desktop.
- **Intentional Deviations**: Uso de Modais de confirmação crítica para exclusão de conta, destoando de ações simples de salvamento.

## Offline, Sync, and Privacy

- **Offline Behavior**: Permite edição local, mas as alterações de segurança exigem conectividade imediata.
- **Sync/Reconciliation Rule**: Perfil é a "Single Source of Truth" no Firestore; alterações locais são descartadas se o sync falhar por permissão.
- **Sensitive Data Handling**: E-mail e telefone são armazenados no Firestore para busca/indexação, mas protegidos por regras de `auth.uid`. Senhas nunca tocam o banco de dados (gerenciadas pelo Firebase Auth).

## Requirements

### Functional Requirements

- **FR-001**: O sistema deve criar automaticamente um documento em `/users/{uid}` no primeiro login se não existir.
- **FR-002**: O sistema deve gerar dinamicamente um avatar a partir das iniciais do nome do usuário.
- **FR-003**: O sistema deve oferecer opção de exportação de dados em JSON/CSV.
- **FR-004**: O sistema deve exigir re-autenticação para ações críticas (troca de senha, troca de e-mail, exclusão de conta).
- **FR-005**: O sistema deve suportar configurações de localização (Moeda: BRL/USD, Idioma: PT/EN).

### Key Entities

- **User Profile**:
    - `firstName`, `lastName`, `displayName`, `phoneNumber`, `currency`, `language`, `timezone`, `country`, `createdAt`, `lastLogin`.

## Data Model (Firestore)

**Collection**: `/users/{uid}`

```typescript
interface UserProfile {
  id: string; // uid
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
  preferences: {
    currency: 'BRL' | 'USD';
    language: 'pt-BR' | 'en-US';
    theme: 'dark'; // hardcoded for now
    privacyMode: boolean; // link with privacyStore.ts
  };
  metadata: {
    createdAt: string; // ISO
    lastLogin: string; // ISO
    version: number; // For schema migrations
  }
}
```

## Security Rules (Firestore)

```javascript
match /users/{userId} {
  // Apenas o próprio usuário lê e escreve seu perfil
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Success Criteria

- **SC-001**: Tempo de carregamento da tela de perfil < 1s após login.
- **SC-002**: Avatares são gerados e exibidos sem latência de rede.
- **SC-003**: Exclusão de conta limpa 100% dos dados relacionados em < 10s.

## Assumptions

- O Firebase Auth continuará sendo o provedor de identidade.
- Usuários têm e-mails válidos para fluxos de recuperação.
