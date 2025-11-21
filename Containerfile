FROM docker.io/node:24-alpine3.22
WORKDIR /todo-app

# Install nodejs and pnpm
RUN npm install --global pnpm

# Copy packaging files and install dependencies
# This prevents re-running the installation if the application
# changes but the dependencies do not.
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy over the rest of the application
COPY src/ ./src

ENV NODE_ENV "production"
ENV DATA_DIR "/data"
ENV TODO_PORT 3000

EXPOSE 3000
CMD ["node", "src/app.js"]
