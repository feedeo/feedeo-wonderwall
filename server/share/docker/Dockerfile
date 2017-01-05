FROM node:6-slim

MAINTAINER hugo@feedeo.io

# Set version information available for runtime
ARG FEEDEO_VERSION
ENV FEEDEO_VERSION $FEEDEO_VERSION
ARG FEEDEO_VERSION_COMMIT
ENV FEEDEO_VERSION_COMMIT $FEEDEO_VERSION_COMMIT
ARG FEEDEO_VERSION_BUILD_DATE
ENV FEEDEO_VERSION_BUILD_DATE $FEEDEO_VERSION_BUILD_DATE

# Create app directory
RUN mkdir -p /opt/wonderwall
WORKDIR /opt/wonderwall

# Install app dependencies
COPY package.json /opt/wonderwall
RUN npm install --production

# Install NewRelic agent
COPY share/newrelic/newrelic.js /opt/wonderwall

# Bundle app source
COPY src /opt/wonderwall/src

EXPOSE 2495
CMD [ "npm", "start" ]
