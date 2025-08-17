# ---------- build ----------
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # результат → /app/dist

# ---------- runtime ----------
FROM nginx:alpine
# адрес публикации 1С подаём через переменную окружения
ENV ONEC_URL=
COPY docker/nginx.tmpl.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["sh", "-c", "envsubst '$$ONEC_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
