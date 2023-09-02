module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {
        type: 'bioma',
        value: 'CERRADO'
    }

    Internal.textDefaultParams = function () {
        return Query.defaultParams.type + " ILIKE '" + Query.defaultParams.value + "'"
    }

    Query.extent = function (params) {
        return [{
            source: 'general',
            id: 'extent',
            sql: "SELECT geom_json as geojson FROM regions_geom WHERE type=${type} AND unaccent(value) ilike unaccent(${key}) LIMIT 1",
            mantain: true
        }]
    }

    Query.search = function () {
        return [{
            source: 'general',
            id: 'search',
            sql: "With priority_search AS ("
                + " SELECT distinct concat_ws(' - ', text , uf) as text, value, type, 1 AS priority FROM v_regions_geom_cerrado_cities_states "
                + "WHERE unaccent(text) ILIKE unaccent(${key})  AND type NOT in ('country', 'biome') "
                + "UNION ALL "
                + "SELECT distinct concat_ws(' - ', text , uf) as text, value, type, 2 AS priority FROM v_regions_geom_cerrado_cities_states "
                + "WHERE unaccent(text) ILIKE unaccent(${key}%) AND type NOT in ('country', 'biome') )"
                + "select * from priority_search order by priority asc limit 10",
            mantain: true
        }]

    }

    Query.searchregion = function () {
        return [{
            source: 'general',
            id: 'search',
            sql: "SELECT text, value, type FROM regions_geom WHERE unaccent(value) ILIKE unaccent(${key}%) AND type = (${type}) LIMIT 10",
            mantain: true
        }]
    }

    Query.cdgeocmu = function () {
        return [{
            source: 'general',
            id: 'search',
            sql: "SELECT text, value, type, cd_geocmu FROM regions WHERE cd_geocmu=${key} LIMIT 10",
            mantain: true
        }]
    }

    Query.cars = function (params) {
        var key = params['key']
        console.log("SELECT cod_car as text, area_ha, ST_AsGeoJSON(geom) as geojson FROM geo_car_imovel WHERE " + Internal.textDefaultParams() + " AND unaccent(cod_car) ILIKE unaccent('" + key + "%') order by area_ha DESC LIMIT 10")
        return [
            //     {
            //     source: 'general',
            //     id: 'search',
            //     sql: "SELECT cod_car as text, area_ha, ST_AsGeoJSON(geom) geojson FROM car_brasil WHERE " + Internal.textDefaultParams() + " AND unaccent(car_code) ILIKE unaccent('" + key + "%') order by area_ha DESC LIMIT 10",
            //     mantain: true
            // },
            {
                source: 'lapig',
                id: 'search',
                sql: "SELECT cod_car as text, area_ha, ST_AsGeoJSON(geom) as geojson FROM geo_car_imovel WHERE " + Internal.textDefaultParams() + " AND unaccent(cod_car) ILIKE unaccent(${key}%) order by area_ha DESC LIMIT 10",
                mantain: true
            }]
    }

    Query.ucs = function (params) {
        var key = params['key']
        // console.log("SELECT nome || ' - ' || uf as text, uf, cd_geocmu, ST_AsGeoJSON(geom) geojson FROM ucs WHERE " + Internal.textDefaultParams() + " AND unaccent(nome) ILIKE unaccent('%" + key + "%') order by nome ASC LIMIT 10")
        return [{
            source: 'general',
            id: 'search',
            sql: "SELECT nome || ' - ' || uf as text, uf, cd_geocmu, ST_AsGeoJSON(geom) geojson FROM ucs WHERE " + Internal.textDefaultParams() + " AND unaccent(nome) ILIKE unaccent('%" + key + "%') order by nome ASC LIMIT 10",
            mantain: true
        }]
    }


    // Query.downloadCSV = function(params) {
    // 	var layer = params.layer;
    //   var filterRegion = params.filterRegion;
    // 	var year = params.year;
    // 	var columnsCSV= "cd_geouf,cd_geocmu,regiao,uf,estado,municipio,bioma,arcodesmat,matopiba,mun_ha,pol_ha,pct_areapo, "+params.columnsCSV;
    //   var filter = filterRegion;
    // 	var sqlquery;
    // 	console.log('paramsss::',params)

    //   if(year != undefined && year != '') 
    //     filter = filterRegion +' AND '+ year;

    // 	if (layer == 'pontos_campo_parada' || layer=='pontos_campo_sem_parada' || layer=='pontos_tvi_treinamento' || layer=='pontos_tvi_validacao'){
    // 		columnsCSV = '*'
    // 		filter = filterRegion;
    // 	}
    // 	console.log("SELECT "+columnsCSV+" FROM "+layer+" WHERE "+filter)
    // 	return "SELECT "+columnsCSV+" FROM "+layer+" WHERE "+filter;
    // }

    return Query;

}