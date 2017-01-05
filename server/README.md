## Server

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)    

### Install

#### Download source code and install dependencies

```
git clone https://github.com/feedeo/feedeo-wonderwall.git && \
cd feedeo-wonderwall/server && \
npm install
```

### Available environment variables

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

#### Start server
Note: Default port 2495

```
npm start
```

### Server calls

Call to get images for a search term
```
http://<server>:3000/query/<query string>
```

### Deploy

#### Building and pushing the docker container

**Note:** Need to install `docker` for building and pushing.

```
npm run build && npm run push
```
