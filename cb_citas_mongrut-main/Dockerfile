FROM node:21-alpine3.18 as builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Copiamos package.json y el lock file primero para aprovechar el cache
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && apk add --no-cache git \
    && pnpm install \
    && apk del .gyp

# Luego copiamos el resto de los archivos y construimos el proyecto
COPY . .

RUN pnpm run build

FROM node:21-alpine3.18 as deploy

WORKDIR /app

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

# Copiamos los archivos necesarios desde el builder
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

RUN npm cache clean --force && pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
    && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

# Usamos pnpm para arrancar la app
CMD ["pnpm", "start"]
