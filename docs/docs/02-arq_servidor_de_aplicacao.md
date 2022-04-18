# Servidor de Aplicação

Basicamente o Cerrado DPAT é dividido em duas partes: o *WebMap Client* e o *Application Server*, conforme descrito anteriormente. O código-fonte para estas duas partes está hospedado no [respositório Github](https://github.com/lapig-ufg/d-pat) do projeto.


Dentro do repositório do projeto, o código-fonte do *Application Server* está em [src/server](https://github.com/lapig-ufg/d-pat/tree/master/src/server). Por ser construído em NodeJS, ao clonar o projeto o usuário deverá navegar até a pasta server e instalar as dependências gerenciadas pelo [Node Package Manager (NPM)](https://www.npmjs.com/) através do comando:

```
npm install
```

Em seguida, deve-se copiar o arquivo .env.exemple renomeando-o para .env:

```
cp .env.exemple .env
```

Em seguida, deve-se alterar o arquivo .env com as devidas configurações e parâmetros referentes ao banco de dados, pastas para armazenamento dos arquivos de Upload e Download e endereço de hospedagem do OWS Server. Um exemplo de arquivo .env pode ser observado na [seção](/02-arq_execucao_dpat/#execucao-da-aplicacao-cerrado-dpat)

Por fim, a fim de facilitar a execução do *Application Server* foi desenvolvido um script nomeado `start.sh` localizado na raiz da pasta **src/server**. Portanto, basta realizar a execução deste arquivo para inicializar o *Application Server*. A fim de identificar modificações em tempo real, o *Application Server* faz uso da biblioteca [`always`](https://www.npmjs.com/package/always), portanto talvez seja necessário a instalação da mesma através do comando.

``` sh
$ sudo npm install always -g
```

Após a instalação do *always*, pode-se inicializar o *Application Server* através do comando:

``` sh
$ ./src/server/start.sh
```



## Middleware para manipulação do banco de dados

Para facilitar a criação de serviços que fazem uso de consultas ao banco de dados foi criado um *middleware* nomeado [`dataInjector.js`](https://github.com/lapig-ufg/d-pat/blob/master/src/server/middleware/data-injector.js) que cria um *pool* de conexões para execução de diversas *queries* simultâneas. 

O `dataInjector.js` analisa a URL da requisição HTTP de modo a associar a função que especifica a query (por meio da tupla {id, sql}) com o controlador que irá devolver a resposta da requisição.

Portanto, todas as URLs deverão ser criadas no seguinte padrão:

```
'/service/<nome_arquivo_js_com_query>/<nome_funcao_executada>'
```

## Como criar um novo serviço

O *Application Server* possui três pastas que armazenam os principais arquivos que permitem a disponibilização de um novo serviço ao Cerrado DPAT: 

1. **Controller:**: Os arquivos nesta pasta são responsáveis por processar implementar a lógica da tarefa passada pela requisição HTTP.
2. **Database**: Os arquivos nesta pasta são responsáveis por implementar os métodos com as *queries* a serem executadas no banco de dados. Devido a estrutura do `dataInjector.js`, mais de uma *query* poderá ser executada durante uma mesma requisição.
3.  **Routes**: Os arquivos desta pasta são os responsáveis por criar as URLs de acesso *(endpoint)* a um serviço, apontar qual o controlador deverá processar a lógica para a requisição e, caso necessário, injetar o acesso ao banco de dados.

Portanto, supondo que queremos criar um novo serviço para retornar os maiores desmatamentos em um determinado ano detectado pelo PRODES-Cerrado é necessário criar/alterar os seguintes arquivos:

    server/routes/example.js
``` js
module.exports = function (app) {

	var dataInjector = app.middleware.dataInjector
	var example = app.controllers.examplecontroller;

	app.get('/service/examplequery/largest', dataInjector, example.largest);

}
```
Após a criação do *endpoint* de acesso, basta criar o arquivo com as funções desta classe de *queries* (`examplequery.js`) e a função (`Query.largest`) que irá executar a *query* especificada. Vale ressaltar que deverá ser passado dois parâmetros pela requisição, o **year** e o **amount**, que indicam de qual ano e a quantidade de desmatamentos que o usuário quer encontrar.

    server/database/queries/examplequery.js
``` js
module.exports = function (app) {

    var Query = {};
    
    Query.largest = function (params) {
    
    return [{
			id: 'largest_id',
			sql: "SELECT view_date,county,uf, ST_ASGEOJSON(geom) FROM prodes_cerrado WHERE year = ${year} ORDER BY areamunkm DESC LIMIT ${amount}"
		}]
    };

    return Query;
}
```
Após a construção do método e a *query*, basta criar o controlador `examplecontroller.js` para receber a requisição, realizar a chamada ao método para execução da *query*, coletar o resultado e enviar como resposta da requisição.

    server/controllers/examplecontroller.js
``` js
module.exports = function (app) {

    const config = app.config;
    
	var Controller = {}

	Controller.largest = function (request, response) {

		var queryResult = request.queryResult['largest_id']

		response.send(queryResult)
		response.end()

    }
    
    return Controller;
}
```

Por fim, este por se tratar de uma requisição HTTP do tipo `GET`, a mesma poderá ser acessada via navegador. Considerando que o server está executando em `localhost:3000` e o usuário deseja encontrar os 15 maiores desmatamentos detectados pelo PRODES-Cerrado em 2019, a URL de acesso ficará da seguinte forma: 

``` url
http://localhost:3000/service/examplequery/largest?year=2019&amount=15
```

A visualização do JSON resultado da requisição acima pode ser observado no [link](https://cerradodpat.ufg.br/service/deforestation/largest?year=2019&amount=15).

Além de requisitar pelo navegador, o serviço também poderá ser requisitado pelo *WebMap Client* a fim de disponibilizar este dado na plataforma Cerrado DPAT. Para tal, o mesmo poderá ser feito via biblioteca [HttpClient](https://angular.io/api/common/http/HttpClient) do Angular e assim obter o arquivo JSON com os dados processados. Considerando que a variável `http` foi devidadmente injetada no construtor da classe do Angular, o método `getLargest()` abaixo deverá realizar a requisição e armazenar seu resultado na variável `dados_largest`:




    client/src/app/views/map.component.ts
``` js
getLargest() {
 
    let url = '/service/examplequery/largest?year=2019&amount=15'

    this.http.get(url).subscribe(r => {
        this.dados_largest = r;
    });
}
```


