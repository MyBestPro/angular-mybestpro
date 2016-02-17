namespace MyBestPro.lib {

    'use strict';

    export class IndexedDB implements ng.IServiceProvider {
        public static $inject: Array<string> = [
            '$indexedDBProvider',
            'MBPLogProvider',
        ];

        public tables: any = { };
        public databaseName: any = '';
        public databaseVersion: number = 0;

        protected logPrefix: string = 'MBPIndexedDB: ';

        constructor(
            private $indexedDBProvider: any,
            private log: MyBestPro.lib.Log
        ) {

        }

        public $get: Array<any> = [
            '$indexedDB',
            function($indexedDB: any): any {
                return $indexedDB;
            },
        ];

        public traceDebug(message: string, ...args: any[]): void {
            this.log.debug(this.logPrefix + message);
            if (arguments.length) {
                this.log.debug(arguments);
            }
        }

        public traceInfo(message: string, ...args: any[]): void {
            this.log.info(this.logPrefix + message);
            if (arguments.length) {
                this.log.info(arguments);
            }
        }

        public addTable(tableName: string, tableConfig: any): IndexedDB {
            this.tables[tableName] = tableConfig;
            this.traceDebug(
                'Add table ' + tableName + ' with configuration',
                tableConfig
            );
            return this;
        }

        public setDB(databaseName: string, databaseVersion: number): IndexedDB {
            this.databaseName = databaseName;
            this.databaseVersion = databaseVersion;
            this.traceDebug(
                'Set DB with ' + databaseName + ' version ' + databaseVersion
            );
            return this;
        }

        public upgradeDatabase(
            that: MyBestPro.lib.IndexedDB,
            db: IDBDatabase
        ): void {
            that.traceInfo(
                'Start droping database ' + that.databaseName + ' ...'
            );
            that.traceDebug('Tables to drop - ', db.objectStoreNames);
            angular.forEach(
                db.objectStoreNames,
                function(tableName: string): void {
                    that.traceInfo('Delete table ' + tableName);
                    db.deleteObjectStore(tableName);
                }
            );
            that.traceInfo(
                'Start creating database ' + that.databaseName + ' ...'
            );
            that.traceDebug('Tables to generate - ', that.tables);
            angular.forEach(
                that.tables,
                function(table: any, tableName: string): void {
                    that.upgradeTable(db, table, tableName);
                }
            );
        }

        public upgradeTable(
            db: IDBDatabase,
            table: any,
            tableName: string
        ): void {
            let that: MyBestPro.lib.IndexedDB = this;
            let tableConfiguration: any = {
                keyPath: table.keyPath,
                autoIncrement: table.autoIncrement || false,
            };
            that.traceInfo('Start upgrading table ' + tableName);
            that.traceDebug('Table configuration - ', table);
            let objectStore: IDBObjectStore = db.createObjectStore(
                tableName,
                tableConfiguration
            );
            angular.forEach(
                table.columns,
                function(column: any, columnName: string): void {
                    that.traceInfo(
                        'Start indexing table column ' +
                        tableName + '.' + columnName
                    );
                    that.traceDebug('Column indexing configuration - ', column);
                    objectStore.createIndex(
                        columnName + '_idx',
                        columnName,
                        column
                    );
                }
            );
        }

        public initDatabase(): void {
            let that: MyBestPro.lib.IndexedDB = this;
            that.$indexedDBProvider
                .connection(that.databaseName)
                .upgradeDatabase(
                    this.databaseVersion,
                    function(
                        event: Event,
                        db: IDBDatabase,
                        tx: IDBTransaction
                    ): void {
                        that.upgradeDatabase(that, db);
                    }
                );
        }
    }

}
angular.module('MyBestPro').provider('MBPIndexedDB', MyBestPro.lib.IndexedDB);
