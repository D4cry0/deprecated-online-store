FROM node:18-alpine AS base
# libc6 es una libreria que se agrega a nodejs algunas aplicaciones puede que la necesiten
# es recomendable instalar esta version cuando node esta dentro de Docker
RUN apk add --no-cache libc6-compat
RUN apk add openssl
RUN apk add zlib

WORKDIR /app

COPY . /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
#ENV PORT=5000

RUN npm install
RUN npm run build

RUN rm .env

RUN addgroup --system --gid 1001 ecom
RUN adduser --system --uid 1001 ecom && addgroup ecom node

RUN chown -R ecom:ecom /app

USER ecom
EXPOSE 5000

CMD ["npm", "run", "start"]