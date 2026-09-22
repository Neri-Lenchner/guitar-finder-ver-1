# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_ADDRESS=""
RUN npm run build

# Stage 2 — serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
# Rendered from the template at container start via envsubst (nginx's built-in
# docker-entrypoint.d hook). Defaults to the production backend; overridden to the
# local `backend` service by docker-compose.yml. NGINX_ENVSUBST_FILTER restricts
# substitution to BACKEND_ORIGIN only, so nginx's own $variables (e.g. $remote_addr,
# $uri) in the template are left alone instead of being blanked out.
ENV BACKEND_ORIGIN=https://guitar-finder-ver-1-production-396a.up.railway.app
ENV NGINX_ENVSUBST_FILTER=^BACKEND_ORIGIN$
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
