angular.module('MyBestPro', ['indexedDB']);

var MyBestPro;
(function (MyBestPro) {
    var lib;
    (function (lib) {
        'use strict';
        var Log = (function () {
            function Log() {
                this.LOG_INACTIVE = -1;
                this.LOG_ERROR = 0;
                this.LOG_WARNING = 1;
                this.LOG_INFO = 2;
                this.LOG_LOG = 3;
                this.LOG_DEBUG = 4;
                this.level = 3;
                this.displayMode = true;
                this.messages = [];
                this.consoles = {
                    0: console.error,
                    1: console.warn,
                    2: console.info,
                    3: console.log,
                    4: console.debug,
                };
                this.levels = {
                    0: 'error',
                    1: 'warning',
                    2: 'info',
                    3: 'log',
                    4: 'debug',
                };
            }
            Log.prototype.$get = function () {
                return {
                    LOG_INACTIVE: this.LOG_INACTIVE,
                    LOG_ERROR: this.LOG_ERROR,
                    LOG_WARNING: this.LOG_WARNING,
                    LOG_INFO: this.LOG_INFO,
                    LOG_LOG: this.LOG_LOG,
                    LOG_DEBUG: this.LOG_DEBUG,
                    level: this.level,
                    levels: this.levels,
                    consoles: this.consoles,
                    messages: this.messages,
                    callbackReceivedLog: this.callbackReceivedLog,
                    callbackChangeStatus: this.callbackChangeStatus,
                    debug: this.debug,
                    info: this.info,
                    error: this.error,
                    warn: this.warn,
                    log: this.log,
                    time: this.time,
                    timeEnd: this.timeEnd,
                    message: this.message,
                    displayMode: this.displayMode,
                    setDisplayMode: this.setDisplayMode,
                    onReceivedLog: this.onReceivedLog,
                    onChangeStatus: this.onChangeStatus,
                    getHistory: this.getHistory,
                    getDisplayMode: this.getDisplayMode,
                };
            };
            Log.prototype.debug = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.message(this.LOG_DEBUG, arguments);
            };
            Log.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.message(this.LOG_INFO, arguments);
            };
            Log.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.message(this.LOG_ERROR, arguments);
            };
            Log.prototype.log = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.message(this.LOG_LOG, arguments);
            };
            Log.prototype.warn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.message(this.LOG_WARNING, arguments);
            };
            Log.prototype.setLevel = function (level) {
                this.level = level;
            };
            Log.prototype.setDisplayMode = function (enabled) {
                this.displayMode = enabled;
                if (this.callbackChangeStatus) {
                    this.callbackChangeStatus.apply(this, [enabled]);
                }
            };
            Log.prototype.getDisplayMode = function () {
                return this.displayMode;
            };
            Log.prototype.time = function (timerName, level) {
                if (level === void 0) { level = this.LOG_DEBUG; }
                if (level > this.level) {
                    return;
                }
                console.time(timerName);
            };
            Log.prototype.timeEnd = function (timerName, level) {
                if (level === void 0) { level = this.LOG_DEBUG; }
                if (level > this.level) {
                    return;
                }
                console.timeEnd(timerName);
            };
            Log.prototype.onReceivedLog = function (callbackReceivedLog) {
                this.callbackReceivedLog = callbackReceivedLog;
            };
            Log.prototype.onChangeStatus = function (callbackChangeStatus) {
                this.callbackChangeStatus = callbackChangeStatus;
            };
            Log.prototype.getHistory = function () {
                return this.messages;
            };
            Log.prototype.message = function (level, data) {
                if (level > this.level) {
                    return;
                }
                this.messages.push({ level: this.levels[level], data: data });
                this.consoles[level].apply(console, data);
                if (this.callbackReceivedLog) {
                    this.callbackReceivedLog.apply(this, [this.levels[level], data]);
                }
            };
            Log.$inject = [];
            return Log;
        })();
        lib.Log = Log;
    })(lib = MyBestPro.lib || (MyBestPro.lib = {}));
})(MyBestPro || (MyBestPro = {}));
angular.module('MyBestPro').provider('MBPLog', MyBestPro.lib.Log);

