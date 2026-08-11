const UtilsLang = require('../utils/language');


module.exports = function (app) {
    var Controller = {}
    var Internal = {}


    Internal.parseDecimal = function (value) {
        if (value === null || value === undefined) {
            return 0;
        }
        if (typeof value === 'string') {
            value = value.trim();
            if (value.indexOf(',') !== -1) {
                value = value.replace(/\./g, '').replace(',', '.');
            }
        }
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    Internal.numberFormat = function (numero, digits = 5) {
        numero = Internal.parseDecimal(numero);
        numero = numero.toFixed(digits).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    Internal.replacementStrings = function (template, replacements) {
        return template.replace(/#([^#]+)#/g, (match, key) => {
            // If there's a replacement for the key, return that replacement with a `<br />`. Otherwise, return a empty string.
            return replacements[key] !== undefined
                ? replacements[key]
                : "";
        });
    }

    Internal.buildGraphResult = function (allQueriesResult, chartDescription) {
        var dataInfo = {}

        try {
            let arrayLabels = []
            let arrayData = []
            for (let query of chartDescription.idsOfQueriesExecuted) {

                let queryInd = allQueriesResult[query.idOfQuery]

                arrayLabels.push(...queryInd.map(a => String(a.label)))
                let colors = [
                    {
                        color: "blueviolet",
                        code: "#8A2BE2"
                    },
                    {
                        color: "orangered 1 (orangered)",
                        code: "#FF4500"
                    },
                    {
                        color: "springgreen",
                        code: "#00FF7F"
                    },
                    {
                        color: "darkgoldenrod",
                        code: "#B8860B"
                    }
                    //   {
                    //     color: "coral 2",
                    //     code: {
                    //       hex: "#EE6A50"
                    //     },
                    //     id: 383
                    //   },
                ]

                if (chartDescription.type == 'line') {

                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => Internal.parseDecimal(a.value))],
                            fill: false,
                            borderColor: [...new Set(queryInd.map(a => a.color))],
                            tension: .4
                        })
                    }
                    else {
                        for (const [keyLabelQuery, valueLabelQuery] of Object.entries(query.labelOfQuery)) {
                            arrayData.push({
                                label: valueLabelQuery,
                                data: [...queryInd.filter(a => a.classe == keyLabelQuery).map(ob => Internal.parseDecimal(ob.value))],
                                fill: false,
                                borderColor: [...new Set(queryInd.filter(a => a.classe == keyLabelQuery).map(ob => ob.color))],
                                tension: .4
                            })
                        }
                    }
                }
                else if (chartDescription.type == 'pie' || chartDescription.type == 'doughnut') {
                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => Internal.parseDecimal(a.value))],
                            backgroundColor: [...new Set(colors.map(element => element.code))],
                            hoverBackgroundColor: [...new Set(colors.map(element => element.code))],
                        })
                    }
                    else {
                        arrayData.push({
                            label: query.idOfQuery,
                            data: [...queryInd.map(a => Internal.parseDecimal(a.value))],
                            backgroundColor: [...new Set(colors.map(element => element.code))],
                            hoverBackgroundColor: [...new Set(colors.map(element => element.code))],
                        })
                    }

                }
                else if (chartDescription.type == 'bar' || chartDescription.type == 'horizontalBar') {
                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => Internal.parseDecimal(a.value))],
                            backgroundColor: [...new Set(queryInd.map(a => a.color))],
                        })
                    }
                    else {
                        for (const [keyLabelQuery, valueLabelQuery] of Object.entries(query.labelOfQuery)) {
                            arrayData.push({
                                label: valueLabelQuery,
                                data: [...queryInd.filter(a => a.classe == keyLabelQuery).map(ob => Internal.parseDecimal(ob.value))],
                                backgroundColor: [...new Set(queryInd.filter(a => a.classe == keyLabelQuery).map(ob => ob.color))],
                            })
                        }
                    }
                }
            }

            dataInfo = {
                labels: [...new Set(arrayLabels)],
                datasets: [...arrayData]
            }

            // chart['indicators'] = queryInd.filter(val => {
            //     return parseFloat(val.value) > 10
            // })
        }
        catch (e) {
            dataInfo = null
        }

        return dataInfo;
    }

    Internal.buildTableData = function (allQueriesResult, chartDescription) {

        let dataInfo = []
        try {

            for (let query of chartDescription.idsOfQueriesExecuted) {

                let queryInd = allQueriesResult[query.idOfQuery]
                let index = 1;
                for (let i = 0; i < queryInd.length; i++) {
                    queryInd[i].originalValue = Internal.parseDecimal(queryInd[i].value)
                    queryInd[i].index = index++ + 'º'
                    queryInd[i].value = String(Internal.numberFormat(queryInd[i].value) + " ha")
                }

                dataInfo = [...queryInd]
            }

        }
        catch (e) {
            dataInfo = null
        }

        return dataInfo;

    };

    Controller.handleResumo = function (request, response) {
        const { lang, typeRegion, textRegion, year } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
            yearTranslate: year
        };

        const regionArea = Internal.parseDecimal(request.queryResult['region'][0].area_region);
        const restorationArea = Internal.parseDecimal(request.queryResult['restoration'][0].value);
        const percentArea = regionArea > 0 ? (restorationArea / regionArea) * 100 : 0;

        let result = {
            region: {
                area: Number(regionArea.toFixed(3)),
            },
            restoration: {
                area: Number(restorationArea.toFixed(3)),
                percentOfRegionArea: Internal.numberFormat(percentArea) + "%"
            }
        }

        response.send(result)
        response.end();

    };

    Controller.handleArea1Data = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "pastureAndLotacaoBovina",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'pasture', labelOfQuery: Internal.languageOb["area1_card"]["pastureAndLotacaoBovina"].labelOfQuery['pasture'] },
                    { idOfQuery: 'lotacao_bovina_regions', labelOfQuery: Internal.languageOb["area1_card"]["pastureAndLotacaoBovina"].labelOfQuery['lotacao_bovina_regions'] },
                ],
                "title": Internal.languageOb["area1_card"]["pastureAndLotacaoBovina"].title,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area1_card"]["pastureAndLotacaoBovina"].text, replacements)
                    return text
                },
                "type": 'line',
                "options": {
                    legend: {
                        display: false
                    }
                }
            },
            {
                "id": "pastureQuality",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'pasture_quality', labelOfQuery: Internal.languageOb["area1_card"]["pastureQuality"].labelOfQuery['pasture_quality'] },
                    // { idOfQuery: 'lotacao_bovina_regions', labelOfQuery: Internal.languageOb["area1_card"]["pastureAndLotacaoBovina"].labelOfQuery['lotacao_bovina_regions'] },
                ],
                "title": Internal.languageOb["area1_card"]["pastureQuality"].title,
                "getText": function (queriesResult, query) {
                    // replacements['areaMun'] = Internal.numberFormat(Number([...new Set(queriesResult[query[0].idOfQuery].map(ob => ob.area_mun))][0]))
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area1_card"]["pastureQuality"].text, replacements)
                    return text
                },
                "type": 'line',
                "options": {
                    legend: {
                        display: false
                    }
                }
            },
        ]

        let chartFinal = []
        for (let chart of chartResult) {

            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }

        response.send(chartFinal)
        response.end();

    };

    Controller.handleArea2Data = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "araticumRestoration",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'areaRestorationPerProject', labelOfQuery: Internal.languageOb["area2_card"]["araticumRestoration"].labelOfQuery['pasture_quality'] },
                ],
                "title": Internal.languageOb["area2_card"]["araticumRestoration"].title,
                "getText": function (queriesResult, query) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    replacements['areaRestoration'] = Internal.numberFormat(queriesResult[query[0].idOfQuery].reduce((n, { value }) => n + Internal.parseDecimal(value), 0), 3)

                    const text = Internal.replacementStrings(Internal.languageOb["area2_card"]["araticumRestoration"].text, replacements)
                    return text
                },
                "type": 'pie',
                "options": {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    }
                }
            }
            // {
            //     "id": "biomassaPerRegion",
            //     "idsOfQueriesExecuted": [
            //         { idOfQuery: 'biomassa', labelOfQuery: Internal.languageOb["area2_card"]["biomassaPerRegion"].labelOfQuery['biomassa'] },
            //     ],
            //     "title": Internal.languageOb["area2_card"]["biomassaPerRegion"].title,
            //     "getText": function (chart) {
            //         // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
            //         // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
            //         // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

            //         const text = Internal.replacementStrings(Internal.languageOb["area2_card"]["biomassaPerRegion"].text, replacements)
            //         return text
            //     },
            //     "type": 'pie',
            //     "options": {
            //         plugins: {
            //             legend: {
            //                 labels: {
            //                     color: '#495057'
            //                 }
            //             }
            //         }
            //     }
            // },
        ]

        let chartFinal = []
        for (let chart of chartResult) {

            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }



        response.send(chartFinal)
        response.end();
    };

    Controller.handleArea3Data = function (request, response) {

        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "pastureRankings",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'estados', labelOfQuery: Internal.languageOb["area3_card"]["pastureRankingStates"].labelOfQuery['estados'] },
                ],
                "title": Internal.languageOb["area3_card"]["pastureRankingStates"].title,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area3_card"]["pastureRankingStates"].text, replacements)
                    return text
                },
                "type": 'bar',
                "options": {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        }
                    }
                }
            },
        ]

        let chartFinal = []
        for (let chart of chartResult) {

            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }

        response.send(chartFinal)
        response.end()

    };

    Controller.handleTableRankings = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const tablesDescriptor = [
            {
                "id": "araticumRestorationRankingsProjects",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'projetos', labelOfQuery: Internal.languageOb["area_table_card"]["araticumRestorationRankingsProjects"].labelOfQuery['projetos'] },
                ],
                "title": Internal.languageOb["area_table_card"]["araticumRestorationRankingsProjects"].title,
                "columnsTitle": Internal.languageOb["area_table_card"]["araticumRestorationRankingsProjects"].columnsTitle,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area_table_card"]["araticumRestorationRankingsProjects"].text, replacements)
                    return text
                },
                "rows_labels": "index?projeto?fonte?value",
            }
        ]


        let resultFinal = []
        for (let res of tablesDescriptor) {

            res['data'] = Internal.buildTableData(request.queryResult, res)
            res['show'] = false

            if (res['data']) {
                res['show'] = true
                res['text'] = res.getText(request.queryResult, res.idsOfQueriesExecuted)
            } else {
                res['data'] = {};
                res['show'] = false;
                res['text'] = "erro."
            }

            resultFinal.push(res);
        }

        response.send(resultFinal)
        response.end()
    };


    return Controller;
}