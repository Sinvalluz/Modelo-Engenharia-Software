# 📄 Documento de Arquitetura de Software

---

# 1. Introdução

## 1.1 Propósito

Este documento tem como objetivo apresentar a arquitetura do software **Sistema de Controle de Despesas Pessoais (SCDP)**, descrevendo as principais decisões arquiteturais adotadas, bem como as tecnologias e padrões utilizados no desenvolvimento do sistema.

O documento serve como guia para a equipe de desenvolvimento, garantindo padronização, organização e qualidade durante a implementação do projeto.

---

## 1.2 Escopo

O **Sistema de Controle de Despesas Pessoais (SCDP)** é uma aplicação web desenvolvida com o objetivo de permitir que usuários registrem, organizem e acompanhem suas movimentações financeiras de forma simples e eficiente.

A solução contempla funcionalidades como:

- Cadastro e autenticação de usuários
- Registro de receitas e despesas
- Categorização de gastos
- Visualização de saldo

Este documento abrange:

- Organização em camadas
- Tecnologias adotadas
- Diretrizes técnicas da equipe
- Organização de branches e fluxo de desenvolvimento

---

# 2. Visão Geral da Arquitetura

## 2.1 Sumário da Arquitetura

O sistema será desenvolvido utilizando uma **arquitetura em camadas**, promovendo separação de responsabilidades (*Separation of Concerns*), facilidade de manutenção e escalabilidade.

---

## 🔧 Backend

O backend será desenvolvido utilizando o framework **NestJS**, seguindo organização modular baseada em funcionalidades.

### Estrutura de Camadas

| Camada | Responsabilidade |
|---|---|
| Controllers | Receber requisições HTTP |
| Services | Implementar regras de negócio |
| Prisma ORM | Persistência e manipulação de dados |

---

## 💻 Frontend

O frontend será desenvolvido utilizando:

- React
- Vite
- Tailwind CSS
- shadcn/ui
- React Query

Responsável pela interface com o usuário e comunicação com a API REST.

---

## 🔗 Comunicação

A comunicação entre frontend e backend ocorrerá através de uma **API REST**, utilizando métodos HTTP:

- `GET`
- `POST`
- `PUT`
- `DELETE`

---

## 2.2 Metas Arquiteturais

- Garantir arquitetura simples e organizada
- Facilitar manutenção e evolução do sistema
- Promover separação de responsabilidades
- Permitir integração eficiente entre frontend e backend
- Facilitar escalabilidade futura

---

## 2.3 Restrições Técnicas

| Categoria | Tecnologia |
|---|---|
| Linguagens | JavaScript, TypeScript, SQL |
| Backend | NestJS |
| ORM | Prisma ORM |
| Banco de Dados | PostgreSQL (Supabase) |
| Frontend | React + Vite |
| Estilização | Tailwind CSS + shadcn/ui |
| Estado/Requisições | React Query |
| Deploy | Vercel |
| Idioma | Português |

---

# 🧱 Visão Estrutural

```text
Frontend (React)
        ↓
API REST (HTTP)
        ↓
Backend (NestJS)
 ┣ Controllers
 ┣ Services
 ┗ Prisma ORM
        ↓
PostgreSQL (Supabase)
```

---

# 3. Organização de Branches

## 3.1 Estratégia de Branches

O projeto utiliza organização de branches baseada em funcionalidades, visando melhor controle das entregas e separação das implementações.

### Branch Principal

```bash
main
```

---

## 3.2 Padrão de Nomeação

| Tipo | Exemplo |
|---|---|
| Feature | `feature/register-and-login-screen` |
| Feature Backend | `feature/user-crud` |
| Refactor | `refactor/business-rules-and-dtos` |
| Fix | `fix/login-validation` |

---

## 3.3 Fluxo de Desenvolvimento

### 📌 Criação de Branch

Antes de iniciar uma nova tarefa:

1. Atualizar a branch `main`
2. Criar uma branch da funcionalidade
3. Desenvolver a task isoladamente

### Exemplo

```bash
git checkout main
git pull
git checkout -b feature/register-and-login-screen
```

---

### 📌 Commits

Os commits devem possuir descrições objetivas e relacionadas à funcionalidade implementada.

### Exemplos

```bash
feat: create login screen
feat: add user authentication
fix: validation error on register form
refactor: improve transaction service
```

---

### 📌 Pull Requests

Após finalizar a funcionalidade:

1. Enviar branch para o repositório
2. Abrir Pull Request
3. Solicitar revisão
4. Realizar merge após validação

---

## 3.4 Branches Atuais do Projeto

Atualmente o projeto possui branches relacionadas às seguintes funcionalidades:

- `feature/cruds-transaction-category`
- `feature/record-of-income-and-expenses`
- `feature/register-and-login-screen`
- `feature/user-crud`
- `refactor/business-rules-and-dtos`

---

# 🔐 Segurança

Devido à natureza sensível dos dados financeiros, o sistema deverá garantir:

- Autenticação individual por usuário
- Armazenamento seguro de senhas
- Isolamento de dados por usuário
- Validação de entradas
- Proteção contra acessos indevidos

---

# 📌 Observações

- A arquitetura poderá sofrer alterações conforme evolução das sprints
- O documento deve ser atualizado sempre que houver mudanças estruturais relevantes
- O fluxo de branches deve ser seguido por toda a equipe
- O sistema possui finalidade acadêmica