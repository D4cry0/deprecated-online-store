FROM node:18-alpine AS base
# libc6 es una libreria que se agrega a nodejs algunas aplicaciones puede que la necesiten
# es recomendable instalar esta version cuando node esta dentro de Docker
RUN apk add --no-cache libc6-compat
RUN apk add openssl
RUN apk add zlib

# Instalar dependencias de desarrollo
FROM base AS dev-deps
WORKDIR /app
COPY prisma ./prisma            
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install @prisma/client
RUN npx prisma generate

#Instalar las dependencias de produccion
FROM base AS prod-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY prisma ./prisma   
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
RUN npm install @prisma/client
RUN npx prisma generate


# Construccion
FROM base AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# Para que Nextjs no recolecte informacion de uso
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Produccion
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 ecom
RUN adduser --system --uid 1001 ecom && addgroup ecom node
#Dependencias de desarrollo
COPY --from=prod-deps --chown=ecom:ecom /app/node_modules ./node_modules
COPY --from=builder --chown=ecom:ecom /app/locales ./src/client/locales
COPY --from=builder --chown=ecom:ecom --chmod=0755 /app/cmd.sh ./

# NextJs
COPY --from=builder --chown=ecom:ecom /app/src/client/public ./src/client/public
COPY --from=builder --chown=ecom:ecom /app/src/client/styles ./src/client/styles
# Ojo se necesita el modo standalone en el archivo de configuracion de nextjs
COPY --from=builder --chown=ecom:ecom /app/src/client/.next/standalone/src/client ./src/client/
COPY --from=builder --chown=ecom:ecom /app/src/client/.next/static ./src/client/.next/static

#NestJs
COPY --from=builder --chown=ecom:ecom /app/dist ./dist
COPY --from=builder --chown=ecom:ecom /app/src/server/ssl ./src/server/ssl

# Para no usar root
USER ecom
EXPOSE 3000
EXPOSE 4000

CMD ["sh", "cmd.sh"]