var MyBestPro;
(function (MyBestPro) {
    var lib;
    (function (lib) {
        'use strict';
        var IndexedDB = (function () {
            function IndexedDB($indexedDBProvider, log) {
                this.$indexedDBProvider = $indexedDBProvider;
                this.log = log;
                this.tables = {};
                this.databaseName = '';
                this.databaseVersion = 0;
                this.logPrefix = 'MBPIndexedDB: ';
                this.$get = [
                    '$indexedDB',
                    function ($indexedDB) {
                        return $indexedDB;
                    },
                ];
            }
            IndexedDB.prototype.traceDebug = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.log.debug(this.logPrefix + message);
                if (arguments.length) {
                    this.log.debug(arguments);
                }
            };
            IndexedDB.prototype.traceInfo = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.log.info(this.logPrefix + message);
                if (arguments.length) {
                    this.log.info(arguments);
                }
            };
            IndexedDB.prototype.addTable = function (tableName, tableConfig) {
                this.tables[tableName] = tableConfig;
                this.traceDebug('Add table ' + tableName + ' with configuration', tableConfig);
                return this;
            };
            IndexedDB.prototype.setDB = function (databaseName, databaseVersion) {
                this.databaseName = databaseName;
                this.databaseVersion = databaseVersion;
                this.traceDebug('Set DB with ' + databaseName + ' version ' + databaseVersion);
                return this;
            };
            IndexedDB.prototype.upgradeDatabase = function (that, db) {
                that.traceInfo('Start droping database ' + that.databaseName + ' ...');
                that.traceDebug('Tables to drop - ', db.objectStoreNames);
                angular.forEach(db.objectStoreNames, function (tableName) {
                    that.traceInfo('Delete table ' + tableName);
                    db.deleteObjectStore(tableName);
                });
                that.traceInfo('Start creating database ' + that.databaseName + ' ...');
                that.traceDebug('Tables to generate - ', that.tables);
                angular.forEach(that.tables, function (table, tableName) {
                    that.upgradeTable(db, table, tableName);
                });
            };
            IndexedDB.prototype.upgradeTable = function (db, table, tableName) {
                var that = this;
                var tableConfiguration = {
                    keyPath: table.keyPath
                };
                that.traceInfo('Start upgrading table ' + tableName);
                that.traceDebug('Table configuration - ', table);
                var objectStore = db.createObjectStore(tableName, tableConfiguration);
                angular.forEach(table.columns, function (column, columnName) {
                    that.traceInfo('Start indexing table column ' +
                        tableName + '.' + columnName);
                    that.traceDebug('Column indexing configuration - ', column);
                    objectStore.createIndex(columnName + '_idx', columnName, column);
                });
            };
            IndexedDB.prototype.initDatabase = function () {
                var that = this;
                that.$indexedDBProvider
                    .connection(that.databaseName)
                    .upgradeDatabase(this.databaseVersion, function (event, db, tx) {
                    that.upgradeDatabase(that, db);
                });
            };
            IndexedDB.$inject = [
                '$indexedDBProvider',
                'MBPLogProvider',
            ];
            return IndexedDB;
        })();
        lib.IndexedDB = IndexedDB;
    })(lib = MyBestPro.lib || (MyBestPro.lib = {}));
})(MyBestPro || (MyBestPro = {}));
angular.module('MyBestPro').provider('MBPIndexedDB', MyBestPro.lib.IndexedDB);

