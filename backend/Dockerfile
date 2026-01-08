FROM node:20-alpine AS builder

# Instala bibliotecas necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Gera o Prisma Client e faz o build do NestJS
RUN npx prisma generate
RUN npm run build

# --- Estágio de Produção ---
FROM node:20-alpine

# Instala bibliotecas no estágio final também
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expõe a porta padrão do Render
EXPOSE 10000

# Comando de inicialização sem o "migrate deploy" para evitar o erro P1001 no boot
CMD ["sh", "-c", "npx prisma generate && npm run start:prod"]