define([
    "dojo/_base/declare",
	"dojo/_base/Deferred",
	"esri-maps/bisprovider/messaging/ErrorMessage",
	"esri-maps/bisprovider/adapters/authentication/AuthenticationAdapterDetails",
	"dojo/cookie",
    "dojo/_base/url",
    "dojo/io-query",
    "esri/request"
],
	function (declare, Deferred, ErrorMessage, AuthenticationAdapterDetails, cookie, Url, ioquery, esriRequest) {
	    return declare(null, {
	        getDetails: function () {

	            var details = new AuthenticationAdapterDetails({
	                supportsLogin: false,
	                supportsArcGISCredentials: true
	            });

	            return details;
	        },

	        isAuthenticated: function () {
	            return new ErrorMessage(ErrorMessage.Types.NotSupported);
	        },

	        getLoginInfo: function () {
	            return new ErrorMessage(ErrorMessage.Types.NotSupported);
	        },

	        login: function () {
	            return new ErrorMessage(ErrorMessage.Types.NotSupported);
	        },

	        getArcGISCredentials: function (/* String? */ portal) {
	            var usr = cookie("username"),
                    portal = cookie("portal"),
                    token = cookie("token"),
                    ssl = cookie("ssl"),
                    expires_at = cookie("expires_at");
	            deferred = new Deferred();

	            if (usr && token) {
	                deferred.resolve({
	                    username: usr,
	                    portal: portal,
	                    token: token,
	                    ssl: ssl,
	                    expires_at: expires_at
	                });
	            }
	            else {
	                deferred.reject(new ErrorMessage(ErrorMessage.Types.Unknown));
	            }

	            return deferred.promise;
	        },


	        setArcGISCredentials: function (arcGISCredentials) {
	            var deferred = new Deferred(),

					usr = arcGISCredentials && arcGISCredentials.username,
					expires = arcGISCredentials && arcGISCredentials.expires,
					portal = arcGISCredentials && arcGISCredentials.portal;
	            token = arcGISCredentials && arcGISCredentials.token;
	            ssl = arcGISCredentials && arcGISCredentials.ssl;
	            expires_at = arcGISCredentials && arcGISCredentials.expires_at;

	            cookie("username", usr, { "expires": expires });
	            cookie("portal", portal, { "expires": expires });
	            cookie("token", token, { "expires": expires });
	            cookie("ssl", ssl, { "expires": expires });
	            cookie("expires_at", expires_at, { "expires": expires });

	            deferred.resolve();

	            return deferred.promise;
	        },

	        requestTokenAppSecretLogin: function () {
	            var deferred = new Deferred();

	            // Pull "oAuthSecret" from query string to indicate whether or not we want to
	            // generate a token via AppId and AppSecret
	            var urlObj = new Url(window.location.href),
                    query = null;

	            if (urlObj.query) {
	                query = ioquery.queryToObject(urlObj.query)
	            }

	            if (query) {
	                var url = "oauth/oAuth-GetToken.ashx?oAuthSecret=";
	                url += (query && query.oAuthSecret) ? "true" : "false";

	                esriRequest({
	                    url: url,
	                    content: {
	                        f: "json"
	                    },
	                    handleAs: "json",
	                    callbackParamName: "callback"
	                }).then(function (result) {
	                    deferred.resolve(result);
	                }).otherwise(function (error) {
	                    console.log(error);
	                    deferred.resolve("");
	                });
	            } else {
	                deferred.resolve("");
	            }

	            return deferred.promise;
	        },

	        getOAuthAppConfig: function () {
	            var deferred = new Deferred();

	            // Pull App Id from query string for samples (oAuthAppId)
	            var urlObj = new Url(window.location.href),
                    query = null;

	            if (urlObj.query) {
	                query = ioquery.queryToObject(urlObj.query)
	            }

	            if (query && query.oAuthAppId) {
	                deferred.resolve({ "appId": query.oAuthAppId, "popup": query.oAuthPopup && query.oAuthPopup != "false" ? true : false });
	            }
	            else {
	                deferred.resolve({});
	            }

	            return deferred.promise;
	        }
	    });
	});