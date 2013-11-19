define([
    "dojo/_base/declare",
    "esri-maps/actions/_LayerMouseClickAction",
    "esri-maps/actions/_ConfigurableAction",
    "dojo/string"
], function (declare, _LayerMouseClickAction, _ConfigurableAction, string ) {
    return declare([_LayerMouseClickAction, _ConfigurableAction], {
        
       
        editableProperties: [
            "label",
            "message",
            "description"
        ],

        constructor: function(){
            this.label = "SampleMouseClickAction";
            this.message ="This Layer ( ${layerId} ) Mouse Click graphic ${id}:${value} ";
        },

        execute: function (graphic) {
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
        },


        serialize: function(){
            var obj = this.inherited();
            obj.message = this.message;
            return obj;
        }
    });
});