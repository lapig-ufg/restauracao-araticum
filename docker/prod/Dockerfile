FROM registry.lapig.iesa.ufg.br/lapig-images-homol/app_araticum:base

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/lapig-ufg/restauracao-araticum.git"
ENV BRANCH="main"

LABEL maintainer="Renato Gomes <renatogomessilverio@gmail.com>, Jairo Matos da Rocha <devjairomr@gmail.com>"

RUN cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB}

ADD ../../src/server/node_modules /APP/restauracao-araticum/src/server/node_modules
ADD ./src/client/dist/client /APP/restauracao-araticum/src/client/dist/client

WORKDIR /APP/restauracao-araticum
CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
