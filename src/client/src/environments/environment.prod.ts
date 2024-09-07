let commitId = ''
try{
  const config = require('../../../../version.json');
  console.log(config)
  commitId = config.commitId
}catch{
  console.log('Not version')
}

export const environment = {
  APP: "ARATICUM",
  APP_NAME: 'Araticum - Articulação pela Restauração do Cerrado',
  production: true,
  GTAG: 'G-E4J440XHY3',
  OWS_API: 'https://ows.lapig.iesa.ufg.br/api',
  OWS: 'https://ows.lapig.iesa.ufg.br',
  OWS_O1: "https://o1.lapig.iesa.ufg.br/ows",
  OWS_O2: "https://o2.lapig.iesa.ufg.br/ows",
  OWS_O3: "https://o3.lapig.iesa.ufg.br/ows",
  OWS_O4: "https://o4.lapig.iesa.ufg.br/ows",
  APP_URL: 'https://araticum.lapig.iesa.ufg.br',
  COMMIT_ID:commitId
};
