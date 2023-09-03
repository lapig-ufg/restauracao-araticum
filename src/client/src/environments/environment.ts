// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
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
  production: false,
  GTAG: '',
  OWS_API: 'https://ows.lapig.iesa.ufg.br/api',
  OWS: 'https://ows.lapig.iesa.ufg.br',
  OWS_O1: "https://o1.lapig.iesa.ufg.br/ows",
  OWS_O2: "https://o2.lapig.iesa.ufg.br/ows",
  OWS_O3: "https://o3.lapig.iesa.ufg.br/ows",
  OWS_O4: "https://o4.lapig.iesa.ufg.br/ows",
  APP_URL: 'https://atlas-homolog.lapig.iesa.ufg.br',
  COMMIT_ID:commitId
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
