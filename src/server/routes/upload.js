module.exports = function (app) {

	var filesAccepted = app.middleware.file;
	var uploader = app.controllers.upload;
	var dataInjector = app.middleware.dataInjector

	app.post('/service/upload/spatial-file', filesAccepted, uploader.getGeoJson);
	app.get('/service/upload/areainfo', dataInjector, uploader.areainfo);
	app.get('/service/upload/analysisaraticum', dataInjector, uploader.analysisaraticum);
	app.get('/service/upload/analysisarea', dataInjector, uploader.analysisarea);
	app.get('/service/upload/findgeojsonbytoken', dataInjector, uploader.findGeoJsonByToken);
	app.post('/service/upload/savegeom', uploader.saveDrawedGeom);
	app.get('/service/upload/getanalysis', dataInjector, uploader.getAnalysis);
	app.post('/service/upload/saveanalysis', dataInjector, uploader.saveAnalysis);
}
