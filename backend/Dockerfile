FROM node:20-alpine AS builder

# Adiciona o OpenSSL para o Prisma funcionar no Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# --- Estágio de Produção ---
FROM node:20-alpine

# Também precisamos do OpenSSL no estágio final de execução
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 10000

CMD npx prisma migrate deploy && npm run start:prod