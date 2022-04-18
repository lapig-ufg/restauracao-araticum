# Dados Rasters
Os dados Rasters são imagens com informações geográficas e estão armazenados no sistema de arquivos do servidor. A configuração da pasta do local de armazenamento destes arquivos é feita no *OWS Server* na linha 54 do arquivo [config.js](https://github.com/lapig-ufg/lapig-maps/blob/master/src/ows/config.js), através da variável `config['path_catalog']`. Esta configuração deverá apresentar a pasta com o catálogo de dados a serem disponibilizados no OWS Server.

## Estrutura de diretórios

Todos os dados geográficos Raster do projeto podem ser encontrados no [link](https://drive.google.com/file/d/1L2pW2PudSsmwGQMhPGXbZd5sJvBmEcSW/view?usp=sharing).

Após a descompactação do arquivo `DADOS_RASTER_CATALOG_FIP_CERRADO.tar.gz` os dados estão armazenados em diferentes subpastas. Considerando os dados catalogados na seção [Dados Geográficos](01-guia_dados_geograficos.md) e o diretório configurado no `config.js` temos os seguintes dados em formato raster:

| Dado                                                                                                       | Nome do arquivo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                       Subpasta |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------: |
| [Susceptibilidade a Desmatamentos Grandes](01-guia_dados_geograficos.md#Susceptibilidade ao desmatamento)  | bi_ce_susceptibilidade_desmatamento_maiores_100_na_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                           /FIP |
| [Susceptibilidade a Desmatamentos Pequenos](01-guia_dados_geograficos.md#Susceptibilidade ao desmatamento) | bi_ce_susceptibilidade_desmatamento_menores_100_na_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                           /FIP |
| [Altitude](01-guia_dados_geograficos.md#Altitude)                                                          | bi_ce_srtm_altitude_30_2000_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                        /Relevo |
| [Declividade](01-guia_dados_geograficos.md#Declividade)                                                    | bi_ce_srtm_declividade_30_2000_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                        /Relevo |
| [Média da Precipitação Acumulada](01-guia_dados_geograficos.md#Média da Precipitação Acumulada)            | bi_ce_precipitacao_historica_30_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                          /Água |
| [Mosaico Landsat 2000-2019](01-guia_dados_geograficos.md#Mosaico Landsat)                                  | bi_ce_mosaico_landsat_completo_30_2000_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2002_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2004_fip.tif <br/>   bi_ce_mosaico_landsat_completo_30_2006_fip.tif  <br/>  bi_ce_mosaico_landsat_completo_30_2008_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2010_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2012_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2013_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2014_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2015_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2016_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2017_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2018_fip.tif <br/> bi_ce_mosaico_landsat_completo_30_2019_fip.tif <br/> |    /img_satelites/bi_ce_mosaico_landsat_30_fip |
| [Mosaico Sentinel 2016-2019](01-guia_dados_geograficos.md#Mosaico Landsat)                                 | bi_ce_mosaico_sentinel_10_2016_lapig.tif <br/> bi_ce_mosaico_sentinel_10_2017_lapig.tif <br/> bi_ce_mosaico_sentinel_10_2018_lapig.tif <br/> bi_ce_mosaico_sentinel_10_2019_lapig.tif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | /img_satelites/bi_ce_mosaico_sentinel_10_lapig |



## Processo de atualização

### Mosaicos Landsat
Os mosaicos Landsat disponibilizados para visualização no Cerrado DPAT são os mesmos utilizados pelo INPE para inspeção visual e detecção das áreas desmatadas pelo sistema PRODES-Cerrado. Tais imagens podem ser [baixadas pelo portal Earth Explorer](https://earthexplorer.usgs.gov/) de acordo com a data e a órbita-ponto presentes no arqivo shapefile [disponibilizado pelo INPE no portal Terrabrasilis](http://terrabrasilis.dpi.inpe.br/download/dataset/cerrado-prodes/vector/yearly_deforestation_2002_2019_cerrado_biome.zip). Após o download do arquivo compactado correspondente a cada imagem, devem ser criadas composições multibandas com as bandas do vermelho, infravermelho, e infravermelho de ondas curtas. Uma outra forma mais simples para a obtenção destas imagens é o contato direto com a equipe do LAPIG através do e-mail cerradodpat.lapig@ufg.br.

Com as imagens devidamente armazenadas, dois scripts correspondentes ao recorte do limite util da cena e a criação do mosaico das imagens de cada ano são executados simultaneamente por meio da execução do arquivo [run.sh](sh/run.sh) , que irá chamar o arquivo [clip_landsat.sh](sh/clip_landsat.sh). No arquivo run.shp é necessário que se edite as seguintes linhas:

``INPUT_DIR=""`` Diretório "raiz" para as cenas isoladas de cada ano (linha 3).  
``OUTPUT_DIR=""`` Diretório de saída com os mosaicos de cada ano (linha 4).  
``DIRS=""`` Diretórios com os anos a serem mosaicados. (linha 5)  

No arquivo clip_landsat.sh, a edição é feita na seguinte linha:

``INPUT_GRID=""`` Arquivo no formato shapefile com os limites das cenas Landsat. (linha 10)

Após as edições deve-se executar o seguinte comando:

```
sh run.sh
```

As imagens no formato TIF de cada ano estarão disponiveis na pasta apontada em ``OUTPUT_DIR``. 

### Mosaicos Sentinel-2

As imagens Sentinel-2 foram baixadas por meio da plataforma [Google Earth Engine](https://earthengine.google.com/). Devido a caracteristica sazonal do bioma Cerrado, um mesmo alvo pode apresentar diferentes respostas espectrais durante os diferentes meses do ano. Assim, para que o mosaico apresentasse um padrão mais homogêneo entre as cenas, buscou-se por imagens dentro de um curto periodo de tempo. Foram priorizadas imagens para o periodo de um mês. No caso da indisponibilidade de imagens sem nuvens, o periodo foi estendido até que o intervalo entre maio e outubro fosse alcançado. Destaca-se também que diferentes padrões climáticos podem ser encontrado no bioma, dificultando assim a identificação de imagens sem nuvens. Dessa forma, diferentes geometrias foram criadas para a seleção de imagens em regiões específicas (ex: norte do bioma, próximo ao litoral maranhense). O código para o download do mosaico Sentinel-2 [encontra-se disponivel para acesso](https://code.earthengine.google.com/e45dab08c30a7e688558032a30382792).

Devido ao limite de tamanho o mosaico baixado é dividido em tiles. A junção dos tiles em um único arquivo é feita a partir dos comandos gdalbuildvrt e gdal_translate presentes no pacote [GDAL](https://gdal.org/python/).

```
gdalbuildvrt mosaic_"$ano".vrt mosaic_"$ano"* -srcnodata 0 -vrtnodata 0

gdal_translate mosaic_"$ano".vrt mosaic_"$ano".tif -co COMPRESS=LZW -co BIGTIFF=YES -co TILED=YES -a_nodata 0
```

Onde `$ano` é o ano de cada mosaico, presente no nome dos tiles correspondentes a imagem baixada.

### Disponibilização no OWS Server

Após a criação dos arquivos únicos para os mosaicos Landsat e Sentinel, antes de disponibilizar o mosaico ao OWS Server é necessário a criação das pirâmides para níveis diferentes de visualização do mosaico. Para criar a visualização em níveis, execute o comando:

``` sh
gdaladdo --config USE_RRD=YES -ro <nome_arquivo.tif> 2 4 8
```

Ao finalizar o processamento, é importante definir o valor das bandas para a coloração do mosaico, o que pode ser alcançado com o apoio do QGIS, ao clicar com o botão direito sobre a camada -> propriedades -> simbologia na opção.A imagem abaixo apresenta um exemplo de definição do valor das bandas aplicadas ao mosaico Sentinel de 2018.

 ![Exemplo de bandas.](imgs/03/exemplo_bandas.png)

  Por fim, pode-se então disponibilizar o mosaico como camada no Mapserver através de um [mapfile](02-arq_servidor_de_mapas.md#Processo de atualização). Um exemplo de mapfile para criação da camada com o mosaico Sentinel de 2018 pode ser visualizada abaixo:

```
LAYER
  NAME "bi_ce_mosaico_sentinel_10_2018_lapig"
  DATA "img_satelites/bi_ce_mosaico_sentinel_10_lapig/bi_ce_mosaico_sentinel_10_2018_lapig.tif"
  EXTENT -60.1094198 -24.6846260 -41.5220189 -2.3262773
  METADATA
    "ows_title" "Mosaico Sentinel do Bioma Cerrado"
    "ows_abstract" "A geração dos mosaicos considerou, para cada cena e ano, a melhor imagem (i.e. com a menor cobertura de nuvens) adquirida no período de junho à setembro."
    "gml_exclude_items" "the_geom"
    "gml_include_items" "all"
    "gml_geometries"  "the_geom"
  END
  PROJECTION
    "init=epsg:4674"
  END
  STATUS ON
  TYPE Raster
  TEMPLATE "DUMMY"
  OFFSITE 0 0 0
  PROCESSING "SCALE_1=748,1405"
  PROCESSING "SCALE_2=613,1534"
  PROCESSING "SCALE_3=385,2134"
  PROCESSING "BANDS=3,2,1"
END
```

É importante ressaltar a inserção do parâmetro `PROCESSING "SCALE_"` ao Mapfile permitindo informar ao Mapserver os valores de bandas definidos anteriormente.
