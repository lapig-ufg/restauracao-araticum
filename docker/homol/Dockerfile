FROM lapig/restauracao-araticum:base

LABEL maintainer="Guilherme Freire <guilherme.fspe@gmail.com>"

ENV NODE_ENV=develop

ADD . /app/restauracao-araticum
COPY ./version.jso* /app/restauracao-araticum/src/client/dist/restauracao-araticum/assets/

WORKDIR /app/restauracao-araticum/src/server