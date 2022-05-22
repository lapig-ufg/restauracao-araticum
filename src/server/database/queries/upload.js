module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.areainfo = function (params) {

        return [
            {
                source: 'general',
                id: 'regions_pershape',
                sql: "select s.text, s.type, s.value, s.uf from regions_geom s INNER JOIN upload_shapes up on ST_Intersects(up.geom, s.geom) where s.type not in ('fronteira', 'biome') AND up.token= ${token} order by 1 asc",
                mantain: true
            },
            {
                source: 'general',
                id: 'area_upload',
                sql: "select token, SUM((ST_AREA(geom::GEOGRAPHY) / 1000000.0)*100.0) as area_upload from upload_shapes where token= ${token} group by 1",
                mantain: true
            },
            {
                source: 'general',
                id: 'geojson_upload',
                sql: "select  ST_ASGEOJSON(ST_Transform(ST_Multi(ST_Union(geom)), 4674)) as geojson from upload_shapes where token= ${token} ",
                mantain: true
            }
       
        ]
    }

    Query.analysisaraticum = function (params) {

        const token = params['token']
        const sql_initiaves_pershape = "select distinct organizacao from or_cerrado_iniciativas_2022_araticum a INNER JOIN fdw_general.upload_shapes up on ST_INTERSECTS(a.geom, up.geom) where up.token= ${token} ";
        const sql_projects_pershape = "select a.projeto, a.metodo_padrao,  SUM(area_ha) area_restaurada from araticum_restauracao a INNER JOIN fdw_general.upload_shapes up on ST_INTERSECTS(a.geom, up.geom) where up.token= ${token} group by 1,2  ";

        return [
            {
                source: 'lapig',
                id: 'initiaves_pershape',
                sql: sql_initiaves_pershape,
                mantain: true
            },
            {
                source: 'lapig',
                id: 'projects_pershape',
                sql: sql_projects_pershape,
                mantain: true
            }
        ]
    }

    Query.findgeojsonbytoken = function (params) {
        return [{
            source: 'general',
            id: 'area_upload',
            sql: "select token, SUM((ST_AREA(geom::GEOGRAPHY) / 1000000.0)*100.0) as area_upload from upload_shapes where token= ${token} group by 1",
            mantain: true
        },
        {
            source: 'general',
            id: 'geojson_upload',
            sql: "select ST_ASGEOJSON(ST_Transform(ST_Multi(ST_Union(geom)), 4674)) as geojson from upload_shapes where token= ${token}",
            mantain: true
        }
        ]
    }

    Query.getanalysis = function (params) {
        return [
            {
                source: 'general',
                id: 'return_analysis',
                sql: "SELECT gid, token, analysis, TO_CHAR(date,'DD/MM/YYYY HH:mm:ss') as data FROM area_analysis WHERE token = ${token} and unaccent(origin) ilike unaccent(${origin}) order by date desc limit 1;",
                mantain: true
            }
        ]
    }

    Query.saveanalysis = function (params) {
        params['analysis'] = Buffer.from(JSON.stringify(params['analysis'])).toString('base64');

        return [{
            source: 'general',
            id: 'store',
            sql: "INSERT INTO area_analysis(token, analysis, date, origin) VALUES ('" + params['token'] + "', '" + params['analysis'] + "', NOW(), '" + params['origin'] + "') RETURNING token;",
            mantain: true
        }
        ]
    };

    return Query;

};