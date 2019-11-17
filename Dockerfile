# Builder stage
FROM node:12-alpine AS builder
WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm install
ENV NODE_ENV=production
RUN npm run build

# Runtime stage (production part)
FROM node:12-alpine AS runtime
RUN apk --no-cache add ca-certificates
WORKDIR /app
ENV NODE_ENV=production

COPY .npmrc ./
COPY package*.json ./
COPY --from=builder /app/dist/ dist/

RUN npm install --only=production

CMD [ "node", "./dist/index.js" ]