module MyBestPro.lib
{

    export class IndexedDB implements ng.IServiceProvider
    {
        public static $inject = ['$indexedDBProvider', 'MBPLogProvider'];

        public tables = { };
        public databaseName : string;
        public databaseVersion : number;

        constructor(private $indexedDBProvider, private MBPLogProvider : MyBestPro.lib.Log)
        {

        }

        public $get = [
            '$indexedDB',
            function($indexedDB) {
                return $indexedDB;
            }
        ];

        public addTable(tableName : string, tableConfig : any) : IndexedDB
        {
            this.tables[tableName] = tableConfig;
            this.MBPLogProvider.debug('MBPIndexedDB: Add table ' + tableName + ' with configuration - ', tableConfig);
            return this;
        }

        public setDB(databaseName : string, databaseVersion : number) : IndexedDB
        {
            this.databaseName = databaseName;
            this.databaseVersion = databaseVersion;
            this.MBPLogProvider.debug('MBPIndexedDB: Set DB with ' + databaseName + ' version ' + databaseVersion);
            return this;
        }

        public initDatabase()
        {
            var that = this;
            that
                .$indexedDBProvider
                .connection(that.databaseName)
                .upgradeDatabase(that.databaseVersion, function (event, db, tx) {
                    that.MBPLogProvider.log('MBPIndexedDB: Start droping database ' + that.databaseName + ' ...');
                    that.MBPLogProvider.debug('MBPIndecedDB: Tables to drop - ', db.objectStoreNames);
                    angular.forEach(db.objectStoreNames, function(tableName) {
                        that.MBPLogProvider.log('MBPIndexedDB: Delete table ' + tableName);
                        db.deleteObjectStore(tableName);
                    });
                    that.MBPLogProvider.log('MBPIndexedDB: Start creating database ' + that.databaseName + ' ...');
                    that.MBPLogProvider.debug('MBPIndecedDB: Tables to generate - ', that.tables);
                    angular.forEach(that.tables, function(table, tableName) {
                        that.MBPLogProvider.log('MBPIndexedDB: Start upgrading table ' + tableName);
                        that.MBPLogProvider.debug('MBPIndexedDB: Table configuration - ', table);
                        var objectStore = db.createObjectStore(tableName, { keyPath: table.keyPath });
                        angular.forEach(table.columns, function (column, columnName) {
                            that.MBPLogProvider.log('MBPIndexedDB: Start indexing table column ' + tableName + '.' + columnName);
                            that.MBPLogProvider.debug('MBPIndexedDB: Column indexing configuration - ', column);
                            objectStore.createIndex(columnName + '_idx', columnName, column);
                        });
                    });
                });
        }
    }

}
angular.module('MyBestPro').provider('MBPIndexedDB', MyBestPro.lib.IndexedDB);