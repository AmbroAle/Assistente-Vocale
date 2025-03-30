FROM node:22.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN mkdir -p /ai/files && touch /ai/files/google_docs_output.json
COPY . /app
EXPOSE 8000
CMD ["npm", "run", "dev"]