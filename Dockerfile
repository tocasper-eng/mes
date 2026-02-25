FROM node:18-alpine

WORKDIR /app

# 安裝後端相依套件
COPY server/package*.json ./
RUN npm install --production

# 複製後端程式碼
COPY server/ .

EXPOSE 3000

CMD ["node", "index.js"]
