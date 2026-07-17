# 📚 Documentação das Tabelas Utilizadas pelo Araticum

## Visão Geral

Este documento tem como objetivo centralizar a documentação das tabelas utilizadas nas consultas (*queries*) do código do projeto **Araticum**.

As tabelas documentadas neste arquivo são utilizadas diretamente pelas rotinas de consulta, processamento e análise de dados da aplicação.

### Tabelas Utilizadas (banco de dados general)

- `regions_geom`
- `regions`
- `ucs`
- `upload_shapes`
- `area_analysis`

---

# 🗂️ regions_geom

## Funcionalidades

> Descrever a finalidade desta tabela.

- [ ] Funcionalidade 1
- [ ] Funcionalidade 2
- [ ] Funcionalidade 3

## Representação

| Nome da Coluna |    Tipo     | Descrição |
|----------------|-------------|-----------|
|     text       |   varchar   |           |
|     type       |   varchar   |           |
|     geom       |   varchar   |           |


---

# 🗂️ regions

## Funcionalidades

> Descrever a finalidade desta tabela.

- [ ] Funcionalidade 1
- [ ] Funcionalidade 2
- [ ] Funcionalidade 3

## Representação

|  Nome da Coluna  |      Tipo       | Descrição |
|------------------|-----------------|-----------|
|      gid         |    serial4      |           |
|    objectid      |      int8       |           |
|    cd_geouf      |      int8       |           |
|    cd_geocmu     |   varchar(7)    |           |
|     regiao       |   varchar(30)   |           |
|      uf          |   varchar(10)   |           |
|     estado       |   varchar(30)   |           |
|    municipio     |   varchar(60)   |           |
|     bioma        |   varchar(30)   |           |
|    arcodesmat    |      int8       |           |
|    matopiba      |      int8       |           |
|     mun_ha       |    numeric      |           |
|     pol_ha       |    numeric      |           |
|    pct_areapo    |    numeric      |           |
|     geom         |   geometry      |           |

---

# 🗂️ ucs

## Funcionalidades

> Descrever a finalidade desta tabela.

- [ ] Funcionalidade 1
- [ ] Funcionalidade 2
- [ ] Funcionalidade 3

## Representação

|    Nome da Coluna   |       Tipo       | Descrição |
|---------------------|------------------|-----------|
|       gid           |      int4        |           |
|       nome          |   varchar(254)   |           |
|       categoria     |   varchar(254)   |           |
|       grupo         |   varchar(254)   |           |
|       esfera        |   varchar(254)   |           |
|       anocriacao    |     numeric      |           |
|       qualidade     |   varchar(254)   |           |
|       atolegal      |   varchar(254)   |           |
|       outrosatos    |   varchar(254)   |           |
|       ultatual      |      date        |           |
|       codigouc      |   varchar(254)   |           |
|       origem        |   varchar(254)   |           |
|       planomane     |   varchar(254)   |           |
|       consgesto     |   varchar(254)   |           |
|       fonte         |   varchar(100)   |           |
|       geom          |     geometry     |           |
|       uf            |   varchar(2)     |           |
|       cd_geoc       |   varchar(10)    |           |
|       bioma         |   varchar(50)    |           |
|       amaz_legal    |      int4        |           |
|       matopiba      |      int4        |           |
|       area_ha       |     numeric      |           |


---

# 🗂️ upload_shapes

## Funcionalidades

> Descrever a finalidade desta tabela.

- [ ] Funcionalidade 1
- [ ] Funcionalidade 2
- [ ] Funcionalidade 3

## Representação

|   Nome da Coluna    |     Tipo     | Descrição |
|---------------------|--------------|-----------|
|        gid          |    serial4   |           |
|        token        |     text     |           |
|        geom         |    geometry  |           |
|    data_insercao    |   timestamp  |           |
|     app_origin      |    varchar   |           |

---

# 🗂️ area_analysis

## Funcionalidades

> Descrever a finalidade desta tabela.

- [ ] Funcionalidade 1
- [ ] Funcionalidade 2
- [ ] Funcionalidade 3

## Representação

|   Nome da Coluna   |       Tipo       | Descrição |
|--------------------|------------------|-----------|
|        gid         |     serial4      |           |
|       token        |   varchar(400)   |           |
|        date        |    timestamp     |           |
|      analysis      |       text       |           |
|       origin       |   varchar(100)   |           |
