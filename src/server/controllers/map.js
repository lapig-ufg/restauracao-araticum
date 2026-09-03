const got = require('got');
const DescriptorBuilder = require('../utils/descriptorBuilder');

module.exports = function (app) {
    const Controller = {}

    const config = app.config;

    Controller.callServiceToObtainLayerTypes = async function (language, type = 'layers') {
        let res = {}
        let url = String(process.env.OWS_API + "/map/" + type + "?lang=" + language)
        try {
            const response = await got(url);
            res = JSON.parse(response.body)

            return res;

        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    }

    Controller.descriptor = async function (request, response) {
        const { lang } = request.query;
        try {
            let layertypes = await Controller.callServiceToObtainLayerTypes(lang, 'layers')
            let basemapsTypes = await Controller.callServiceToObtainLayerTypes(lang, 'basemaps')
            let limitsTypes = await Controller.callServiceToObtainLayerTypes(lang, 'limits')

            const result = {
                regionFilterDefault: "bioma='CERRADO'", // Non-obrigatory property to define a filter to Region applied to EVERY layer.
                groups: DescriptorBuilder().getGroupLayers(lang, layertypes),
                basemaps: DescriptorBuilder().getBasemapsOrLimitsLayers(lang, 'basemaps', basemapsTypes),
                limits: DescriptorBuilder().getBasemapsOrLimitsLayers(lang, 'limits', limitsTypes),
            }

            response.send(result);
            response.end();
        } catch (e) {
            console.log(e)
        }
    };

    Controller.extent = function (request, response) {
        const rows = request.queryResult && request.queryResult['extent'] ? request.queryResult['extent'] : []

        if (!rows.length || !rows[0] || !rows[0].geojson) {
            return response.status(404).json({
                error: 'Limite do bioma não encontrado'
            })
        }

        try {
            const result = {
                type: 'Feature',
                geometry: JSON.parse(rows[0].geojson)
            }

            return response.json(result)
        } catch (error) {
            console.error('GeoJSON inválido para o limite do bioma', error)
            return response.status(500).json({
                error: 'Geometria do bioma inválida'
            })
        }
    }

    Controller.search = function (request, response) {
        var regiao;

        const queryResult = request.queryResult['search']

        let iniResults = []


        queryResult.forEach(function (row) {
            delete row.priority
            iniResults.push(row)
        })

        let result = [...new Map(iniResults.map(item => [item['value'], item])).values()]

        response.send({ search: result })
        response.end()
    }


    Controller.host = function (request, response) {

        var baseUrls = config.ows_domains.split(",");

        for (let i = 0; i < baseUrls.length; i++) {
            baseUrls[i] += "/ows"
        }

        response.send(baseUrls);
        response.end();
    }

    return Controller;

}