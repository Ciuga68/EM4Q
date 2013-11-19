define([
    "dojo/_base/declare",
    "esri-maps/actions/_LayerSelectionAction",
    "esri-maps/actions/_ConfigurableAction",
    "dojo/string"
], function (declare, _LayerSelectionAction,_ConfigurableAction, string) {
    return declare([_LayerSelectionAction,_ConfigurableAction], {
        
       
        editableProperties:[
            "label",
            "message",
            "description"
        ],

        message:null,

        constructor: function(){
            this.label = "SampleLayerSelectionAction";
            this.message ="This Layer ( ${layerId} ) has ${featureCount} Features Selected!";
        },

        execute: function (features, isClear) {
            try {
                if (!isClear) {
                    window['console'].log(string.substitute(this.message, {
                        layerId: this.layerId,
                        featureCount: features && features.length
                    }));
                } 
                else {
                    window['console'].log( "selection cleared");
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    });
});