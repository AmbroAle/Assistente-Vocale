FROM node:22.14.0-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["npm", "start"]



