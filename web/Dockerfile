FROM node:8.1

# https://intercityup.com/blog/downsizing-docker-containers.html
RUN apt-get update \
  && apt-get -y install postgresql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 8000
ENV DIR /usr/src/app
RUN mkdir -p $DIR
WORKDIR $DIR

# Cache node_modules
# https://github.com/yarnpkg/yarn/issues/749
COPY package.json yarn.lock $DIR/
RUN yarn install --pure-lockfile

COPY . $DIR/
RUN npm run build

# Wait for Postgres and then execute
# https://docs.docker.com/compose/startup-order/
CMD ./docker/wait-for-it.sh -h $PEDRO_DB_HOSTNAME -p 5432 -- ./node_modules/.bin/db-migrate up --env=production && npm run serve