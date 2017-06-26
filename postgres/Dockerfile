FROM library/postgres:9.6.3

ENV POSTGRES_PASSWORD password
ENV POSTGRES_INITDB_ARGS "--data-checksums"

COPY ./docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/