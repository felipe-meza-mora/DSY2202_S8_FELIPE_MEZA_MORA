FROM node:20.14.0 AS build

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build --prod

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/dyf  /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]