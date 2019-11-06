FROM node:10

RUN npm install -g @aws-amplify/cli@3.17.0

WORKDIR /jamstack

COPY package.json package-lock.json ./

RUN yarn

COPY . .

RUN cp tests/build-on-docker/fixtures/awsExportFixture.js src/
RUN npm run jamstack-build-local