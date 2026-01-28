# Amor de Bicho - SPA Front End

## Descrição do Projeto
Este projeto é uma SPA (Single Page Application) em **React + TypeScript** que consome a API pública de registro de pets e tutores do Estado de Mato Grosso.  
O objetivo é permitir **cadastrar, editar, excluir e visualizar pets e tutores**, além de vincular pets aos seus respectivos tutores.

---

## Tecnologias Utilizadas
- React 18 + TypeScript  
- Axios para consumo da API  
- Tailwind CSS para estilização responsiva  
- Vite como bundler e dev server  
- React Hooks (`useState`, `useEffect`) para gerenciamento de estado local  

---

## Estrutura do Projeto

```bash
csrc/
├─ components/
│ ├─ TutorForm.tsx # Formulário de cadastro/edição de tutores
│ ├─ Tutors.tsx # Listagem de tutores e vinculação de pets
├─ services/
│ ├─ authService.ts # Login e refresh de token
│ ├─ petsService.ts # Métodos para pets (getPets)
│ ├─ tutorsService.ts # Métodos para tutores (CRUD + vinculação pets)
├─ App.tsx # Componente principal
├─ main.tsx # Entrada do React 
```
---

## Funcionalidades Implementadas

### Pets
- Listagem de pets em **cards responsivos** (foto, nome, espécie, idade)  
- Busca por nome  
- Paginação (10 por página)  
- Detalhamento de pets (em desenvolvimento)  

### Tutores
- CRUD completo de tutores (`getTutors`, `getTutorById`, `createTutor`, `updateTutor`)  
- Vinculação e desvinculação de pets com tutor (`linkPetToTutor`, `unlinkPetFromTutor`)  
- Formulário de cadastro/edição com upload de foto  

### Autenticação
- Login via API (`authService.ts`)  
- Token JWT gerenciado localmente  
- Refresh token disponível  

---

## Como Executar

### Pré-requisitos
- Node.js >= 18  
- npm >= 9  

### Passos
1. Clonar o repositório:  
```bash
git clone <url-do-repositorio>
cd amor-de-bicho
```

### Instalar dependências:
```bash
npm install
 ```

### Rodar o servidor de desenvolvimento:
```bash
npm run dev
 ```
 ### Abrir no navegador:
 ```bash
http://localhost:5173
 ```