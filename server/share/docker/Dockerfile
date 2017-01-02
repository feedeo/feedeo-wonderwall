FROM node:slim

MAINTAINER hugo@feedeo.io

# Set version information available for runtime
ARG FEEDEO_VERSION
ENV FEEDEO_VERSION $FEEDEO_VERSION
ARG FEEDEO_VERSION_COMMIT
ENV FEEDEO_VERSION_COMMIT $FEEDEO_VERSION_COMMIT
ARG FEEDEO_VERSION_BUILD_DATE
ENV FEEDEO_VERSION_BUILD_DATE $FEEDEO_VERSION_BUILD_DATE

# Create app directory
RUN mkdir -p /opt/feedeo-ebba-service
WORKDIR /opt/feedeo-ebba-service

# Install app dependencies
COPY package.json /opt/feedeo-ebba-service
RUN npm install --production

# Install NewRelic agent
COPY share/newrelic/newrelic.js /opt/feedeo-ebba-service

# Bundle app source
COPY src /opt/feedeo-ebba-service/src
COPY locale /opt/feedeo-ebba-service/locale
COPY share /opt/feedeo-ebba-service/share

EXPOSE 3000
CMD [ "npm", "start" ]
