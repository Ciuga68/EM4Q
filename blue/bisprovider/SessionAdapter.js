define(
	[
		"dojo/_base/declare",
		"dojo/Deferred",
		"dojo/json",
		"dojo/_base/array",
		"esri-maps/bisprovider/messaging/ErrorMessage",
		"esri-maps/bisprovider/adapters/usersession/UserSessionAdapterDetails"
	],
	function (declare, Deferred, JSON, array, ErrorMessage, UserSessionAdapterDetails) {
		return declare(null, {
			_storage: null,
			_sessionPrefix:"EMSESSION",
			_sessionDelim:"_",
			
			constructor: function () {
				this._initLocalStorage();
			},
			
			_wrapKey:function(key){
				return [this._sessionPrefix,key].join(this._sessionDelim); 
			},
			_isValidKey: function(key){
				return key.indexOf(this._sessionPrefix) == 0;
			},

			get: function (key) {
				var deferred = new Deferred(),
					value = this._storage.getItem(this._wrapKey(key));

				if (value !== null) {
					deferred.resolve(value);
				} else {
					deferred.reject(new ErrorMessage(ErrorMessage.Types.KeyNotFound));
				}

				return deferred.promise;
			},

			getDetails: function () {
				var details = new UserSessionAdapterDetails();

				if (this._storage) {
					details.supportsRead = true;
					details.supportsRemove = true;
					details.supportsWrite = true;
				}
				return details;
			},

			remove: function (/*String*/ key) {
				var deferred = new Deferred(),
					value = this._storage.getItem(this._wrapKey(key));

				if (value !== null) {
					this._storage.removeItem(this._wrapKey(key));
					deferred.resolve();
				} else {
					deferred.reject(new ErrorMessage(ErrorMessage.Types.KeyNotFound));
				}
				return deferred.promise;
			},

			removeAll: function () {
				var key;
				for ( key in this._storage){
					if (this._isValidKey(key)){
						this.remove(key);
					}
				}
				return ;
			},


			set: function (/*String*/ key,/*String*/  json) {
				var deferred = new Deferred();

				try {
					if (json === undefined || json === "undefined" || json === null || json === "null") {
						deferred.reject(new ErrorMessage(ErrorMessage.Types.InvalidSet));
					} else {
						this._storage.setItem(this._wrapKey(key), json);
					}
					deferred.resolve();
				}
				catch (e) {
					deferred.reject(new ErrorMessage(ErrorMessage.Types.Unknown, e.message));
				}

				return deferred.promise;
			},

			_initLocalStorage: function () {
				try {
					var store,
						uid = new Date(),
						fail;

					(store = window.localStorage).setItem(uid, uid);
					fail = store.getItem(uid) != uid;
					store.removeItem(uid);
					if (!fail) {
						this._storage = store;
					}
					else {
						this._storage = null;
					}
				} catch (e) { this._storage = null; }
			}
		});
	});