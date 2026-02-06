# ===========================
# STAGE 1: build da aplicação
# ===========================
FROM node:20-alpine AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock/yarn/pnpm (se existirem)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Build de produção (gera pasta dist/)
RUN npm run build

# ===========================
# STAGE 2: servidor Nginx
# ===========================
FROM nginx:alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia a build do Vite para a pasta pública do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia nossa config customizada de SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão HTTP)
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
