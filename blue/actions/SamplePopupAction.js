define([
    "dojo/_base/declare",
    "esri-maps/actions/_PopupAction",
    "esri-maps/actions/_EnablableAction",
    "esri-maps/actions/_ConfigurableAction",
        "dojo/string"
], function (declare, _PopupAction, _EnablableAction, _ConfigurableAction, string) {
    return declare([_PopupAction, _EnablableAction, _ConfigurableAction], {

        interestField: null,
        editableProperties: [
            "interestField",
            "label",
            "description"
        ],

        constructor: function () {
            this.label = "Wiki";
            this.interestField = "STATE_NAME";
        },

        execute: function () {
            var graphic = this.graphic,
                url = "http://en.wikipedia.org/wiki/",
                win;


            if (!this.get('isDisabled') && graphic && graphic.attributes && graphic.attributes[this.interestField]) {
                url += graphic.attributes[this.interestField];

                win = window.open(url, '_blank');
                win.focus();
            }
            

        }
    });
});