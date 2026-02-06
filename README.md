# Amor de Bicho - SPA Front End
Aplicação Single Page Application (SPA) desenvolvida em React + TypeScript, com Vite, Tailwind e consumo de API pública de Pets e Tutores do Estado de Mato Grosso.

## O sistema permite:

- Gerenciar Pets (CRUD completo)
- Gerenciar Tutores (CRUD completo)
- Vincular pets aos tutores
- Autenticação com JWT
- Upload e exibição de fotos
- Layout responsivo;


---

## Tecnologias Utilizadas
### Front
- React 18  
- TypeScript  
- Axios para consumo da API  
- Tailwind CSS
- Vite 
- Axios
- React Router DOM  
 
 ### Estilização

- UI responsiva
- Glassmorphism (Login)
- Componentes modernos com animações leves

### Infra / Build

- Docker
- Nginx
- Ambiente configurado para produção
---

## 

## Estrutura do Projeto

```bash
src/
├─ components/
│   ├─ PrivateRoute.tsx         # Proteção de rotas autenticadas
│   └─ layout.css               # Estilos globais complementares
│
├─ pages/
│   ├─ LoginPage.tsx            # Tela de login (refatorada e modernizada)
│   ├─ PetsPage.tsx             # Listagem de pets + busca + botão “Listar Tutores”
│   ├─ PetFormPage.tsx          # Cadastro / edição de pets
│   ├─ PetDetailsPage.tsx       # Detalhes do pet
│   ├─ TutorsPage.tsx           # Listagem de tutores
│   ├─ TutorFormPage.tsx        # Cadastro / edição de tutor
│   └─ TutorPetsPage.tsx        # Pets vinculados ao tutor
│
├─ services/
│   ├─ api.ts                   # Configuração de Axios
│   ├─ authService.ts           # Login / token JWT
│   ├─ petsService.ts           # CRUD de pets
│   └─ tutorsService.ts         # CRUD de tutores + vinculação
│
├─ tests/
│   ├─ PetsPage.test.tsx
│   ├─ TutorsPage.test.tsx
│   ├─ LoginPage.test.tsx
│   └─ suporte de testes
│
├─ App.tsx                      # Rotas principais
└─ main.tsx                     # Bootstrap do React
```
---

## Principais Funcionalidades

### Pets
- Listagem com cards responsivos
- Upload e exibição de foto
- Busca por nome
- Paginação com API
- Edição e exclusão
- Visualização individual
- Botão de acesso rápido para listar Tutores  

### Tutores
- CRUD completo
- Upload de foto
- Exibir pets vinculados
- Vincular / desvincular pets
- Visualização detalhada

### Autenticação
- Login com JWT
- Redirecionamento após login
- PrivateRoute para proteger rotas
- Tokens armazenados com segurança  

---

## Como Executar o Projeto

### Requisitos
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
### Rodar Testes
 ```bash
npm run test
 ```

Os testes usam:

- Vitest
- @testing-library/react

 ### Rodar com Docke
 Build da imagem
 ```bash
docker build -t amor-de-bicho .
 ```
 Subir o container
```bash
docker run -p 8080:80 amor-de-bicho
 ```
 Acessar
 ```bash
http://localhost:8080
 ```

 ## Considerações finais
    Este projeto foi desenvolvido com dedicação para cumprir os requisitos propostos e oferecer uma experiência simples e funcional no gerenciamento de pets e tutores.
    Agradeço pela oportunidade de apresentar este trabalho e estou aberta a melhorias e sugestões.