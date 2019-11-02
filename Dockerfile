FROM nodesource/node:9

ADD package.json package.json
RUN npm install
ADD . .
