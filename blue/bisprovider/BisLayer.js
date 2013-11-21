define(
             [ "esri-maps/layers/BisLayer", "dojo/aspect", "dojo/when", "dojo/_base/array", "dojo/Deferred" ],

             function(bisLayer, aspect, when, array, Deferred) {

                    dojo.extend(bisLayer,
                                 {
                                        refreshBisData: function(paramData){

                                               //added per Ryan's code
                               //esriMapsApp.currentMap.infoWindow.hide();
                                 
                                               this.clear();
                                               
                                               this.initGenerateFeatures();
                                               //this.updating = true;
                                               var self = this;
                                               var dfrd = new Deferred();
                                               
                                                                                

                                               //register listener for when to call refresh renderer and zoom
                                               var onCompletedAspectHandle = aspect.after(this.generateFeaturesController, "onCompleted", function () {
                                                      onCompletedAspectHandle.remove();
                                                     
                                                      console.log("******************Layer completed rendering: " + self.generateFeatures.type);
                                                     
                                                     require(["esri-maps/widgets/StyleGrouping/StyleGrouping"], function (StyleGrouping) {
                                                            try {
                                                                   widget = new StyleGrouping({ selectedLayer: self });
                                                                   widget.startup();
                                                                   widget.styleGroupingController.updateRenderer();
                                                            } catch (e) {
                                                                   console.log(self.id, e.message);
                                                            }
                                                     });
                                                     
                                                      if(self._esriMaps.zoomToApplicationStart){
                                                            require(["esri/graphicsUtils"], function (graphicsUtils){
                                                                   var featuresWithGeometries = array.filter(self.graphics, function (feature) { return feature.geometry != null; });
                                                                   var currentFeatureExtent = featuresWithGeometries.length > 0 ? graphicsUtils.graphicsExtent(featuresWithGeometries) : null;
                                                                   if(currentFeatureExtent){
                                                                          esriMapsApp.currentMap.setExtent(currentFeatureExtent, true);
                                                                   }
                                                            });
                                                     }
                                                     dfrd.resolve();
                                                     
                                               });
                                          
                                               
                                               
                                               
                                               when(this._getData(), function (resultSet) {
                                                     if (resultSet) {

                                                            var data = paramData || resultSet.results;

                                                            var promise = self._getLayerObjectID();
                                                            when(promise, function () {
                                                                   self.initData(data);

                                                                   //self._registerExtentListener(map);
                                                            });

                                                     }
                                               }, function (err) {
                                                     console.error(err);
                                               });

                               return dfrd.promise;
                                        }
                                 }
                           );

             });
