define([
    "dojo/_base/declare",
    "esri-maps/actions/_LayerMouseOverAction",
    "esri-maps/actions/_EnablableAction",
    "dojo/string"
], function (declare, _LayerMouseOverAction, _EnablableAction, string) {
    return declare([_LayerMouseOverAction, _EnablableAction], {
        
       

        constructor: function(){
            this.label = "SampleMouseOverAction";
            this.message ="This Layer ( ${layerId} ) Mouse Over graphic ${id}:${value} ";
        },

        execute: function (graphic) {
            if (!this.get('isDisabled')) {
                try {
                    var layer = this._getLayer();
                    window['console'].log(string.substitute(this.message, {
                        layerId: this.layerId,
                        id: layer.objectIdField,
                        value: graphic.attributes[layer.objectIdField]
                    }));
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    });
});