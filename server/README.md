## Server

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)    

### Install

#### Download source code and install dependencies

```
git clone https://github.com/feedeo/feedeo-wonderwall.git && \
cd feedeo-wonderwall/server && \
npm install
```

### Develop

#### Local developing and testing

```
npm start
```

Server calls should be made like:
```
http://localhost:2495/query/<query string>
```

### Configure

#### Environment variables
```
FEEDEO_PORT
FEEDEO_ENVIRONMENT
RABBITMQ_HOSTNAME
RABBITMQ_USERNAME
RABBITMQ_PASSWORD
RABBITMQ_QUEUE
ROLLBAR_API_KEY
GOOGLE_IMAGES_ID
GOOGLE_IMAGES_API_KEY
```

### Deploy

#### Building and pushing the docker container

**Note:** Need to install `docker` for building and pushing.

```
npm run build && npm run push
```
