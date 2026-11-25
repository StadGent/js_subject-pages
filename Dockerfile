FROM madnificent/ember:5.12.0 AS builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.30
COPY docker/static-file-service.sh /static-file-service.sh
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /data
COPY nginx/ /config
EXPOSE 80
CMD ["/bin/bash", "/static-file-service.sh"]
