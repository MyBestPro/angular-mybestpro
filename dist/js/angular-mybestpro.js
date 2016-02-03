angular.module('MyBestPro', []);

var MyBestPro;
(function (MyBestPro) {
    var lib;
    (function (lib) {
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
                    getDisplayMode: this.getDisplayMode
                };
            };
            Log.prototype.debug = function () {
                this.message(this.LOG_DEBUG, arguments);
            };
            Log.prototype.info = function () {
                this.message(this.LOG_INFO, arguments);
            };
            Log.prototype.error = function () {
                this.message(this.LOG_ERROR, arguments);
            };
            Log.prototype.log = function () {
                this.message(this.LOG_LOG, arguments);
            };
            Log.prototype.warn = function () {
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
            Log.prototype.onReceivedLog = function (callbackReceivedLog) {
                this.callbackReceivedLog = callbackReceivedLog;
            };
            Log.prototype.onChangeStatus = function (callbackChangeStatus) {
                this.callbackChangeStatus = callbackChangeStatus;
            };
            Log.prototype.getHistory = function () {
                return this.messages;
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
    var controller;
    (function (controller) {
        var Log = (function () {
            function Log($scope, MBPLog) {
                this.$scope = $scope;
                this.MBPLog = MBPLog;
                this.$inject = ['$scope', 'MBPLog'];
                $scope.displayMode = MBPLog.getDisplayMode();
                $scope.messages = MBPLog.getHistory();
                MBPLog.onReceivedLog(function (level, data) {
                    $scope.messages.push({
                        level: level,
                        data: JSON.stringify(data)
                    });
                });
                MBPLog.onChangeStatus(function (displayMode) {
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
        function Log() {
            return {
                restrict: 'E',
                scope: {},
                template: '<ul><li ng-repeat="message in messages" ng-show="displayMode" class="mbp-log-{{ message.level }}"><strong ng-bind="message.level"></strong> {{ message.data }}</li>',
                controller: MyBestPro.controller.Log
            };
        }
        component.Log = Log;
    })(component = MyBestPro.component || (MyBestPro.component = {}));
})(MyBestPro || (MyBestPro = {}));
angular.module('MyBestPro').directive('mbpLog', MyBestPro.component.Log);