var MyBestPro;
(function (MyBestPro) {
    var lib;
    (function (lib) {
        'use strict';
        var NotificationPush = (function () {
            function NotificationPush(log) {
                this.log = log;
                this.logPrefix = 'MBPNotificationPush: ';
                this.configurations = {
                    android: {
                        senderID: '',
                        icon: '',
                        iconColor: '',
                        sound: true,
                        vibrate: true,
                        clearNotifications: true,
                        forceShow: false,
                        topics: [],
                    },
                    ios: {
                        senderID: '',
                        alert: false,
                        badge: false,
                        sound: false,
                        clearBadge: false,
                        gcmSandbox: false,
                        topics: [],
                        categories: {},
                    },
                    windows: {},
                };
                this.$get = [
                    '$window',
                    '$q',
                    'MBPLog',
                    function ($window, $q) {
                        return {
                            notification: null,
                            configurations: this.configurations,
                            /**
                             * Note: like all plugins you must wait until you receive
                             * the deviceready event before calling init().
                             * @returns {IPromise}
                             */
                            init: function () {
                                var defer = $q.defer();
                                if (typeof $window.cordova === 'undefined') {
                                    defer.reject('Environment not integrate cordova');
                                    this.traceError('Environment not integrate cordova');
                                    return defer.promise;
                                }
                                this.traceInfo('Initialize notification push');
                                this.traceDebug('Using configuration - ', this.configurations);
                                this.notification = PushNotification.init(this.configurations);
                                defer.resolve(this);
                                return defer.promise;
                            },
                            hasInitialized: function () {
                                return this.notification !== null;
                            },
                            hasPermission: function () {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return false;
                                }
                                return this.notification.hasPermission();
                            },
                            /**
                             * The event registration will be triggered on each
                             * successful registration with the 3rd party push service.
                             * @param callback
                             * @returns {NotificationPush}
                             */
                            onRegistration: function (callback) {
                                this.on('registration', callback);
                                return this;
                            },
                            /**
                             * The event error will trigger when an internal error
                             * occurs and the cache is aborted.
                             * @param callback
                             * @returns {NotificationPush}
                             */
                            onError: function (callback) {
                                this.on('error', callback);
                                return this;
                            },
                            /**
                             * The event notification will be triggered each time a
                             * push notification is received by a 3rd party push
                             * service on the device.
                             * @param callback
                             * @returns {NotificationPush}
                             */
                            onNotification: function (callback) {
                                this.on('notification', callback);
                                return this;
                            },
                            /**
                             * @param eventName
                             * @param callback
                             * @returns {NotificationPush}
                             */
                            on: function (eventName, callback) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.on(eventName, callback);
                                return this;
                            },
                            /**
                             * Removes a previously registered callback for an event.
                             * @param eventName
                             * @param callback
                             * @returns {NotificationPush}
                             */
                            off: function (eventName, callback) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.off(eventName, callback);
                                return this;
                            },
                            /**
                             * The unregister method is used when the application no
                             * longer wants to receive push notifications.
                             * Beware that this cleans up all event handlers previously
                             * registered, so you will need to re-register
                             * them if you want them to function again without an
                             * application reload.
                             *
                             * If you provide a list of topics as an optional parameter
                             * then the application will unsubscribe from
                             * these topics but continue to receive other push messages.
                             *
                             * @param successHandler
                             * @param errorHandler
                             * @param topics
                             * @returns {NotificationPush}
                             */
                            unregister: function (successHandler, errorHandler, topics) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.unregister(successHandler, errorHandler, topics);
                                return this;
                            },
                            /**
                             * Set the badge count visible when the app is not running
                             * (iOS only)
                             * @param successHandler
                             * @param errorHandler
                             * @param count
                             * @returns {NotificationPush}
                             */
                            setApplicationIconBadgenumber: function (successHandler, errorHandler, count) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.setApplicationIconBadgenumber(successHandler, errorHandler, count);
                                return this;
                            },
                            /**
                             * Get the current badge count visible when the app is not
                             * running (iOS only)
                             * @param successHandler
                             * @param errorHandler
                             * @returns {NotificationPush}
                             */
                            getApplicationIconBadgenumber: function (successHandler, errorHandler) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.getApplicationIconBadgenumber(successHandler, errorHandler);
                                return this;
                            },
                            /**
                             * Tells the OS that you are done processing a background
                             * push notification. (iOS Only)
                             * @param successHandler
                             * @param errorHandler
                             * @returns {NotificationPush}
                             */
                            finish: function (successHandler, errorHandler) {
                                if (!this.hasInitialized()) {
                                    this.traceError('You have not initialized notification push');
                                    return this;
                                }
                                this.notification.finish(successHandler, errorHandler);
                                return this;
                            },
                        };
                    },
                ];
            }
            NotificationPush.prototype.traceDebug = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.log.debug(this.logPrefix + message);
                if (arguments.length) {
                    this.log.debug(arguments);
                }
            };
            NotificationPush.prototype.traceInfo = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.log.info(this.logPrefix + message);
                if (arguments.length) {
                    this.log.info(arguments);
                }
            };
            NotificationPush.prototype.traceError = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.log.error(this.logPrefix + message);
                if (arguments.length) {
                    this.log.error(arguments);
                }
            };
            /**
             * Activate sound for all devices
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateSound = function () {
                return this
                    .activateAndroidSound()
                    .activateIosSound();
            };
            /**
             * Deactivate sound for all devices
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateSound = function () {
                return this
                    .deactivateAndroidSound()
                    .deactivateIosSound();
            };
            /**
             * To subscribe to a GcmPubSub topic for all devices
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.addTopic = function (topic) {
                return this
                    .addAndroidTopic(topic)
                    .addIosTopic(topic);
            };
            /**
             * Setting this uses GCM for notifications instead of native
             * @param senderID
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setIosSenderID = function (senderID) {
                this.configurations.ios.senderID = senderID;
                return this;
            };
            /**
             * The device shows an alert on receipt of notification.
             * Note: the value you set this option to the first time you call
             * the init method will be how the application always acts.
             * Once this is set programmatically in the init method it can only
             * be changed manually by the user in Settings>Notifications>App Name.
             * This is normal iOS behaviour.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateIosAlert = function () {
                this.configurations.ios.alert = true;
                return this;
            };
            /**
             * The device no shows an alert on receipt of notification.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateIosAlert = function () {
                this.configurations.ios.alert = false;
                return this;
            };
            /**
             * The device sets the badge number on receipt of notification.
             * Note: the value you set this option to the first time you call
             * the init method will be how the application always acts.
             * Once this is set programmatically in the init method it can only
             * be changed manually by the user in Settings>Notifications>App Name.
             * This is normal iOS behaviour.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateIosBadge = function () {
                this.configurations.ios.badge = true;
                return this;
            };
            /**
             * The device not sets the badge number on receipt of notification.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateIosBadge = function () {
                this.configurations.ios.badge = false;
                return this;
            };
            /**
             * The device plays a sound on receipt of notification.
             * Note: the value you set this option to the first time you call
             * the init method will be how the application always acts. O
             * nce this is set programmatically in the init method it can only be
             * changed manually by the user in Settings>Notifications>App Name.
             * This is normal iOS behaviour.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateIosSound = function () {
                this.configurations.ios.sound = true;
                return this;
            };
            /**
             * The device not plays a sound on receipt of notification.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateIosSound = function () {
                this.configurations.ios.sound = false;
                return this;
            };
            /**
             * The badge will be cleared on app startup.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateIosClearBadge = function () {
                this.configurations.ios.clearBadge = true;
                return this;
            };
            /**
             * The badge will not be cleared on app startup.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateIosClearBadge = function () {
                this.configurations.ios.clearBadge = false;
                return this;
            };
            /**
             * Whether to use sandbox GCM setting.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateIosGcmSandbox = function () {
                this.configurations.ios.gcmSandbox = true;
                return this;
            };
            /**
             * Whether to use prod GCM setting.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateIosGcmSandbox = function () {
                this.configurations.ios.gcmSandbox = false;
                return this;
            };
            /**
             * To subscribe to a GcmPubSub topic.
             * Note: only usable in conjunction with senderID.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.addIosTopic = function (topic) {
                this.configurations.ios.topics.push(topic);
                return this;
            };
            /**
             * Set full ios configuration
             * @param configuration
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setIosConfiguration = function (configuration) {
                this.configurations.ios = configuration;
                return this;
            };
            /**
             * Maps to the project number in the Google Developer Console.
             * @param senderID: string
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setAndroidId = function (senderID) {
                this.configurations.android.senderID = senderID;
                return this;
            };
            /**
             * https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/
             * API.md#android
             * http://developer.android.com/reference/android/graphics/Color.html
             * #parseColor(java.lang.String)
             * @param iconName: string - The name of a drawable resource to use as
             * the small-icon. The name should not include the extension.
             * @param iconBackgroundColor: string - Sets the background color of
             * the small icon on Android 5.0 and greater.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setAndroidIcon = function (iconName, iconBackgroundColor) {
                this.configurations.android.icon = iconName;
                return this;
            };
            /**
             * It plays the sound specified in the push data or the default
             * system sound.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateAndroidSound = function () {
                this.configurations.android.sound = true;
                return this;
            };
            /**
             * It not plays the sound specified in the push data or the default
             * system sound.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateAndroidSound = function () {
                this.configurations.android.sound = false;
                return this;
            };
            /**
             * The device vibrates on receipt of notification.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateAndroidVibrate = function () {
                this.configurations.android.vibrate = true;
                return this;
            };
            /**
             * The device not vibrates on receipt of notification.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateAndroidVibrate = function () {
                this.configurations.android.vibrate = false;
                return this;
            };
            /**
             * The app clears all pending notifications when it is closed.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateAndroidClearNotification = function () {
                this.configurations.android.clearNotifications = true;
                return this;
            };
            /**
             * The app no clears all pending notifications when it is closed.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateAndroidClearNotification = function () {
                this.configurations.android.forceShow = false;
                return this;
            };
            /**
             * Will always show a notification, even when the app is on the
             * foreground.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.activateAndroidForceShow = function () {
                this.configurations.android.forceShow = true;
                return this;
            };
            /**
             * Will not always show a notification, even when the app is on the
             * foreground.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.deactivateAndroidForceShow = function () {
                this.configurations.android.forceShow = false;
                return this;
            };
            /**
             * To subscribe to a GcmPubSub topic.
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.addAndroidTopic = function (topic) {
                this.configurations.android.topics.push(topic);
                return this;
            };
            /**
             * Set full android configuration
             * @param configuration
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setAndroidConfiguration = function (configuration) {
                this.configurations.android = configuration;
                return this;
            };
            /**
             * Set full windows configuration
             * @param configuration
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setWindowsConfiguration = function (configuration) {
                this.configurations.windows = configuration;
                return this;
            };
            /**
             * Set full configuration
             * @param configuration
             * @returns {NotificationPush}
             */
            NotificationPush.prototype.setConfiguration = function (configuration) {
                this.configurations = configuration;
                return this;
            };
            NotificationPush.$inject = ['MBPLogProvider'];
            return NotificationPush;
        })();
        lib.NotificationPush = NotificationPush;
    })(lib = MyBestPro.lib || (MyBestPro.lib = {}));
})(MyBestPro || (MyBestPro = {}));
angular.module('MyBestPro')
    .provider('MBPNotificationPush', MyBestPro.lib.NotificationPush);

