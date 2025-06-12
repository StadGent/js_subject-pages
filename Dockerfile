FROM madnificent/ember:5.4.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM semtech/ember-proxy-service:1.5.1

ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|@appuniversum)/"
COPY --from=builder /app/dist /app
