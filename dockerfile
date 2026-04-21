# Stage 1: Frontend Builder
FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./frontend/package*.json /app

RUN npm install

COPY ./frontend /app

RUN npm run build
# this command will create a dist folder in the frontend directory /app/dist

# Stage 2: Final Stage
FROM node:20-alpine

WORKDIR /app

COPY ./backend/package*.json /app

RUN npm install

COPY ./backend /app
# this command will copy the dist folder from the frontend_builder stage to the backend stage

COPY --from=frontend_builder /app/dist /app/public

EXPOSE 3000

CMD ["node", "server.js"]