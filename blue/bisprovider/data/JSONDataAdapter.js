define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/Deferred",
    "dojo/number",
    "dojo/promise/all",
    "dojo/json",
    "dojo/store/Memory",
    "dojo/data/ObjectStore",
    "esri-maps/bisprovider/adapters/data/DataAdapter",
    "dojo/text!./EsriOffices.json.txt",
    "dojo/text!./Stores.json.txt",
    "dojo/text!./USCounties.json.txt",
    "dojo/text!./USRivers.json.txt",
    "esri-maps/bisprovider/messaging/ErrorMessage",
    "esri-maps/bisprovider/adapters/data/DataAdapterDetails",
    "esri-maps/bisprovider/adapters/data/model/Metadata",
    "esri-maps/bisprovider/adapters/data/model/Table",
    "esri-maps/bisprovider/adapters/data/model/Field",
    "esri-maps/bisprovider/adapters/data/model/TypeEnum",
    "esri-maps/bisprovider/adapters/data/model/ResultSet"
], function (declare, array, Deferred, number, all, JSON, Memory, ObjectStore, DataAdapter, esriOfficesData, stores, uscounties, usrivers, ErrorMessage, DataAdapterDetails, MetaData, Table, Field, TypeEnum, ResultSet) {

    function createStore(data) {
        var memory = new Memory({
            idProperty: data.idField,
            data: data.items
        });
        return new ObjectStore({
            objectStore: memory
        });
    }

    return declare(null, {
        _dataSources: {},

        constructor: function () {
            this._dataSources.Em4qData = createStore(window.data);

           // this._dataSources.Stores = createStore(JSON.parse(stores), null);

           /* this._dataSources.USCounties = createStore(JSON.parse(uscounties));

            this._dataSources.USRivers = createStore(JSON.parse(usrivers));

            var data = JSON.parse(esriOfficesData),
                firstRecord = data && data.items && data.items[0],
                fieldName;

            if (firstRecord) {
                for (fieldName in firstRecord) {
                    firstRecord[fieldName] = fieldName;
                }
            }
            this._dataSources["EsriOffices (first row contains headers)"] = createStore(data);
            this._dataSources["EsriOffices (first row contains headers)"].firstRowContainsHeaders = true;
            this._dataSources["EsriOffices (first row contains headers)"].firstRowCouldContainHeaders = true;

            this._dataSources["EsriOffices (first row doesn't contain headers)"] = createStore(JSON.parse(esriOfficesData));
            this._dataSources["EsriOffices (first row doesn't contain headers)"].firstRowContainsHeaders = false;
            this._dataSources["EsriOffices (first row doesn't contain headers)"].firstRowCouldContainHeaders = true;*/
        },

        getDetails: function () {
            var details = new DataAdapterDetails({
                supportsQuery: true,
                supportsGetMetadata: true,
                supportsUpdate: true,
                supportsInsertColumns: true
            });

            return details;
        },

        getMetadata: function (options) {
            var deferred = new Deferred(),
                deferreds = [],
                tableName, d, store, table;

            for (tableName in this._dataSources) {
                if (!options.areTablesFiltered() || (options.tables && array.indexOf(options.tables, tableName) >= 0)) {
                    d = new Deferred();
                    deferreds.push(d);

                    store = this._dataSources[tableName];
                    table = new Table(tableName, tableName, []);

                    table.idField = store.objectStore.idProperty;

                    table.firstRowCouldContainHeaders = store.firstRowCouldContainHeaders;
                    if (table.firstRowCouldContainHeaders) {
                        if (options.firstRowContainsHeaders === true || options.firstRowContainsHeaders === false) {
                            table.firstRowContainsHeaders = options.firstRowContainsHeaders;
                        } else {
                            table.firstRowContainsHeaders = store.firstRowContainsHeaders;
                        }
                    }

                    if (options.returnFields) {
                        this._getFields(store, table.firstRowContainsHeaders).then(function (fields) {
                            table.fields = fields;
                            d.resolve(table);
                        }, function (err) {
                            d.reject(err);
                        });
                    } else {
                        d.resolve(table);
                    }
                }
            }
            all(deferreds).then(function (tables) {
                deferred.resolve({
                    tables: tables
                });
            }, function (err) {
                deferred.reject(new ErrorMessage(ErrorMessage.Types.Metadata));
            });
            return deferred.promise;
        },

        _getFields: function (store, firstRowContainsHeaders) {
            var dfrd = new Deferred();
            store.fetch({
                start: 0,
                count: 2,
                onComplete: function (items) {
                    var firstItem = items && items[0],
                        secondItem = items && items[1],
                        fields = [],
                        type, value, fieldName, intValue, floatValue;

                    if (firstItem) {
                        var index = 0;

                        for (fieldName in firstItem) {
                            type = TypeEnum.STRING;
                            value = firstRowContainsHeaders && secondItem ? secondItem[fieldName] : firstItem[fieldName];

                            var num = number.parse(value);

                            if (!isNaN(num)) {
                            intValue = parseInt(value, null);
                            floatValue = parseFloat(value);

                            if (!isNaN(intValue) && (floatValue == intValue)) {
                                type = TypeEnum.INTEGER;
                            } else if (!isNaN(floatValue)) {
                                type = TypeEnum.DOUBLE;
                            }
                            }

                            if (firstRowContainsHeaders === true) {
                                fields.push(new Field("Column" + index, firstItem[fieldName]));
                            } else if (firstRowContainsHeaders === false) {
                                fields.push(new Field("Column" + index, "Column" + index, type));
                            } else {
                                fields.push(new Field(fieldName, fieldName, type));
                            }

                            index++;
                        }
                    }
                    dfrd.resolve(fields);
                },
                onError: function () {
                    dfrd.reject("Error");
                }
            });

            return dfrd.promise;
        },

        query: function (query) {
            var deferred = new Deferred(),
                self = this,
                store = query && query.tableId && this._dataSources && this._dataSources[query.tableId],
                savedData = query && query.tableId && this._getSavedStoreData(query.tableId),
                fetchStore = savedData || store,
                filterQuery = {};

            if (typeof esriMapsStateFilter !== "undefined") {
                filterQuery = { "State": esriMapsStateFilter };
            }

            if (fetchStore) {
                fetchStore.fetch({
                    query : filterQuery,
                    onComplete: function (items) {
                        if (query.firstRowContainsHeaders) {
                            items.splice(0, 1);
                        }

                        self._getFields(store, query.firstRowContainsHeaders).then(function (allfields) {
                            var resultSet = new ResultSet();
                            resultSet.fields = query.fields;
                            array.forEach(items, function (item) {
                                row = {};
                                array.forEach(resultSet.fields, function (field, index) {
                                    for (var i = 0; i < allfields.length; i++) {
                                        if (allfields[i].id === field.id) {

                                            if (query.firstRowContainsHeaders === true) {
                                                row[field.id] = fetchStore.getValue(item, field.label);
                                            } else {
                                                row[field.id] = fetchStore.getValue(item, field.id);
                                            }

                                            break;
                                        }
                                    }
                                });
                                resultSet.addResult(row);
                            });
                            deferred.resolve(resultSet);
                        }, function (err) {
                            deferred.reject(err);
                        });
                    },
                    onError: function () {
                        deferred.reject(new ErrorMessage(ErrorMessage.Types.Query));
                    }
                });
            } else {
                deferred.reject(new ErrorMessage(ErrorMessage.Types.Query));
            }

            return deferred.promise;
        },

        _saveStoreData: function (tableId, store) {
            if (store) {
                store.save();
                var data = JSON.stringify({
                    idField: store.objectStore.idProperty,
                    items: store.objectStore.data
                });
                if (data && localStorage) {
                    localStorage.setItem("data_" + tableId, data);
                }
            }
        },

        _getSavedStoreData: function (tableId) {
            if (localStorage) {
                var savedData = localStorage.getItem('data_' + tableId);
                if (savedData) {
                    return createStore(JSON.parse(savedData));
                }
            }
        },

        update: function (setStatement) {
            var dfrd = new Deferred(),
                self = this,
                store = setStatement && setStatement.tableId && this._dataSources && this._dataSources[setStatement.tableId],
                savedData = setStatement && setStatement.tableId && this._getSavedStoreData(setStatement.tableId),
                fetchStore = savedData || store;

            if (fetchStore && setStatement.entry && setStatement.whereClause && setStatement.whereClause.field && setStatement.whereClause.operator === "EQ") {
                fetchStore.fetch({
                    onComplete: function (items) {
                        if (array.some(items, function (item) {
                            if (fetchStore.getValue(item, setStatement.whereClause.field) === setStatement.whereClause.value) {
                                array.forEach(setStatement.entry, function (entry) {
                                    fetchStore.setValue(item, entry.field, entry.value);
                        });
                                return true;
                        }
                        })) {
                            self._saveStoreData(setStatement.tableId, fetchStore);
                            dfrd.resolve({ success: true });
                        } else {
                            deferred.reject(new ErrorMessage(ErrorMessage.Types.Update));
                        }
                    },
                    onError: function () {
                        deferred.reject(new ErrorMessage(ErrorMessage.Types.Update));
                    }
                });
            } else {
                deferred.reject(new ErrorMessage(ErrorMessage.Types.Update));
            }

            return dfrd.promise;
        },

        insertColumns: function (insertStatement) {
            var deferred = new Deferred();

            setTimeout(function () {
                deferred.resolve();
            }, 0);

            return deferred.promise;
        }
    });
});