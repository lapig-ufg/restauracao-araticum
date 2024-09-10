module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Internal.getRegionFilter = function (type, key) {

        var regionsFilter;

        if (type == 'country') {
            regionsFilter = "1=1";
        } else {
            var regionsFilter = "";
            if (type == 'city')
                regionsFilter += "cd_geocmu = '" + key + "'"
            else if (type == 'state')
                regionsFilter += "uf = '" + key + "'"
            else if (type == 'biome')
                regionsFilter += "bioma = '" + key.toUpperCase() + "'"
            else if (type == 'fronteira') {
                if (key == 'amz_legal') {
                    regionsFilter += "amaz_legal = 1"
                }
                else if (key.toLowerCase() == 'MATOPIBA'.toLowerCase()) {
                    regionsFilter += "matopiba = 1"
                }
                else if (key.toLowerCase() == 'ARCODESMAT'.toLowerCase()) {
                    regionsFilter += "arcodesmat = 1"
                }
            }
        }

        return regionsFilter
    }

    Internal.getYearFilter = function (year) {

        if (year) {
            year = "year = " + (year)
        }
        return year;
    }

    Query.resumo = function (params) {
        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        return [
            {
                source: 'lapig',
                id: 'region',
                sql: "SELECT CAST(SUM(pol_ha) as double precision) as area_region FROM new_regions WHERE " + regionFilter + ""
            },
            {
                source: 'lapig',
                id: 'restoration',
                sql: " SELECT  CAST(st_area(st_union(geom)::geography)/10000 as double precision) as value "
                    + " FROM araticum_restauracao_2024 a "
                    + " WHERE " + regionFilter
            }
        ]
    }

    Query.area1 = function (params) {

        // var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);

        return [
            {
                source: 'lapig',
                id: 'time_series_data1',
                sql: "SELECT 'PUT HERE YOUR QUERY'",
                mantain: true
            }
        ]

    }

    Query.area2 = function (params) {

        // var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);

        return [
            {
                source: 'lapig',
                id: 'areaRestorationPerProject',
                sql: "SELECT metprinc as label, st_area(st_union(geom)::geography)/10000 as value from araticum_restauracao_2024 GROUP BY 1 ORDER BY 2 DESC ",
                mantain: true
            }
        ];
    }

    Query.area3 = function (params) {

        // var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        // var amount = params['amount'] ? params['amount'] : 10
        return [
            {
                source: 'lapig',
                id: 'time_series_data3',
                sql: "SELECT 'PUT HERE YOUR QUERY'",
                mantain: true
            }
        ]
    }

    Query.areatable = function (params) {
        // var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);

        return [
            {
                source: 'lapig',
                id: 'projetos',
            sql: "SELECT projeto, fonte, st_area(st_union(geom)::geography)/10000  as value from araticum_restauracao_2024 GROUP BY 1, 2 ORDER BY 3 DESC ",
                mantain: true
            }
        ]
    }


    return Query;

}