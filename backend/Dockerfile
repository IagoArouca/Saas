FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma e faz o build do NestJS
RUN npx prisma generate
RUN npm run build

# --- Estágio Final ---
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário do estágio de builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Gera o prisma novamente para garantir os binários no alpine
RUN npx prisma generate

EXPOSE 10000

# Roda as migrações e inicia o servidor
CMD npx prisma migrate deploy && npm run start:prodS