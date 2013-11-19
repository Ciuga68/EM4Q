define([
    "dojo/_base/declare",
    "dojo/request/xhr",
    "esri-maps/bisprovider/adapters/application/ApplicationAdapterDetails"
], function (declare, xhr, ApplicationAdapterDetails) {
    return declare(null, {
        constructor: function() {
            this._configRoot = location.pathname.replace(new RegExp("/[^/]+$"), '/') + '/';
        },

        getDetails: function () {

            var details = new ApplicationAdapterDetails();
            details.supportsDefaultMapConfig = true;
            details.supportsDefaultAppConfig = true;
            details.supportsDesignModeAppConfig = true;
            details.supportsDesignModeAvailableCommands = true;

            return details;
        },

        getDefaultAppConfig: function () {
            
            return "dojo/text!samples/sample_app_configuration.json.txt";
            // Normally a pretty empty default config (like the one below) should be returned. But for the sake of always having 
            // a app config in Blue.html with all the bells and whistles we'll return the app config above.
            //return xhr(sampleBISProviderPackageLocation + "/../sample_default_app_configuration.json.txt", { handleAs: "json" });
        },

        getDefaultMapConfig: function () {
        	return "dojo/text!samples/sample_map_configuration.json.txt";
            // See comment in getDefaultAppConfig
            //return xhr(sampleBISProviderPackageLocation + "/../sample_default_map_configuration.json.txt", { handleAs: "json" });
        },

        getDesignModeAppConfig: function () {
            return xhr(this._configRoot + "sample_designmode_app_configuration.json.txt", { handleAs: "json" });
        },

        getDesignModeAvailableCommands: function () {
            return xhr(this._configRoot + "sample_designmode_available_commands.json.txt", { handleAs: "json" });
        },
        

        getAvailableActions: function(){

            return [
               {
                   _class: "blue/actions/SampleLayerSelectionAction"
               },
                {
                    _class: "blue/actions/SampleMouseOverAction"
                },
                {
                    _class: "blue/actions/SampleMouseClickAction"
                },
                {
                    _class: "blue/actions/SamplePopupAction"
                }
            ];
        },


        execute: function (params) {

            window['console'].log("This is a execute hook for crm : " + params);
        }
    });
});