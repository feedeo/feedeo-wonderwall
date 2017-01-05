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

Verify that it is running:
```
curl https://wonderwall.feedeo.io/query/hugo
```
```
[
   {
      "type":"image/png",
      "width":500,
      "height":500,
      "size":21150,
      "url":"http://blog.sqlauthority.com/i/a/errorstop.png",
      "thumbnail":{
         "url":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQAH6xtOwka5RLOCEvnoT46TTbdr260WaqozdO9CJRDy6OXsjShORe41s6M",
         "width":130,
         "height":130
      }
   }
]
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
