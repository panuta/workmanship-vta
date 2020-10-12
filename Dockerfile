FROM node:14-stretch-slim as build
USER root

# Building client
RUN mkdir -p /usr/src/client
WORKDIR /usr/src/client

RUN chown -R root:root .

COPY client/public ./public
COPY client/src ./src
COPY client/package.json ./

RUN npm install
RUN npm run build

# Building server
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

RUN chown -R root:root .

COPY server/src ./src
COPY server/.babelrc ./
COPY server/package.json ./

RUN npm install
RUN npm run build

# ------------------------------------------------------------

FROM node:14-stretch-slim
USER root

RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copy server files
COPY --from=build /usr/src/server/dist ./dist

# Copy client files
RUN mkdir -p /usr/app/dist/static
COPY --from=build /usr/src/client/build ./dist/static/

COPY ./server/package.json .

RUN npm install --production

COPY entrypoint.sh .
RUN chmod a+x entrypoint.sh

RUN useradd -ms /bin/bash appuser
RUN chown -R appuser:appuser .

ENV NODE_ENV production
EXPOSE 3000

USER appuser
CMD [ "/usr/app/entrypoint.sh"]
