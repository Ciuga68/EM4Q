define(
	[
		"dojo/_base/declare",
		"dojo/Deferred",
		"dojo/json",
		"esri-maps/bisprovider/messaging/ErrorMessage",
		"esri-maps/bisprovider/adapters/persistence/PersistenceAdapterDetails"
	],
	function (declare, Deferred, JSON, ErrorMessage, PersistenceAdapterDetails) {
		return declare(null, {
			_storage: null,

			constructor: function () {
				this._initLocalStorage();
			},

			get: function (key) {
				var deferred = new Deferred(),
					value = this._storage.getItem(docId+key);

				if (value !== null) {
					deferred.resolve(value);
				} else {
					deferred.reject(new ErrorMessage(ErrorMessage.Types.KeyNotFound));
				}

				return deferred.promise;
			},

			getDetails: function () {
				var details = new PersistenceAdapterDetails();

				if (this._storage) {
					details.supportsRead = true;
					details.supportsRemove = true;
					details.supportsWrite = true;
				}
				return details;
			},

			remove: function (/*String*/ key) {
				var deferred = new Deferred(),
					value = this._storage.getItem(docId+key);

				if (value !== null) {
					this._storage.removeItem(docId+key);
					deferred.resolve();
				} else {
					deferred.reject(new ErrorMessage(ErrorMessage.Types.KeyNotFound));
				}
				return deferred.promise;
			},

			removeAll: function () {
				var deferred = new Deferred();

				this._storage.clear();
				deferred.resolve();

				return deferred.promise;
			},


			set: function (/*String*/ key,/*String*/  json) {
				var deferred = new Deferred();

				try {
					if (json === undefined || json === "undefined" || json === null || json === "null") {
						deferred.reject(new ErrorMessage(ErrorMessage.Types.InvalidSet));
					} else {
						this._storage.setItem(docId+key, json);
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