var MyBestPro;
(function (MyBestPro) {
    var controller;
    (function (controller) {
        'use strict';
        var Log = (function () {
            function Log($scope, log) {
                this.$scope = $scope;
                this.log = log;
                this.$inject = ['$scope', 'MBPLog'];
                $scope.displayMode = log.getDisplayMode();
                $scope.messages = log.getHistory();
                log.onReceivedLog(function (level, data) {
                    $scope.messages.push({
                        level: level,
                        data: JSON.stringify(data),
                    });
                });
                log.onChangeStatus(function (displayMode) {
                    $scope.displayMode = displayMode;
                });
            }
            return Log;
        })();
        controller.Log = Log;
    })(controller = MyBestPro.controller || (MyBestPro.controller = {}));
})(MyBestPro || (MyBestPro = {}));

var MyBestPro;
(function (MyBestPro) {
    var component;
    (function (component) {
        'use strict';
        function Log() {
            return {
                restrict: 'E',
                scope: {},
                template: ['<ul>',
                    '<li ng-repeat="message in messages" ',
                    ' ng-show="displayMode" class="mbp-log-{{ message.level }}">',
                    '<strong ng-bind="message.level"></strong>',
                    ' {{ message.data }}</li>',
                ].join(''),
                controller: MyBestPro.controller.Log,
            };
        }
        component.Log = Log;
    })(component = MyBestPro.component || (MyBestPro.component = {}));
})(MyBestPro || (MyBestPro = {}));
angular.module('MyBestPro').directive('mbpLog', MyBestPro.component.Log);
