define([
    "dojo/_base/declare",
    "./data/JSONDataAdapter",
    "./persistence/SamplePersistenceAdapter",
    "./application/ApplicationAdapter",
    "./authentication/AuthAdapter",
    "./SessionAdapter"
], function (declare, DataAdapter, PersistenceAdapter, ApplicationAdapter, AuthenticationAdapter,SessionAdapter) {
    return declare(null, {
        constructor: function () {
            this.data = new DataAdapter();
            this.persistence = new PersistenceAdapter();
            this.application = new ApplicationAdapter();
            this.authentication = new AuthenticationAdapter();
            this.usersession = new SessionAdapter();
        }
    });
});