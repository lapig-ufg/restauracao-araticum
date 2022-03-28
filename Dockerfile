FROM registry.lapig.iesa.ufg.br/lapig-images-homol/app_araticum:base 

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/lapig-ufg/restauracao-araticum.git"
ENV BRANCH="develop"

LABEL maintainer="Renato Gomes <renatogomessilverio@gmail.com>"

RUN cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB} && \
    cd /APP/restauracao-araticum/src/server && npm install && rm -rf /APP/plataform-base
    
ADD ./src/client/dist/client /APP/restauracao-araticum/src/client/dist/client

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
