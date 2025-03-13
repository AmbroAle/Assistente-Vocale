FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install ; npm run build ; npm prune --production
EXPOSE 80
CMD ["node", "index.js"]



