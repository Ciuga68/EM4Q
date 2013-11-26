require([
    'dojo/aspect',
    'dojo/dom-class',
    'dojo/when',
    'esri/config',
    'esri/kernel',
    'esri-maps/layouts/SidePanelLayout/SidePanelLayout',
    'esri-maps/bisprovider/BISProvider',
    'blue/bisprovider/JSONProvider',
    'dojo/domReady!'
], function(aspect, domClass, when, esriConfig, esriNS, SidePanelLayout, BISProvider, JSONProvider) {
    var main = {};
	main.create = function(){
		esriConfig.defaults.io.proxyUrl = "/proxy";
		if (typeof esriMapsSize !== 'undefined' && (esriMapsSize === "small" || esriMapsSize === "medium")) {
			domClass.replace("appContainer", esriMapsSize, "fullscreen");
		}
		main.JSONProvider = new JSONProvider();
		main.sidePanel = new SidePanelLayout({
			//slideInWidgets: ["somewidget"], // Custom widgets that need to be slided-in
			appSettings: {
				//initializePromise: somePromise // Use a dojo promise to notify when the underlying application is ready.
				bisProvider: new BISProvider(main.JSONProvider)
			}
		}, "app");

		if (typeof unsafeLogin !== 'undefined' && unsafeLogin) {
			// Only for test purposes, will bypass check when page hosted on HTTP wants to generate a token (over HTTPS) (on browsers without CORS support)
			aspect.before(esriMapsApp._signInController, 'processAuthentication', function() {
				esriNS.id.setProtocolErrorHandler(function() {
					return true;
				});
			});
		}

		// Sample to show how to disable sharing
		var selectionListeners = [];
		var addSelectionListeners = function(){
			for(var i=0;i<selectionListeners.length;i++)
			{
				dojo.disconnect(selectionListeners[i]);
			}
			selectionListeners = [];
			var layers = esriMapsApp.currentMap.getLayers();
			for(var i=0;i<layers.length;i++)
			{
				console.log("Layer Registered : "+layers[i].id);
				selectionListeners.push(dojo.connect(layers[i].esriMaps(),"onSelectionChange",function(){
					/*var colNames = [];
					for(var feat in this._selectedFeatures)
					{
						colNames = this._selectedFeatures[feat].getLayer().generateFeatures.lookupFields;
						break;
					}*/
					parent.updateSelectedRows(this._selectedFeatures);
				}));
			}
		};
		when(esriMapsApp.initialized, function() {
			esriMapsApp.sharingDisabled = false;
			
			when(main.sidePanel.mapWrapper.loadedPromise,function(){
				addSelectionListeners();
				dojo.connect(esriMapsApp.currentMap,"onLayerAdd",function(){
					addSelectionListeners();
				});
			});
		});
	}
	main.create();
	return main;
});